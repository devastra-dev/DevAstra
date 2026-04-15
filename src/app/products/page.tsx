"use client";

import { products, Product } from "@/lib/products";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";

export default function ProductsPage() {
  const freeProducts = products.filter(p => p.isFree);
  const paidProducts = products.filter(p => !p.isFree);

  return (
    <main className="relative overflow-hidden">

      {/* 🔥 SCI-FI GRID BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/10 blur-[140px] rounded-full top-[-200px] left-1/3" />
      </div>

      <div className="container-page pt-28 pb-20 space-y-16">

        {/* HEADER */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-5xl font-bold text-white tracking-widest">
            PRODUCTS
          </h1>
          <p className="text-slate-400 max-w-xl">
            Explore futuristic developer tools & premium assets.
          </p>
        </div>

        {/* FREE */}
        {freeProducts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-green-400 tracking-wide">
              Free Products
            </h2>

            <div className="grid gap-8 md:grid-cols-3">
              {freeProducts.map((p, i) => (
                <TiltCard key={p.id} product={p} delay={i * 0.1} />
              ))}
            </div>
          </section>
        )}

        {/* PREMIUM */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Premium Products
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {paidProducts.map((p, i) => (
              <TiltCard key={p.id} product={p} delay={i * 0.1} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}

function TiltCard({ product, delay }: { product: Product; delay: number }) {
  const { purchased } = usePurchaseStatus(product.id);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-80, 80], [6, -6]);
  const rotateY = useTransform(x, [-80, 80], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.03 }}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="relative group transition duration-300 hover:z-20"
    >

      {/* BORDER */}
      <div className="absolute inset-0 rounded-2xl border border-white/10" />

      {/* CARD */}
      <div className="relative rounded-2xl bg-[#070c18] p-6 overflow-hidden transition duration-300 hover:border hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(0,255,255,0.1)]">

        {/* ACTIVE EDGE */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border border-cyan-400/30" />
        </div>

        {/* SCAN LINE */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-full h-[2px] bg-cyan-400/30 blur-sm animate-[scan_3s_linear_infinite]" />
        </div>

        {/* IMAGE */}
        <div className="mt-2 h-40 rounded-xl overflow-hidden border border-white/10 relative">
          <img
            src={product.images?.[0]}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* BADGES */}
        {product.isFree && (
          <div className="absolute top-3 left-3 text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
            FREE
          </div>
        )}

        {purchased && (
          <div className="absolute top-3 right-3 text-[10px] px-2 py-1 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
            ✔ Purchased
          </div>
        )}

        {/* CONTENT */}
        <div className="relative z-10 mt-4">
          <h2 className="text-lg font-semibold text-white tracking-wide">
            {product.title}
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            {product.stackLabel}
          </p>

          <p className="text-xs text-slate-500 mt-2 line-clamp-2">
            {product.description}
          </p>

          {/* PRICE */}
          <div className="mt-4">
            {product.isFree ? (
              <p className="text-green-400 font-semibold text-lg">FREE</p>
            ) : (
              <div className="flex items-center gap-2">
                {product.originalPrice && (
                  <span className="text-xs line-through text-slate-500">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-cyan-400 font-semibold text-lg tracking-wide">
                  ₹{product.priceInINR}
                </span>
              </div>
            )}
          </div>

          {/* BUTTON */}
          <Link
            href={`/products/${product.id}`}
            className="mt-4 inline-block px-4 py-2 rounded-lg bg-black border border-cyan-400/30 text-cyan-300 text-sm font-medium hover:bg-cyan-500/10 transition"
          >
            View Product →
          </Link>

        </div>
      </div>
    </motion.div>
  );
}