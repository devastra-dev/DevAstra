"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import { useAuth } from "@/components/auth/AuthContext";
import { useEffect, useState } from "react";

export default function SuccessContent() {
  const params    = useSearchParams();
  const router    = useRouter();
  const { user }  = useAuth();

  const productId = params.get("productId");
  const product   = products.find((p) => p.id === productId);

  const [loading, setLoading] = useState(false);
  const [valid,   setValid]   = useState(false);

  // 🔥 VALIDATION (CRITICAL — untouched)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    const flag = localStorage.getItem("payment_success");
    if (!flag || flag !== productId) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValid(true);
    localStorage.removeItem("payment_success");
  }, [productId, router, setValid]);

  // 🔥 DOWNLOAD (untouched logic)
  const handleDownload = async () => {
    if (!user || !productId) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res   = await fetch(`/api/download/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert("Download failed");
    } catch {
      alert("Download error");
    } finally {
      setLoading(false);
    }
  };

  /* ── Validating ── */
  if (!valid) {
    return (
      <div className="container-page pt-40 flex flex-col items-center gap-4" style={{ position: "relative" }}>
        <motion.div
          className="w-10 h-10 rounded-full border-2 border-violet-400/30 border-t-violet-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <p className="text-slate-400 text-sm font-mono tracking-widest">Validating payment…</p>
      </div>
    );
  }

  /* ── Invalid product ── */
  if (!product) {
    return (
      <div className="container-page pt-40 text-center" style={{ position: "relative" }}>
        <p className="text-rose-400 text-xl font-semibold">Invalid Order</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center px-4 py-20" style={{ position: "relative" }}>

      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-10 right-[10%] w-[400px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg"
      >
        {/* Main Card */}
        <div
          className="relative rounded-3xl overflow-hidden p-8 md:p-10 text-center space-y-7"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Top shimmer */}
          <div aria-hidden className="absolute top-0 left-[15%] right-[15%] h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.8), rgba(6,182,212,0.5), transparent)" }} />

          {/* Animated checkmark icon */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200, damping: 14 }}
            className="relative inline-flex items-center justify-center w-20 h-20 mx-auto rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.05) 60%)",
              border: "1px solid rgba(16,185,129,0.3)",
              boxShadow: "0 0 40px rgba(16,185,129,0.2)",
            }}
          >
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-[-8px] rounded-full"
              style={{ border: "1px solid rgba(16,185,129,0.2)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful! 🎉</h1>
            <p className="text-slate-400 text-sm">Your purchase is confirmed and ready to download.</p>
          </motion.div>

          {/* Product info panel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="rounded-2xl p-5 text-left space-y-2"
            style={{ background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Order Summary</p>
            <h2 className="text-base font-semibold text-white">{product.title}</h2>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">{product.tagline}</span>
              <span className="text-sm font-bold font-mono text-cyan-300">₹{product.priceInINR}</span>
            </div>
          </motion.div>

          {/* Download Button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <motion.button
              onClick={handleDownload}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 rounded-xl py-3.5 text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #10b981, #06b6d4)",
                boxShadow: "0 6px 28px rgba(16,185,129,0.35)",
              }}
            >
              {loading ? (
                <>
                  <motion.span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
                  Preparing Download...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Now
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Navigation links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex justify-center gap-6 pt-2"
          >
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs text-slate-500 hover:text-violet-300 transition-colors duration-200 tracking-wide"
            >
              Go to Dashboard →
            </button>
            <button
              onClick={() => router.push("/products")}
              className="text-xs text-slate-500 hover:text-cyan-300 transition-colors duration-200 tracking-wide"
            >
              Explore More →
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}