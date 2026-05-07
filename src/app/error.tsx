"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden"
      style={{ position: "relative" }}
    >
      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(244,63,94,0.1) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-2xl px-8 py-10 max-w-md w-full space-y-6"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%)",
          border: "1px solid rgba(244,63,94,0.2)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Top shimmer */}
        <div
          aria-hidden
          className="absolute top-0 left-[20%] right-[20%] h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(244,63,94,0.6), transparent)" }}
        />

        {/* Error icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
          className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
          style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.25)" }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </motion.div>

        <div>
          <p className="text-[10px] font-mono text-rose-400 uppercase tracking-[0.25em] mb-2">
            Runtime Error
          </p>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            An unexpected error occurred. Our systems have been notified and we&apos;re working on a fix.
          </p>
        </div>

        <motion.button
          onClick={() => reset()}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #e11d48, #f43f5e)",
            boxShadow: "0 4px 20px rgba(244,63,94,0.3)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}
