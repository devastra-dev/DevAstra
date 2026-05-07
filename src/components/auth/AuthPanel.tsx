"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "login" | "signup";

/* Google "G" icon */
function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" fill="none">
      <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-5 7.2v6h8c4.7-4.3 7.3-10.7 7.3-17.3z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8-6c-2.1 1.4-4.8 2.2-7.9 2.2-6 0-11.1-4.1-13-9.6H3v6.2C6.9 42.6 14.9 48 24 48z"/>
      <path fill="#FBBC05" d="M11 28.8c-.5-1.4-.7-2.8-.7-4.3s.3-2.9.7-4.3V14H3a23.5 23.5 0 0 0 0 20l8-5.2z"/>
      <path fill="#EA4335" d="M24 9.5c3.4 0 6.4 1.2 8.8 3.4l6.5-6.5C35.9 2.3 30.5 0 24 0 14.9 0 6.9 5.4 3 13.9l8 5.9c1.9-5.5 7-9.3 13-9.3z"/>
    </svg>
  );
}

export function AuthPanel() {
  const [mode, setMode]       = useState<Mode>("login");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const router                = useRouter();
  const searchParams          = useSearchParams();
  const redirectTo            = searchParams.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push(redirectTo);
    } catch (err) {
      setError((err as Error)?.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(redirectTo);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any).message ?? "Google sign‑in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.01) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      {/* Top shimmer line */}
      <div
        aria-hidden
        className="absolute top-0 left-[15%] right-[15%] h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.7), rgba(6,182,212,0.5), transparent)" }}
      />

      {/* Corner accents */}
      <div aria-hidden className="absolute top-0 left-0 w-5 h-5 border-t border-l border-violet-500/30 rounded-tl-3xl" />
      <div aria-hidden className="absolute top-0 right-0 w-5 h-5 border-t border-r border-cyan-500/30 rounded-tr-3xl" />
      <div aria-hidden className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-violet-500/20 rounded-bl-3xl" />
      <div aria-hidden className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-500/20 rounded-br-3xl" />

      <div className="p-7 md:p-9 space-y-6">

        {/* Header */}
        <div className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.25em] text-violet-400 font-mono">Account</p>
          <AnimatePresence mode="wait">
            <motion.h1
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="text-2xl font-bold tracking-tight text-white"
            >
              {mode === "login" ? "Welcome back" : "Create your library"}
            </motion.h1>
          </AnimatePresence>
          <p className="text-xs text-slate-400 leading-relaxed">
            {mode === "login"
              ? "Sign in to access your purchases and downloads."
              : "Sign up to save purchases and access downloads anytime."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 tracking-wide font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-400 tracking-wide font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all duration-200"
              style={{
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.55)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.1)"; }}
              onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs text-rose-400"
                style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="0.5" fill="currentColor"/>
                </svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb, #06b6d4)",
              backgroundSize: "200% 200%",
              boxShadow: "0 4px 24px rgba(124,58,237,0.35), 0 1px 0 rgba(255,255,255,0.1) inset",
            }}
          >
            {loading ? (
              <>
                <motion.span
                  className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                Please wait...
              </>
            ) : (
              <>{mode === "login" ? "Sign in" : "Sign up"}</>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          <span className="text-[11px] text-slate-600">or continue with</span>
          <span className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Google */}
        <motion.button
          onClick={handleGoogle}
          disabled={loading}
          whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 rounded-xl py-2.5 text-sm text-slate-200 font-medium disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-200"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
          }}
        >
          <GoogleIcon />
          Continue with Google
        </motion.button>

        {/* Mode switch */}
        <button
          type="button"
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
          className="w-full text-center text-[11px] text-slate-500 hover:text-violet-300 transition-colors duration-200 tracking-wide"
        >
          {mode === "login"
            ? "New here? Create an account →"
            : "Already have an account? Sign in →"}
        </button>
      </div>
    </motion.div>
  );
}
