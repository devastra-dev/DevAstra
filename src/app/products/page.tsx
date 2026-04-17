"use client";

import { products, Product } from "@/lib/products";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";
import { useRef, useEffect, useState } from "react";

/* ─────────────────────────────────────────────────
   FONT INJECTION  (Orbitron for headings)
───────────────────────────────────────────────── */
function FontLoader() {
  useEffect(() => {
    if (document.getElementById("orbitron-font")) return;
    const link = document.createElement("link");
    link.id = "orbitron-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

/* ─────────────────────────────────────────────────
   GLOBAL CSS (keyframes + utilities)
───────────────────────────────────────────────── */
const globalStyles = `
  @keyframes scan {
    0%   { top: -4px; }
    100% { top: 100%; }
  }
  @keyframes aurora-rotate {
    0%   { --aurora-angle: 0deg; }
    100% { --aurora-angle: 360deg; }
  }
  @keyframes shimmer-move {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes glitch-1 {
    0%, 94%, 100% { clip-path: none; transform: none; opacity: 1; }
    95% { clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); transform: translateX(-4px); opacity: 0.8; }
    97% { clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%); transform: translateX(4px); opacity: 0.8; }
  }
  @keyframes glitch-2 {
    0%, 92%, 100% { clip-path: none; transform: none; opacity: 0; }
    93% { clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%); transform: translateX(6px); opacity: 0.5; color: #ff0060; }
    96% { clip-path: polygon(0 55%, 100% 55%, 100% 70%, 0 70%); transform: translateX(-6px); opacity: 0.5; color: #00ffcc; }
  }
  @keyframes float-particle {
    0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(-120px) translateX(20px); opacity: 0; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 6px rgba(0,255,200,0.4), 0 0 12px rgba(0,255,200,0.2); }
    50%       { box-shadow: 0 0 12px rgba(0,255,200,0.7), 0 0 24px rgba(0,255,200,0.4); }
  }
  @keyframes border-trace {
    0%   { background-position: 0% 0%; }
    100% { background-position: 200% 200%; }
  }
  @keyframes count-up {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes holo-shift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .orbitron { font-family: 'Orbitron', monospace; }
  .share-tech { font-family: 'Share Tech Mono', monospace; }
  .glitch-text {
    position: relative;
    animation: glitch-1 8s infinite;
  }
  .glitch-text::after {
    content: attr(data-text);
    position: absolute;
    left: 0; top: 0;
    animation: glitch-2 8s infinite;
    pointer-events: none;
  }
  .holo-card:hover .holo-overlay {
    opacity: 1 !important;
  }
  .btn-shine {
    position: relative;
    overflow: hidden;
  }
  .btn-shine::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -75%;
    width: 50%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255,255,255,0) 0%,
      rgba(0,255,200,0.15) 50%,
      rgba(255,255,255,0) 100%
    );
    transform: skewX(-20deg);
    transition: left 0s;
    pointer-events: none;
  }
  .btn-shine:hover::after {
    left: 125%;
    transition: left 0.5s ease;
  }
`;

/* ─────────────────────────────────────────────────
   FLOATING PARTICLES BACKGROUND
───────────────────────────────────────────────── */
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 8}s`,
    size: Math.random() > 0.7 ? 3 : 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: p.left,
            bottom: "0",
            width: p.size,
            height: p.size,
            opacity: 0,
            animation: `float-particle ${p.duration} ${p.delay} infinite linear`,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────── */
export default function ProductsPage() {
  const freeProducts = products.filter((p) => p.isFree);
  const paidProducts = products.filter((p) => !p.isFree);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      <FontLoader />

      <main className="relative overflow-hidden min-h-screen">

        {/* ── LAYERED SCI-FI BACKGROUND ── */}
        <div className="absolute inset-0 -z-10 bg-[#030712]">
          {/* Deep grid */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,200,0.04) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,200,0.04) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
            }}
          />
          {/* Perspective grid floor */}
          <div className="absolute bottom-0 left-0 right-0 h-64"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,200,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,200,0.06) 1px, transparent 1px)
              `,
              backgroundSize: "48px 48px",
              transform: "perspective(400px) rotateX(60deg)",
              transformOrigin: "bottom center",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
            }}
          />
          {/* Glow orbs */}
          <div className="absolute w-[700px] h-[700px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0,200,255,0.07) 0%, transparent 70%)",
              top: "-200px", left: "30%",
            }}
          />
          <div className="absolute w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(120,0,255,0.06) 0%, transparent 70%)",
              bottom: "10%", right: "10%",
            }}
          />
          <div className="absolute w-[300px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0,255,160,0.05) 0%, transparent 70%)",
              bottom: "30%", left: "5%",
            }}
          />
          {/* Horizontal scan line across page */}
          <div className="absolute inset-x-0 h-[1px] top-1/3"
            style={{ background: "linear-gradient(to right, transparent, rgba(0,255,200,0.08), transparent)" }}
          />
        </div>

        {/* Particle field */}
        <ParticleField />

        <div className="container-page pt-28 pb-24 space-y-20">

          {/* ── PREMIUM HEADER ── */}
          <div className="space-y-5 text-center md:text-left relative">
            {/* corner bracket decoration */}
            <div className="hidden md:block absolute -left-6 -top-4 w-8 h-8 border-l-2 border-t-2 border-cyan-500/40" />

            {/* eyebrow label */}
            <p className="share-tech text-xs text-cyan-500/70 tracking-[0.25em] uppercase">
              ◈ PRODUCT CATALOG v2.0
            </p>

            {/* glitch main title */}
            <h1
              className="orbitron glitch-text text-5xl md:text-6xl font-black text-white tracking-widest"
              data-text="PRODUCTS"
              style={{
                textShadow: "0 0 30px rgba(0,255,200,0.15), 0 0 60px rgba(0,200,255,0.08)",
              }}
            >
              PRODUCTS
            </h1>

            {/* sub line */}
            <p className="share-tech text-slate-400 max-w-lg text-sm tracking-wider">
              Explore futuristic developer tools &amp; premium assets.
            </p>

            {/* stat chips */}
            <div className="flex gap-4 flex-wrap mt-2 justify-center md:justify-start">
              <StatChip label="FREE" count={freeProducts.length} color="#00ffc8" />
              <StatChip label="PREMIUM" count={paidProducts.length} color="#00b4ff" />
            </div>

            {/* decorative separator */}
            <div className="flex items-center gap-3 mt-6 justify-center md:justify-start">
              <div className="h-[1px] flex-1 max-w-xs"
                style={{ background: "linear-gradient(to right, rgba(0,255,200,0.4), transparent)" }}
              />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            </div>
          </div>

          {/* ── FREE PRODUCTS ── */}
          {freeProducts.length > 0 && (
            <section className="space-y-8">
              <SectionHeader label="Free Products" color="#4ade80" tag="FREE_TIER" />
              <div className="grid gap-8 md:grid-cols-3">
                {freeProducts.map((p, i) => (
                  <TiltCard key={p.id} product={p} delay={i * 0.1} />
                ))}
              </div>
            </section>
          )}

          {/* ── PREMIUM PRODUCTS ── */}
          <section className="space-y-8">
            <SectionHeader label="Premium Products" color="#67e8f9" tag="PRO_TIER" />
            <div className="grid gap-8 md:grid-cols-3">
              {paidProducts.map((p, i) => (
                <TiltCard key={p.id} product={p} delay={i * 0.1} />
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  );
}

/* ─────────────────────────────────────────────────
   STAT CHIP
───────────────────────────────────────────────── */
function StatChip({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div
      className="share-tech text-xs px-3 py-1.5 rounded-full flex items-center gap-2"
      style={{
        border: `1px solid ${color}30`,
        background: `${color}08`,
        color,
      }}
    >
      <span className="opacity-60">{label}</span>
      <span className="font-bold" style={{ animation: "count-up 0.6s ease forwards" }}>
        {count}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────────── */
function SectionHeader({ label, color, tag }: { label: string; color: string; tag: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-1 h-8 rounded-full" style={{ background: color, boxShadow: `0 0 12px ${color}80` }} />
      <div>
        <p className="share-tech text-[10px] tracking-[0.2em] opacity-40" style={{ color }}>
          {tag}
        </p>
        <h2 className="orbitron text-xl font-semibold tracking-wide" style={{ color }}>
          {label}
        </h2>
      </div>
      <div className="flex-1 h-[1px] ml-2"
        style={{ background: `linear-gradient(to right, ${color}30, transparent)` }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────
   TILT CARD  (all original logic kept, visuals maxed)
───────────────────────────────────────────────── */
function TiltCard({ product, delay }: { product: Product; delay: number }) {
  const { purchased } = usePurchaseStatus(product.id);

  /* original motion values */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [8, -8]);
  const rotateY = useTransform(x, [-80, 80], [-8, 8]);

  /* spotlight tracking */
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, active: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    x.set(cx - rect.width / 2);
    y.set(cy - rect.top - rect.height / 2);
    setSpotlight({
      x: (cx / rect.width) * 100,
      y: (cy / rect.height) * 100,
      active: true,
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setSpotlight((prev) => ({ ...prev, active: false }));
  };

  /* aurora border angle driven by x */
  const aurAngle = useTransform(x, [-80, 80], [200, 340]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 90, damping: 18 }}
      whileHover={{ scale: 1.025 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="holo-card relative group transition-all duration-300 hover:z-20"
    >
      {/* ── AURORA ANIMATED BORDER ── */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: "1px",
          background: aurAngle.get()
            ? undefined
            : "transparent",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `conic-gradient(from 0deg at 50% 50%, 
              #00ffc8 0deg, #00b4ff 90deg, #7c00ff 180deg, 
              #ff0080 270deg, #00ffc8 360deg)`,
            borderRadius: "inherit",
            padding: "1px",
            zIndex: 0,
          }}
        >
          <div className="absolute inset-[1px] rounded-[calc(1rem-1px)] bg-[#070c18]" />
        </div>
      </motion.div>

      {/* ── STATIC BORDER (always visible) ── */}
      <div className="absolute inset-0 rounded-2xl border border-white/8 pointer-events-none" />

      {/* ── MAIN CARD BODY ── */}
      <div className="relative rounded-2xl bg-[#070c18] p-6 overflow-hidden"
        style={{
          boxShadow: spotlight.active
            ? `0 0 40px rgba(0,255,200,0.06), inset 0 1px 0 rgba(255,255,255,0.04)`
            : `0 0 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`,
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* MOUSE SPOTLIGHT */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: spotlight.active ? 1 : 0,
            background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(0,255,200,0.07) 0%, transparent 55%)`,
          }}
        />

        {/* HOLOGRAPHIC SHIMMER */}
        <div
          className="holo-overlay absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `linear-gradient(
              105deg,
              transparent 20%,
              rgba(0,255,200,0.04) 30%,
              rgba(0,180,255,0.06) 45%,
              rgba(120,0,255,0.04) 55%,
              transparent 65%
            )`,
            backgroundSize: "200% 200%",
            animation: "holo-shift 4s linear infinite",
          }}
        />

        {/* SCAN LINE */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute w-full bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent"
            style={{ height: "6px", animation: "scan 4s linear infinite" }}
          />
        </div>

        {/* IMAGE AREA */}
        <div className="mt-2 h-44 rounded-xl overflow-hidden relative"
          style={{ border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
            style={{ opacity: spotlight.active ? 0.95 : 0.65, transition: "opacity 0.4s, transform 0.7s" }}
          />
          {/* gradient overlay */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(7,12,24,0.9) 0%, rgba(7,12,24,0.3) 60%, transparent 100%)" }}
          />
          {/* corner HUD marks */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyan-400/40" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyan-400/40" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-cyan-400/40" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-cyan-400/40" />
        </div>

        {/* FREE BADGE */}
        {product.isFree && (
          <div
            className="share-tech absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full tracking-widest"
            style={{
              background: "rgba(74,222,128,0.08)",
              color: "#4ade80",
              border: "1px solid rgba(74,222,128,0.25)",
              animation: "pulse-glow 2.5s ease-in-out infinite",
            }}
          >
            ◈ FREE
          </div>
        )}

        {/* PURCHASED BADGE */}
        {purchased && (
          <div
            className="share-tech absolute top-3 right-3 text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 tracking-wider"
            style={{
              background: "rgba(0,255,200,0.08)",
              color: "#00ffc8",
              border: "1px solid rgba(0,255,200,0.25)",
            }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 4l2 2 4-4" stroke="#00ffc8" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            OWNED
          </div>
        )}

        {/* CONTENT */}
        <div className="relative z-10 mt-5 space-y-2">
          {/* stack label */}
          <p className="share-tech text-[10px] tracking-[0.15em] text-cyan-500/60 uppercase">
            {product.stackLabel}
          </p>

          {/* title */}
          <h2
            className="orbitron text-base font-semibold text-white tracking-wide leading-snug"
            style={{ textShadow: "0 0 20px rgba(255,255,255,0.1)" }}
          >
            {product.title}
          </h2>

          {/* description */}
          <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mt-1">
            {product.description}
          </p>

          {/* PRICE */}
          <div className="mt-4">
            {product.isFree ? (
              <p
                className="orbitron font-bold text-xl"
                style={{ color: "#4ade80", textShadow: "0 0 12px rgba(74,222,128,0.4)" }}
              >
                FREE
              </p>
            ) : (
              <div className="flex items-baseline gap-2">
                {product.originalPrice && (
                  <span className="share-tech text-xs line-through text-slate-600">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span
                  className="orbitron font-bold text-xl tracking-wide"
                  style={{ color: "#00e5ff", textShadow: "0 0 14px rgba(0,229,255,0.4)" }}
                >
                  ₹{product.priceInINR}
                </span>
                {product.originalPrice && (
                  <span
                    className="share-tech text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: "rgba(0,229,255,0.08)",
                      color: "#00e5ff",
                      border: "1px solid rgba(0,229,255,0.2)",
                    }}
                  >
                    DEAL
                  </span>
                )}
              </div>
            )}
          </div>

          {/* CTA BUTTON */}
          <Link
            href={`/products/${product.id}`}
            className="btn-shine mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(0,229,255,0.25)",
              color: "#67e8f9",
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0,229,255,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.5)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(0,229,255,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.6)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,229,255,0.25)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <span>VIEW PRODUCT</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}