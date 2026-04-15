import { NextRequest, NextResponse } from "next/server";
import { getVerifiedUserFromRequest } from "@/lib/server-auth";
import { hasPurchasedProduct } from "@/lib/orders-admin";

export async function GET(req: NextRequest) {
  try {
    const user = await getVerifiedUserFromRequest(req);

    if (!user?.email) {
      return NextResponse.json({ purchased: false });
    }

    const productId = req.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ purchased: false });
    }

    const purchased = await hasPurchasedProduct(
      user.email,
      productId
    );

    return NextResponse.json({ purchased });

  } catch {
    return NextResponse.json({ purchased: false });
  }
}