"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Top shimmer line */}
      <div
        aria-hidden
        className="absolute top-0 left-[20%] right-[20%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.8), rgba(6,182,212,0.5), transparent)" }}
      />

      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.05))" }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Top row */}
        <div className="mb-3.5 flex items-center justify-between">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-medium text-slate-400 tracking-wide"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {product.tagline}
          </span>
          <span className="text-xs font-bold text-cyan-300 font-mono">
            ₹{product.priceInINR}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-white mb-1.5 group-hover:text-violet-200 transition-colors duration-200">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-3 mb-5 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3.5 text-[11px] text-slate-500"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <span className="font-mono tracking-wide">{product.stackLabel}</span>
          <Link
            href={`/products/${product.id}`}
            className="relative inline-flex items-center gap-1.5 font-semibold text-violet-300 hover:text-white transition-colors duration-200 group/link"
          >
            View details
            <motion.span
              className="inline-block"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
