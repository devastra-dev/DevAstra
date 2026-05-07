"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};
const card = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export function FeaturedProducts() {
  const featured = products.filter((p) => p.isFeatured).slice(0, 3);
  const display = featured.length >= 3 ? featured : products.slice(0, 3);

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-violet-400 uppercase tracking-[0.25em]">
            Catalog
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Featured Drops
          </h2>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-slate-400 hover:text-violet-300 transition-colors duration-200 tracking-wide flex items-center gap-1.5 group shrink-0"
        >
          View all
          <motion.span
            className="inline-block"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            →
          </motion.span>
        </Link>
      </div>

      {/* Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-3"
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {display.map((p) => (
          <motion.article
            key={p.id}
            variants={card}
            whileHover={{ y: -6, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="group relative flex flex-col rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Top shimmer on hover */}
            <div
              aria-hidden
              className="absolute top-0 left-[15%] right-[15%] h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(6,182,212,0.4), transparent)",
              }}
            />

            {/* Image area */}
            {p.images?.[0] && (
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={p.images[0]}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ opacity: 0.7 }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(6,6,16,0.95) 0%, rgba(6,6,16,0.3) 60%, transparent 100%)",
                  }}
                />
                {/* Badge */}
                {p.badge && (
                  <span
                    className="absolute top-3 right-3 text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.35)",
                      color: "#a78bfa",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>
            )}

            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-3 gap-2">
                <span className="text-[10px] font-mono text-violet-400/70 uppercase tracking-widest">
                  {p.stackLabel}
                </span>
                <span
                  className="text-xs font-bold font-mono shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {p.isFree ? "FREE" : `₹${p.priceInINR}`}
                </span>
              </div>

              <h3 className="text-[0.95rem] font-semibold text-white mb-2 group-hover:text-violet-200 transition-colors duration-200 leading-snug">
                {p.title}
              </h3>

              <p className="text-xs text-slate-400/80 line-clamp-2 leading-relaxed flex-1 mb-5">
                {p.description}
              </p>

              <Link
                href={`/products/${p.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-white transition-colors duration-200 mt-auto"
              >
                View details
                <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
                  →
                </motion.span>
              </Link>
            </div>

            {/* Bottom bar glow */}
            <div
              aria-hidden
              className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)",
              }}
            />
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}