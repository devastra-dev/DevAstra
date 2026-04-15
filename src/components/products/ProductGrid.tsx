"use client";

import Link from "next/link";
import { products } from "@/lib/products";

export function ProductGrid({ limit }: { limit?: number }) {
  const items = limit ? products.slice(0, limit) : products;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((p) => (
        <div key={p.id} className="border p-4 rounded-xl">
          <h2>{p.title}</h2>
          <p>₹ {p.priceInINR}</p>

          <Link href={`/products/${p.id}`}>
            View
          </Link>
        </div>
      ))}
    </div>
  );
}