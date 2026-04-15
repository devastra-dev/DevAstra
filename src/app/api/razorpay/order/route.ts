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
    let amountPaise: number;
    if (staticProduct) {
      amountPaise = staticProduct.priceInINR * 100;
    } else if (
      typeof body.amountInINR === "number" &&
      Number.isFinite(body.amountInINR) &&
      body.amountInINR > 0
    ) {
      amountPaise = Math.round(body.amountInINR * 100);
    } else {
      return NextResponse.json(
        { error: "Invalid product or missing amountInINR" },
        { status: 400 }
      );
    }

    console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

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
    console.error("Error creating Razorpay order", error);
    if (error && typeof error === "object") {
      console.error("Razorpay error details:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    }

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
