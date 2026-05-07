import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserFromRequest } from "@/lib/server-auth";
import {
  hasPurchasedProduct,
  incrementDownloadCount
} from "@/lib/orders-admin";
import { products } from "@/lib/products";
import { getProductZipSignedUrl } from "@/lib/storage-download";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // =========================
    // 🔐 AUTH CHECK
    // =========================
    if (!req.headers.get("authorization")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // =========================
    // 🔥 PARAM (Next 16 FIX)
    // =========================
    const { id } = await context.params;
    const productId = id?.trim();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Log in development only
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("📥 DOWNLOAD REQUEST:", productId);
    }

    // =========================
    // 🔐 AUTH
    // =========================
    const user = await getVerifiedUserFromRequest(req);

    if (!user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = normalizeEmail(user.email);

    // =========================
    // 📦 PRODUCT CHECK (SAFE MATCH)
    // =========================
    const product = products.find(
      (p) => p.id.toLowerCase() === productId.toLowerCase()
    );

    if (!product) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("❌ Product NOT FOUND:", productId);
        // eslint-disable-next-line no-console
        console.log("Available:", products.map((p) => p.id));
      }

      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // =========================
    // 🔥 PURCHASE CHECK
    // =========================
    const purchased = await hasPurchasedProduct(email, product.id);

    if (!purchased) {
      return NextResponse.json(
        { error: "You have not purchased this product" },
        { status: 403 }
      );
    }

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("✅ PURCHASE VERIFIED:", email, product.id);
    }

    // =========================
    // 🔗 DOWNLOAD SOURCE RESOLUTION
    // =========================
    let downloadUrl: string | null = null;
    let source: "storage" | "drive" = "drive";

    // 🔥 TRY STORAGE FIRST
    try {
      const signedUrlResult = await getProductZipSignedUrl(product.id);

      if (!("error" in signedUrlResult)) {
        downloadUrl = signedUrlResult.url;
        source = "storage";
        if (process.env.NODE_ENV === "development") {
          // eslint-disable-next-line no-console
          console.log("🚀 Using Firebase Storage");
        }
      } else if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("⚠️ Storage not found → fallback");
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("⚠️ Storage error → fallback", e);
      }
    }

    // 🔥 FALLBACK → GOOGLE DRIVE
    if (!downloadUrl) {
      if (!product.downloadUrl) {
        return NextResponse.json(
          { error: "No download source available" },
          { status: 500 }
        );
      }

      downloadUrl = product.downloadUrl;
      source = "drive";
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.log("🚀 Using Google Drive fallback");
      }
    }

    // =========================
    // 🔒 DOWNLOAD LIMIT + TRACKING
    // =========================
    try {
      await incrementDownloadCount(email, product.id, {
        ip: req.headers.get("x-forwarded-for") || "unknown",
        userAgent: req.headers.get("user-agent") || "unknown"
      });
    } catch (e: unknown) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.warn("❌ Download blocked:", (e as { message?: string })?.message);
      }

      return NextResponse.json(
        { error: "Download limit reached (max 5)" },
        { status: 403 }
      );
    }

    // =========================
    // 🚀 SUCCESS RESPONSE
    // =========================
    return NextResponse.json({
      success: true,
      url: downloadUrl,
      source // 🔥 debug / analytics ready
    });

  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("❌ DOWNLOAD ERROR:", err);
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}