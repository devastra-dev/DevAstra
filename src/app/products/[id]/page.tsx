"use client";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import { products } from "@/lib/products";
import { useState } from "react";
import { motion } from "framer-motion";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import Link from "next/link";

// ─── animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  const product = products.find((p) => p.id === params.id);

  const { purchased: alreadyPurchased, loading: purchaseLoading } =
    usePurchaseStatus(product?.id || "");

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400/80 text-sm tracking-widest uppercase">
          Product not found
        </p>
      </div>
    );
  }

  // =========================
  // 🔥 FREE DOWNLOAD
  // =========================
  const handleFreeDownload = async () => {
    if (!user) {
      router.push(`/auth?redirect=/products/${product.id}`);
      return;
    }
    setBusy(true);
    try {
      window.location.href = product.downloadUrl;
    } catch {
      alert("Download failed");
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // 🔥 PAID DOWNLOAD
  // =========================
  const handleDownload = async () => {
    if (!user) {
      router.push(`/auth?redirect=/products/${product.id}`);
      return;
    }
    setBusy(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/download/${product.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        alert(data?.error || "Download failed");
        return;
      }
      window.location.href = data.url;
    } catch {
      alert("Download error");
    } finally {
      setBusy(false);
    }
  };

  // =========================
  // 🔥 BUY
  // =========================
  const handleBuyNow = async () => {
    if (product.isFree) {
      handleFreeDownload();
      return;
    }
    if (!user) {
      router.push(`/auth?redirect=/products/${product.id}`);
      return;
    }
    setBusy(true);
    try {
      const token = await user.getIdToken();
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          amountInINR: product.priceInINR,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        alert(orderData?.error || "Order failed");
        return;
      }
      const Rz = (window as any).Razorpay;
      if (!Rz) {
        alert("Payment not loaded");
        return;
      }
      const rz = new Rz({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "DevAstra",
        description: product.title,
        order_id: orderData.orderId,
        handler: async (res: any) => {
          const verifyToken = await user.getIdToken();
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${verifyToken}`,
            },
            body: JSON.stringify({
              ...res,
              productId: product.id,
              amountInINR: product.priceInINR,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            window.location.href = `/success?productId=${product.id}`;
          } else {
            alert("Payment verification failed");
          }
        },
      });
      rz.open();
    } catch {
      alert("Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  // ─── derived button label ──────────────────────────────────────────────
  const buttonLabel = product.isFree
    ? busy
      ? "Preparing…"
      : "Download Free"
    : purchaseLoading
    ? "Checking…"
    : alreadyPurchased
    ? busy
      ? "Preparing…"
      : "Download Now"
    : busy
    ? "Processing…"
    : "Buy Now — ₹" + product.priceInINR;

  const handleClick = product.isFree
    ? handleFreeDownload
    : alreadyPurchased
    ? handleDownload
    : handleBuyNow;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a10]">

      {/* ── AMBIENT BACKGROUND ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {/* large radial orbs */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(6,182,212,.13) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,.10) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 left-[-5%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(168,85,247,.07) 0%, transparent 70%)" }} />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

        {/* top edge glow line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,.5) 40%, rgba(59,130,246,.5) 60%, transparent)" }} />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-20">

        {/* ── VIDEO PLAYER ───────────────────────────────────────────────── */}
        {product.demoVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0 0 0 1px rgba(6,182,212,.18), 0 0 80px rgba(6,182,212,.08), 0 32px 64px rgba(0,0,0,.6)",
            }}
          >
            {/* gradient frame overlay */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none z-10"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)" }} />
            <iframe
              src={product.demoVideo}
              className="w-full h-[420px] block"
              allowFullScreen
            />
          </motion.div>
        )}

        {/* ── MAIN GRID ──────────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-14 items-start">

          {/* ────── LEFT COLUMN ────── */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Stack badge */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
              <span
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(6,182,212,.10)",
                  border: "1px solid rgba(6,182,212,.25)",
                  color: "#22d3ee",
                  letterSpacing: "0.12em",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {product.stackLabel}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-5xl font-bold leading-tight tracking-tight"
              style={{
                background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {product.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-slate-400 text-lg leading-relaxed max-w-xl"
            >
              {product.description}
            </motion.p>

            {/* Social proof pill */}
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show">
              <div
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm"
                style={{
                  background: "rgba(34,197,94,.07)",
                  border: "1px solid rgba(34,197,94,.2)",
                }}
              >
                <span className="text-lg">🔥</span>
                <span className="text-emerald-400 font-medium">
                  120+ developers already using this
                </span>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="space-y-3 pt-2"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                What's included
              </p>
              <ul className="space-y-3">
                {product.features.map((f, i) => (
                  <motion.li
                    key={i}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    className="flex items-start gap-3 text-slate-300 text-sm"
                  >
                    <span
                      className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "rgba(6,182,212,.15)",
                        border: "1px solid rgba(6,182,212,.3)",
                        color: "#22d3ee",
                      }}
                    >
                      ✓
                    </span>
                    {f}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* ────── RIGHT COLUMN — PURCHASE CARD ────── */}
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.65, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-24"
          >
            {/* Outer glow border wrapper */}
            <div
              className="rounded-2xl p-px"
              style={{
                background: "linear-gradient(145deg, rgba(6,182,212,.35) 0%, rgba(59,130,246,.2) 50%, rgba(168,85,247,.15) 100%)",
                boxShadow: "0 0 60px rgba(6,182,212,.07), 0 32px 64px rgba(0,0,0,.5)",
              }}
            >
              <div
                className="rounded-2xl p-7 space-y-6"
                style={{ background: "rgba(10,15,26,.92)", backdropFilter: "blur(24px)" }}
              >

                {/* ── PRICE BLOCK ── */}
                <div className="space-y-1.5">
                  {product.isFree ? (
                    <div>
                      <span
                        className="text-4xl font-bold"
                        style={{
                          background: "linear-gradient(90deg, #34d399, #10b981)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        FREE
                      </span>
                      <p className="text-slate-500 text-xs mt-1">No credit card required</p>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div>
                        {product.originalPrice && (
                          <p className="line-through text-slate-500 text-sm mb-1">
                            ₹{product.originalPrice}
                          </p>
                        )}
                        <span
                          className="text-4xl font-bold"
                          style={{
                            background: "linear-gradient(90deg, #22d3ee, #60a5fa)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                        >
                          ₹{product.priceInINR}
                        </span>
                        <p className="text-slate-500 text-xs mt-1">One-time payment · Lifetime access</p>
                      </div>

                      {product.discountPercent && (
                        <span
                          className="text-xs font-bold px-2.5 py-1.5 rounded-lg flex-shrink-0"
                          style={{
                            background: "rgba(239,68,68,.15)",
                            border: "1px solid rgba(239,68,68,.3)",
                            color: "#f87171",
                          }}
                        >
                          {product.discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* ── DIVIDER ── */}
                <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent)" }} />

                {/* ── ALREADY PURCHASED BADGE ── */}
                {alreadyPurchased && !product.isFree && (
                  <div
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm"
                    style={{
                      background: "rgba(34,197,94,.08)",
                      border: "1px solid rgba(34,197,94,.2)",
                    }}
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: "rgba(34,197,94,.2)", color: "#4ade80" }}
                    >
                      ✓
                    </span>
                    <div>
                      <p className="text-emerald-400 font-medium">Already Purchased</p>
                      <p className="text-emerald-600 text-xs">Click below to re-download</p>
                    </div>
                  </div>
                )}

                {/* ── CTA BUTTON ── */}
                <button
                  onClick={handleClick}
                  disabled={busy || purchaseLoading}
                  className="group relative w-full overflow-hidden rounded-xl py-4 text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #0891b2 0%, #0e7490 50%, #164e63 100%)",
                    boxShadow: "0 0 0 1px rgba(6,182,212,.4), 0 8px 32px rgba(6,182,212,.18), 0 2px 8px rgba(0,0,0,.4)",
                  }}
                >
                  {/* shimmer sweep */}
                  <span
                    className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                    style={{
                      background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,.12) 50%, transparent 60%)",
                    }}
                  />
                  <span className="relative text-white">{buttonLabel}</span>
                </button>

                {/* ── FREE UPSELL ── */}
                {product.isFree && (
                  <p className="text-xs text-center text-slate-500">
                    Want the premium version?{" "}
                    <Link
                      href="/products/next-saas-starter"
                      className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 transition-colors"
                    >
                      Upgrade →
                    </Link>
                  </p>
                )}

                {/* ── TRUST SIGNALS ── */}
                {!product.isFree && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        { icon: "🔒", label: "Secure Pay" },
                        { icon: "♾️", label: "Lifetime" },
                        { icon: "📦", label: "Instant DL" },
                      ].map(({ icon, label }) => (
                        <div
                          key={label}
                          className="rounded-lg py-2.5 px-1"
                          style={{
                            background: "rgba(255,255,255,.03)",
                            border: "1px solid rgba(255,255,255,.07)",
                          }}
                        >
                          <div className="text-base">{icon}</div>
                          <p className="text-slate-500 text-[10px] mt-1 leading-tight">{label}</p>
                        </div>
                      ))}
                    </div>

                    <p className="text-[11px] text-slate-600 text-center leading-relaxed">
                      By purchasing, you agree to our{" "}
                      <Link href="/terms" className="underline text-slate-500 hover:text-cyan-400 transition-colors">
                        Terms
                      </Link>{" "}
                      &{" "}
                      <Link href="/refund" className="underline text-slate-500 hover:text-cyan-400 transition-colors">
                        Refund Policy
                      </Link>
                    </p>
                  </div>
                )}

              </div>
            </div>
          </motion.div>

        </div>

        {/* ── SECTION DIVIDER ────────────────────────────────────────────── */}
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(6,182,212,.2), rgba(59,130,246,.2), transparent)" }}
        />

        {/* ── REVIEWS ────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductReviews productId={product.id} />
        </motion.div>

      </div>
    </main>
  );
}