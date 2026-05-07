// app/profile/page.tsx
"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";
import { motion } from "framer-motion";

/* ── helpers ── */
function getInitials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || email[0]?.toUpperCase() || "?";
}

function formatDate(ts: string | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 rounded-2xl"
          style={{
            border: "1px solid rgba(124,58,237,0.25)",
            background: "linear-gradient(135deg,rgba(124,58,237,0.06),rgba(37,99,235,0.08))",
            backdropFilter: "blur(16px)",
          }}
        >
          <p className="text-sm uppercase tracking-widest mb-4 font-mono font-bold" style={{ color: "#f43f5e", letterSpacing: "3px" }}>
            Not Authenticated
          </p>
          <p className="text-sm mb-6 text-slate-500 font-mono">You must be logged in to view this page.</p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 font-mono font-semibold"
            style={{
              border: "1px solid rgba(124,58,237,0.4)",
              background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(124,58,237,0.06))",
              color: "#a78bfa",
              boxShadow: "0 0 15px rgba(124,58,237,0.2)",
            }}
          >
            → Login
          </button>
        </motion.div>
      </div>
    );
  }

  const initials = getInitials(user.email ?? "");
  const joinDate = formatDate(user.metadata?.creationTime ?? null);
  const providerID = user.providerData?.[0]?.providerId ?? "password";
  const providerLabel = providerID === "google.com" ? "Google OAuth" : providerID === "github.com" ? "GitHub OAuth" : "Email / Password";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut(getAuth());
      router.push("/");
    } catch {
      setSigningOut(false);
    }
  }

  function copyUID() {
    if (!user) return;
    navigator.clipboard.writeText(user.uid).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="container-page pt-16 pb-32 max-w-3xl" style={{ position: "relative" }}>

      {/* Tag line */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8 uppercase"
        style={{ fontSize: 11, letterSpacing: "4px", color: "#a78bfa", fontWeight: 700 }}
      >
        <span className="w-8 h-[2px] block" style={{ background: "linear-gradient(90deg, #7c3aed, transparent)", boxShadow: "0 0 10px rgba(124,58,237,0.5)" }} />
        <span className="font-mono">◆ Identity Module · DevAstra</span>
      </motion.div>

      {/* ═══ AVATAR CARD ═══ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="rounded-2xl mb-6 overflow-hidden"
        style={{
          border: "1px solid rgba(124,58,237,0.15)",
          background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Banner */}
        <div className="relative h-24 overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.15), rgba(6,182,212,0.1))" }}>
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)", backgroundSize: "20px 20px" }} />
          <motion.div className="absolute rounded-full" style={{ bottom: -20, left: 60, width: 140, height: 80, background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent)", filter: "blur(40px)" }} animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity }} />
        </div>

        {/* Avatar + info */}
        <div className="flex items-end gap-5 px-7 pb-7" style={{ marginTop: -40 }}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 rounded-full flex items-center justify-center relative z-10"
            style={{
              width: 80, height: 80,
              border: "2px solid #060610",
              background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(37,99,235,0.5))",
              fontSize: 24, fontWeight: 800, color: "#fff",
              boxShadow: "0 0 0 3px rgba(124,58,237,0.4), 0 0 30px rgba(124,58,237,0.3)",
            }}
          >
            {initials}
          </motion.div>

          <div className="flex-1 min-w-0" style={{ paddingTop: 40 }}>
            <p className="truncate text-lg font-bold text-white tracking-wide">{user.displayName ?? user.email?.split("@")[0] ?? "User"}</p>
            <p className="text-xs text-slate-500 font-mono tracking-wider mt-1">▸ Member · DevAstra Platform</p>
          </div>

          <div className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ marginTop: 40, border: "1px solid rgba(16,185,129,0.35)", background: "rgba(16,185,129,0.08)", fontSize: 10, color: "#34d399", letterSpacing: "2px", fontWeight: 700 }}>
            <motion.span className="w-2 h-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px rgba(52,211,153,0.6)" }} animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            ACTIVE
          </div>
        </div>
      </motion.div>

      {/* ═══ STATS ROW ═══ */}
      <motion.div className="grid grid-cols-3 gap-4 mb-6" variants={stagger} initial="hidden" animate="show">
        {[
          { val: "PRO", color: "#a78bfa", label: "Plan", icon: "◆" },
          { val: "∞", color: "#06b6d4", label: "Access", icon: "◇" },
          { val: "✓", color: "#34d399", label: "Verified", icon: "◈" },
        ].map(({ val, color, label, icon }) => (
          <motion.div key={label} variants={fadeUp} whileHover={{ y: -3, scale: 1.01 }} className="text-center py-5 rounded-2xl group" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}>
            <span className="block text-xs mb-2 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color }}>{icon}</span>
            <span className="block text-2xl font-bold" style={{ color, textShadow: `0 0 15px ${color}60` }}>{val}</span>
            <span className="block text-[10px] text-slate-500 mt-2 uppercase tracking-[3px] font-mono font-bold group-hover:text-slate-300 transition-colors">{label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ═══ INFO CARDS ═══ */}
      <motion.div className="flex flex-col gap-4 mb-6" variants={stagger} initial="hidden" animate="show">

        {/* Email */}
        <motion.div variants={fadeUp} className="rounded-2xl px-6 py-5 group" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}>
          <p className="text-[10px] text-violet-400 tracking-[3px] uppercase mb-2 font-mono font-bold">▸ ✉  Email Address</p>
          <p className="text-[15px] text-slate-300 font-medium group-hover:text-white transition-colors">{user.email}</p>
        </motion.div>

        {/* UID */}
        <motion.div variants={fadeUp} className="rounded-2xl px-6 py-5 group" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}>
          <p className="text-[10px] text-violet-400 tracking-[3px] uppercase mb-2 font-mono font-bold">▸ 🔑  User ID</p>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="flex-1 min-w-0 truncate text-[13px] font-mono text-violet-300">{user.uid}</p>
            <button
              onClick={copyUID}
              className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105 text-[10px] font-mono uppercase tracking-widest font-bold"
              style={{
                border: copied ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(124,58,237,0.3)",
                background: copied ? "rgba(16,185,129,0.1)" : "rgba(124,58,237,0.08)",
                color: copied ? "#34d399" : "#a78bfa",
                boxShadow: copied ? "0 0 15px rgba(16,185,129,0.3)" : "0 0 10px rgba(124,58,237,0.15)",
              }}
            >
              {copied ? "✓ COPIED" : "⎘ COPY"}
            </button>
          </div>
        </motion.div>

        {/* Provider + Member Since */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: "🔒", label: "Auth Provider", value: providerLabel },
            { icon: "📅", label: "Member Since", value: joinDate },
          ].map(({ icon, label, value }) => (
            <motion.div key={label} variants={fadeUp} className="rounded-2xl px-5 py-5 group" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}>
              <p className="text-[10px] text-violet-400 tracking-[2.5px] uppercase mb-2 font-mono font-bold">▸ {icon}  {label}</p>
              <p className="text-[14px] text-slate-300 font-semibold group-hover:text-white transition-colors">{value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ═══ ACTION BUTTONS ═══ */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-4 flex-wrap">
        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/dashboard")}
          className="relative flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl overflow-hidden transition-all duration-300 text-xs font-mono uppercase tracking-widest font-bold"
          style={{
            minWidth: 160,
            border: "1px solid rgba(124,58,237,0.4)",
            background: "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(124,58,237,0.06))",
            color: "#a78bfa",
            boxShadow: "0 0 20px rgba(124,58,237,0.2)",
          }}
        >
          <span className="text-base">◆</span> Dashboard
        </motion.button>

        <motion.button
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSignOut}
          disabled={signingOut}
          className="relative flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl overflow-hidden transition-all duration-300 disabled:opacity-35 disabled:cursor-not-allowed text-xs font-mono uppercase tracking-widest font-bold"
          style={{
            minWidth: 160,
            border: "1px solid rgba(244,63,94,0.4)",
            background: "linear-gradient(135deg,rgba(244,63,94,0.1),rgba(244,63,94,0.05))",
            color: "#fb7185",
            boxShadow: "0 0 20px rgba(244,63,94,0.15)",
          }}
        >
          <span className="text-base">⏻</span> {signingOut ? "Signing out..." : "Sign Out"}
        </motion.button>
      </motion.div>
    </div>
  );
}