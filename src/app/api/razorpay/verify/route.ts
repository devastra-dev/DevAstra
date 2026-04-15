import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import {
  saveOrderAdmin,
  hasPurchasedProduct
} from "@/lib/orders-admin";

import { products } from "@/lib/products";
import { getVerifiedUserFromRequest } from "@/lib/server-auth";

// 🔥 EMAIL + INVOICE
import { sendPurchaseEmail } from "@/lib/email";
import { generateInvoice } from "@/lib/invoice";

const keySecret = process.env.RAZORPAY_KEY_SECRET;

/**
 * Normalize email
 */
function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    // ❌ ENV CHECK
    if (!keySecret) {
      console.error("Missing RAZORPAY_KEY_SECRET");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    // 🔐 USER VERIFY
    const user = await getVerifiedUserFromRequest(req);

    if (!user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = normalizeEmail(user.email);

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      productId,
      amountInINR: amountInINRBody
    } = body;

    // ❌ VALIDATION
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !productId
    ) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    // 🔐 SIGNATURE VERIFY
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("Invalid Razorpay signature:", razorpay_order_id);

      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    // 🔥 DUPLICATE CHECK
    const alreadyPurchased = await hasPurchasedProduct(
      email,
      productId
    );

    if (alreadyPurchased) {
      return NextResponse.json({
        success: true,
        message: "Already purchased"
      });
    }

    // 💰 PRODUCT VALIDATION
    const product = products.find((p) => p.id === productId);

    let amountInINR: number;

    if (product) {
      amountInINR = product.priceInINR;
    } else if (
      typeof amountInINRBody === "number" &&
      Number.isFinite(amountInINRBody) &&
      amountInINRBody > 0
    ) {
      amountInINR = amountInINRBody;
    } else {
      return NextResponse.json(
        { error: "Invalid product or amount" },
        { status: 400 }
      );
    }

    // 💾 SAVE ORDER
    await saveOrderAdmin({
      userId: email,
      productId,
      amountInINR,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id
    });

    console.log("✅ Order saved:", {
      email,
      productId,
      amountInINR
    });

    // 🔥 INVOICE + EMAIL
    try {
      if (product) {
        // 📄 GENERATE PDF
        const invoiceBuffer = await generateInvoice({
          email,
          productName: product.title,
          amount: amountInINR,
          orderId: razorpay_order_id
        });

        // 📧 SEND EMAIL WITH PDF
        await sendPurchaseEmail({
          email,
          productName: product.title,
          price: amountInINR,
          invoiceBuffer
        });

        console.log("📧 Invoice email sent:", email);
      }
    } catch (emailErr) {
      console.error("Email/Invoice error:", emailErr);
      // ❗ important: payment fail না
    }

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error("❌ Verify error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}