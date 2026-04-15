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

type Mode = "login" | "signup";

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirect") || "/dashboard";

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
    } catch (err: any) {
      setError(err.message ?? "Google sign‑in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-7 space-y-5">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          Account
        </p>
        <h1 className="text-xl font-semibold tracking-tight">
          {mode === "login" ? "Welcome back" : "Create your library"}
        </h1>
        <p className="text-xs text-slate-400">
          {mode === "login"
            ? "Sign in to access your purchases and downloads."
            : "Sign up to save purchases and access downloads anytime."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-slate-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-500/60"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs text-slate-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-500/60"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-950/60 border border-rose-900/60 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading
            ? "Please wait..."
            : mode === "login"
            ? "Sign in"
            : "Sign up"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-[11px] text-slate-500">
        <span className="h-px flex-1 bg-slate-800" />
        <span>or</span>
        <span className="h-px flex-1 bg-slate-800" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full rounded-full border border-slate-700/80 bg-slate-900/70 px-4 py-2.5 text-xs text-slate-100 hover:bg-slate-800/80 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="h-4 w-4 rounded-[4px] bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500" />
        Continue with Google
      </button>

      <button
        type="button"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
        className="w-full text-[11px] text-slate-400 hover:text-slate-200"
      >
        {mode === "login"
          ? "New here? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </div>
  );
}

