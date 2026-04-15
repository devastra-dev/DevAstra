"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="glass-panel flex flex-col p-4 md:p-5"
    >
      <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
        <span className="rounded-full bg-slate-900/70 px-2 py-0.5 border border-slate-700/70">
          {product.tagline}
        </span>
        <span className="text-xs text-cyan-300 font-medium">₹ {product.priceInINR}</span>
      </div>

      <h3 className="text-sm md:text-base font-semibold mb-1">{product.title}</h3>
      <p className="text-xs md:text-sm text-slate-400 line-clamp-3 mb-4">
        {product.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-3 text-[11px] text-slate-400 border-t border-slate-800/70">
        <span>{product.stackLabel}</span>
        <Link
          href={`/products/${product.id}`}
          className="text-cyan-300 hover:text-cyan-200 font-medium"
        >
          View details
        </Link>
      </div>
    </motion.article>
  );
}

