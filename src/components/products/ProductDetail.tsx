"use client";

import type { Product } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthContext";
import { useState } from "react";
import { usePurchaseStatus } from "@/hooks/usePurchaseStatus";
import { ProductReviews } from "@/components/reviews/ProductReviews";
import Image from "next/image";

/* =========================
   🎥 DEMO VIDEO
========================= */
function DemoVideo({ url }: { url?: string }) {
  const [play, setPlay] = useState(false);
  if (!url) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.5)" }}>
      {!play && (
        <motion.div
          onClick={() => setPlay(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 group"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <motion.div
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center w-16 h-16 rounded-full text-black text-xl font-bold shadow-2xl"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            ▶
          </motion.div>
        </motion.div>
      )}
      <iframe
        src={play ? url + "?autoplay=1" : url}
        className="w-full h-[320px]"
        allowFullScreen
      />
    </div>
  );
}

/* =========================
   🏷️ FEATURE PILL
========================= */
function FeaturePill({ text }: { text: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-300"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400 shrink-0">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      {text}
    </div>
  );
}

/* =========================
   🚀 MAIN COMPONENT
========================= */
export function ProductDetail({ product }: { product: Product }) {
  const { user } = useAuth();
  const { purchased: alreadyPurchased, loading: purchaseLoading } = usePurchaseStatus(product.id);

  const [busy, setBusy]         = useState(false);
  const [status, setStatus]     = useState<"idle" | "processing" | "failed">("idle");
  const [activeImage, setActiveImage] = useState(product.images?.[0] || "");

  /* ── DOWNLOAD ── */
  const handleDownload = async () => {
    setBusy(true);
    try {
      const token = await user!.getIdToken();
      const res   = await fetch(`/api/download/${product.id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { alert("Download failed"); return; }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Download error");
    } finally {
      setBusy(false);
    }
  };

  /* ── BUY ── */
  const handleBuy = async () => {
    if (!user) { window.location.href = `/auth?redirect=/products/${product.id}`; return; }
    if (alreadyPurchased || purchaseLoading) return;
    setBusy(true);
    setStatus("processing");
    try {
      const token    = await user.getIdToken();
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId: product.id, amountInINR: product.priceInINR }),
      });
      const orderData = await orderRes.json();
      if (!orderData?.orderId) { setStatus("failed"); return; }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Razorpay = (window as any).Razorpay;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rz = new Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "DevAstra",
        description: product.title,
        order_id: orderData.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect
        handler: async (res: any) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${await user.getIdToken()}` },
            body: JSON.stringify({ ...res, productId: product.id, amountInINR: product.priceInINR }),
          });
          const data = await verifyRes.json();
          if (data.success) { window.location.reload(); }
          else { setStatus("failed"); }
        },
      });
      rz.open();
    } catch {
      setStatus("failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-16">
      <div className="grid gap-10 md:grid-cols-[1.5fr_1fr] items-start">

        {/* ── LEFT ── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Main Image */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.4)" }}
          >
            {activeImage && (
              <Image
                src={activeImage}
                alt={product.title}
                width={800}
                height={350}
                className="w-full h-[350px] object-cover"
              />
            )}
          </motion.div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 flex-wrap">
              {product.images.map((img, i) => (
                <motion.div
                  key={i}
                  onClick={() => setActiveImage(img)}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.97 }}
                  className="cursor-pointer rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    border: activeImage === img
                      ? "2px solid rgba(124,58,237,0.8)"
                      : "2px solid rgba(255,255,255,0.08)",
                    opacity: activeImage === img ? 1 : 0.65,
                    boxShadow: activeImage === img ? "0 0 16px rgba(124,58,237,0.3)" : "none",
                  }}
                >
                  <Image src={img} alt={`Thumb ${i + 1}`} width={64} height={64} className="w-16 h-16 object-cover" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Demo Video */}
          <DemoVideo url={product.demoVideo} />

          {/* Product info */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-1.5">{product.title}</h1>
            <p className="text-cyan-300 text-sm font-medium mb-3">{product.tagline}</p>
            <p className="text-slate-300 leading-relaxed text-sm">{product.description}</p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {product.features.map((f, i) => (
              <FeaturePill key={i} text={f} />
            ))}
          </div>
        </motion.div>

        {/* ── RIGHT: Purchase Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="sticky top-24"
        >
          <div
            className="relative rounded-2xl p-6 space-y-5 overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* Top shimmer */}
            <div aria-hidden className="absolute top-0 left-[20%] right-[20%] h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), transparent)" }} />

            {/* Purchased badge */}
            <AnimatePresence>
              {alreadyPurchased && !purchaseLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-emerald-300"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Purchased
                </motion.div>
              )}
            </AnimatePresence>

            {/* Price */}
            <div>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-mono mb-1">Price</p>
              <p className="text-4xl font-bold font-mono" style={{ background: "linear-gradient(135deg, #06b6d4, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                ₹{product.priceInINR}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Trust items */}
            <div className="space-y-2">
              {[
                { icon: "⚡", text: "Instant Download" },
                { icon: "🔒", text: "Secure Payment" },
                { icon: "♾️", text: "Lifetime Access" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2.5 text-xs text-slate-400">
                  <span className="text-sm">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={alreadyPurchased ? handleDownload : handleBuy}
              disabled={busy || purchaseLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: alreadyPurchased
                  ? "linear-gradient(135deg, #10b981, #06b6d4)"
                  : "linear-gradient(135deg, #7c3aed, #2563eb)",
                boxShadow: alreadyPurchased
                  ? "0 4px 24px rgba(16,185,129,0.3)"
                  : "0 4px 24px rgba(124,58,237,0.4)",
              }}
            >
              {purchaseLoading ? (
                <>
                  <motion.span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                  Checking...
                </>
              ) : alreadyPurchased ? (
                busy ? "Preparing..." : "⬇ Download Now"
              ) : (
                busy ? "Processing..." : "Buy Now →"
              )}
            </motion.button>

            {/* Stack label */}
            <p className="text-center text-[10px] text-slate-600 font-mono tracking-widest">{product.stackLabel}</p>
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      <ProductReviews productId={product.id} />

      {/* Processing overlay */}
      <AnimatePresence>
        {status === "processing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(6,6,16,0.85)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="rounded-2xl p-8 text-center space-y-4"
              style={{ background: "rgba(12,13,30,0.95)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <motion.div className="w-12 h-12 mx-auto rounded-full border-2 border-violet-400/30 border-t-violet-400" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              <p className="text-white font-semibold">Processing Payment...</p>
              <p className="text-slate-400 text-sm">Please do not close this window</p>
            </motion.div>
          </motion.div>
        )}

        {status === "failed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(6,6,16,0.85)", backdropFilter: "blur(12px)" }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="rounded-2xl p-8 text-center space-y-5 max-w-sm"
              style={{ background: "rgba(12,13,30,0.95)", border: "1px solid rgba(244,63,94,0.2)" }}
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center" style={{ background: "rgba(244,63,94,0.12)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <div>
                <p className="text-rose-400 font-semibold text-lg">Payment Failed</p>
                <p className="text-slate-400 text-sm mt-1">Something went wrong. Please try again.</p>
              </div>
              <motion.button
                onClick={() => setStatus("idle")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-gradient w-full justify-center"
              >
                Try Again
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}