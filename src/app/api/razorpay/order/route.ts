import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { products } from "@/lib/products";
import { getVerifiedUserFromRequest } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getVerifiedUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Missing or invalid Authorization Bearer token" },
        { status: 401 }
      );
    }

    let body: { productId?: string; amountInINR?: number };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const productId = body.productId;
    if (!productId || typeof productId !== "string") {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const staticProduct = products.find((p) => p.id === productId);
    
    if (!staticProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const amountPaise = staticProduct.priceInINR * 100;

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error("Razorpay keys missing in environment variables");
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `order_${productId}_${Date.now()}`.slice(0, 40),
      notes: {
        productId,
        userId: user.uid,
        email: user.email
      }
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error creating Razorpay order", error);

    if (error instanceof Error && error.message === "Razorpay keys missing in environment variables") {
      return NextResponse.json(
        { error: "Razorpay not configured", message: error.message },
        { status: 500 }
      );
    }

    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Razorpay order failed", message },
      { status: 500 }
    );
  }
}
