"use client";

import { products, Product } from "@/lib/products";
import Link from "next/link";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";
import { useRef, useState, useMemo } from "react";
import Image from "next/image";

/* ── FILTER TABS ── */
type Filter = "all" | "free" | "premium";
type Sort = "default" | "price-asc" | "price-desc";

function FilterBar({ active, onFilter, sort, onSort, counts }: {
  active: Filter; onFilter: (f: Filter) => void; sort: Sort; onSort: (s: Sort) => void;
  counts: { all: number; free: number; premium: number };
}) {
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "free", label: "Free", count: counts.free },
    { key: "premium", label: "Premium", count: counts.premium },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => onFilter(t.key)}
            className="relative px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-300"
            style={{
              color: active === t.key ? "#fff" : "#64748b",
              background: active === t.key ? "rgba(124,58,237,0.15)" : "transparent",
              border: active === t.key ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
            }}
          >
            {t.label}
            <span className="ml-1.5 text-[10px] opacity-60">{t.count}</span>
          </button>
        ))}
      </div>
      <select
        value={sort}
        onChange={(e) => onSort(e.target.value as Sort)}
        className="text-xs font-mono text-slate-400 bg-transparent rounded-lg px-3 py-2 cursor-pointer outline-none"
        style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
      >
        <option value="default" style={{ background: "#0c0d1e" }}>Default</option>
        <option value="price-asc" style={{ background: "#0c0d1e" }}>Price: Low → High</option>
        <option value="price-desc" style={{ background: "#0c0d1e" }}>Price: High → Low</option>
      </select>
    </div>
  );
}

/* ── PRODUCT CARD ── */
function ProductCard({ product, delay }: { product: Product; delay: number }) {
  const { purchased } = usePurchaseStatus(product.id);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [6, -6]);
  const rotateY = useTransform(x, [-80, 80], [-6, 6]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    x.set(cx - rect.width / 2);
    y.set(cy - rect.height / 2);
    setSpotlight({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100, active: true });
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0);
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 90, damping: 18 }}
      whileHover={{ scale: 1.02 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group transition-all duration-300 hover:z-20"
    >
      {/* Hover border */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2), rgba(124,58,237,0.3))", padding: "1px", borderRadius: "inherit" }}>
        <div className="absolute inset-[1px] rounded-[calc(1rem-1px)]" style={{ background: "#0a0e1a" }} />
      </div>

      {/* Static border */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.07] pointer-events-none" />

      {/* Card body */}
      <div className="relative rounded-2xl p-5 overflow-hidden" style={{
        background: "linear-gradient(145deg, rgba(12,13,30,0.95), rgba(16,18,42,0.9))",
        backdropFilter: "blur(16px)",
        boxShadow: spotlight.active ? "0 0 40px rgba(124,58,237,0.06), 0 8px 32px rgba(0,0,0,0.4)" : "0 0 20px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
        transition: "box-shadow 0.4s ease",
      }}>
        {/* Spotlight */}
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ opacity: spotlight.active ? 1 : 0, background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(124,58,237,0.06) 0%, transparent 55%)` }} />

        {/* Image */}
        <div className="h-44 rounded-xl overflow-hidden relative" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <Image src={product.images?.[0] || ""} alt={product.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-all duration-700 group-hover:scale-110" style={{ opacity: spotlight.active ? 0.9 : 0.65, transition: "opacity 0.4s, transform 0.7s" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(12,13,30,0.95) 0%, rgba(12,13,30,0.3) 50%, transparent 100%)" }} />

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 right-3 z-10 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full tracking-widest uppercase" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.35)", color: "#a78bfa", backdropFilter: "blur(8px)" }}>
              {product.badge}
            </span>
          )}

          {/* Free badge */}
          {product.isFree && (
            <span className="absolute top-3 left-3 z-10 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full tracking-widest" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
              ◈ FREE
            </span>
          )}

          {/* Purchased badge */}
          {purchased && (
            <span className="absolute top-3 right-3 z-10 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full flex items-center gap-1 tracking-wider" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 4l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" /></svg>
              OWNED
            </span>
          )}
        </div>

        {/* Content */}
        <div className="relative z-10 mt-4 space-y-2">
          <p className="text-[10px] font-mono tracking-[0.15em] text-violet-400/60 uppercase">{product.stackLabel}</p>
          <h2 className="text-[0.95rem] font-semibold text-white tracking-wide leading-snug">{product.title}</h2>
          <p className="text-[12px] text-slate-400/80 line-clamp-2 leading-relaxed">{product.description}</p>

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            {product.isFree ? (
              <span className="font-bold text-lg text-emerald-400">FREE</span>
            ) : (
              <>
                {product.originalPrice && <span className="text-xs line-through text-slate-600 font-mono">₹{product.originalPrice}</span>}
                <span className="font-bold text-lg font-mono" style={{ background: "linear-gradient(135deg, #a78bfa, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>₹{product.priceInINR}</span>
                {product.originalPrice && <span className="text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "rgba(124,58,237,0.1)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.2)" }}>DEAL</span>}
              </>
            )}
          </div>

          {/* CTA */}
          <Link
            href={`/products/${product.id}`}
            className="mt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group/btn"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.04))", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa", fontFamily: "'Space Mono', monospace", letterSpacing: "0.06em" }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.08))";
              el.style.borderColor = "rgba(124,58,237,0.5)";
              el.style.boxShadow = "0 0 25px rgba(124,58,237,0.12)";
              el.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(37,99,235,0.04))";
              el.style.borderColor = "rgba(124,58,237,0.2)";
              el.style.boxShadow = "none";
              el.style.transform = "translateY(0)";
            }}
          >
            <span>VIEW PRODUCT</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover/btn:translate-x-1">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

/* ── MAIN PAGE ── */
export default function ProductsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("default");

  const freeProducts = products.filter((p) => p.isFree);
  const paidProducts = products.filter((p) => !p.isFree);
  const counts = { all: products.length, free: freeProducts.length, premium: paidProducts.length };

  const filtered = useMemo(() => {
    let list = filter === "free" ? freeProducts : filter === "premium" ? paidProducts : [...products];
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceInINR - b.priceInINR);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceInINR - a.priceInINR);
    return list;
  }, [filter, sort, freeProducts, paidProducts]);

  return (
    <main className="relative overflow-hidden min-h-screen" style={{ position: "relative" }}>
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)", top: "-180px", left: "25%", filter: "blur(60px)" }} />
        <div className="absolute w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", bottom: "10%", right: "10%", filter: "blur(60px)" }} />
      </div>

      <div className="container-page pt-28 pb-24 space-y-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
          <p className="text-[10px] font-mono text-violet-400 tracking-[0.25em] uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Product Catalog
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight" style={{
            background: "linear-gradient(135deg, #fff 0%, #a78bfa 40%, #60a5fa 70%, #fff 100%)",
            backgroundSize: "200% 200%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Products
          </h1>
          <p className="text-slate-400 max-w-lg text-base leading-relaxed">
            Explore premium developer tools & production-ready assets.
          </p>
        </motion.div>

        {/* Separator */}
        <div className="h-px" style={{ background: "linear-gradient(to right, rgba(124,58,237,0.4), rgba(6,182,212,0.2), transparent)" }} />

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <FilterBar active={filter} onFilter={setFilter} sort={sort} onSort={setSort} counts={counts} />
        </motion.div>

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div key={filter + sort} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 0.06} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}