import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserFromRequest } from "@/lib/server-auth";
import { getAdminApp } from "@/lib/firebase-admin";
import { hasPurchasedProduct } from "@/lib/orders-admin";

export async function POST(req: NextRequest) {
  try {
    const user = await getVerifiedUserFromRequest(req);

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // 🔥 PURCHASE CHECK (ONLY CUSTOMERS CAN REVIEW)
    const purchased = await hasPurchasedProduct(user.email, productId);
    if (!purchased) {
      return NextResponse.json(
        { error: "Only verified buyers can leave reviews" },
        { status: 403 }
      );
    }

    const db = getAdminApp().firestore();

    await db.collection("reviews").add({
      productId,
      userEmail: user.email,
      rating,
      comment,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}