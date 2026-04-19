// app/profile/page.tsx
"use client";

import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { useState } from "react";

/* ── helpers ── */
function getInitials(email: string): string {
  const parts = email.split("@")[0].split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || email[0]?.toUpperCase() || "?";
}

function formatDate(ts: string | null): string {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router   = useRouter();
  const [copied,      setCopied]      = useState(false);
  const [signingOut,  setSigningOut]  = useState(false);

  /* ── not logged in ── */
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="text-center p-10 rounded-sm"
          style={{
            border: "1.5px solid rgba(0,245,255,0.3)",
            background: "linear-gradient(135deg,rgba(0,245,255,0.08),rgba(0,40,80,0.2))",
            boxShadow: "0 0 30px rgba(0,245,255,0.1), inset 0 1px 0 rgba(0,245,255,0.15)",
          }}
        >
          <p
            className="font-['Orbitron',monospace] text-sm uppercase tracking-widest mb-4"
            style={{ color: "#ff4455", fontWeight: 700, fontSize: 13, letterSpacing: "3px" }}
          >
            Not Authenticated
          </p>
          <p className="text-sm mb-6" style={{ color: "#4a7a8a", fontFamily: "'Share Tech Mono',monospace", letterSpacing: "0.5px" }}>
            You must be logged in to view this page.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-sm text-xs uppercase tracking-widest transition-all duration-300 hover:scale-105 font-['Share Tech Mono',monospace]"
            style={{
              fontWeight: 600,
              border: "1.5px solid rgba(0,245,255,0.4)",
              background: "linear-gradient(135deg,rgba(0,245,255,0.15),rgba(0,245,255,0.08))",
              color: "#00f5ff",
              boxShadow: "0 0 15px rgba(0,245,255,0.3)",
              letterSpacing: "2px",
            }}
          >
            → Login
          </button>
        </div>
      </div>
    );
  }

  const initials   = getInitials(user.email ?? "");
  const joinDate   = formatDate(user.metadata?.creationTime ?? null);
  const providerID = user.providerData?.[0]?.providerId ?? "password";
  const providerLabel =
    providerID === "google.com"  ? "Google OAuth" :
    providerID === "github.com"  ? "GitHub OAuth" :
    "Email / Password";

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
    <>
      <style>{`
        /* ════════════════════════════════════════════════════════════
           PREMIUM PROFILE PAGE DESIGN SYSTEM
           World-Class UI with Advanced Animations & Effects
        ════════════════════════════════════════════════════════════ */

        @keyframes p-fadeDown {
          0% { opacity: 0; transform: translateY(-30px) rotateX(10deg); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0); }
        }
        
        @keyframes p-fadeUp {
          0% { opacity: 0; transform: translateY(30px) rotateX(-10deg); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0) rotateX(0deg); filter: blur(0); }
        }

        @keyframes p-glow { 
          0%, 100% { text-shadow: 0 0 10px rgba(0,245,255,0.3), 0 0 20px rgba(0,245,255,0.1); }
          50% { text-shadow: 0 0 25px rgba(0,245,255,0.7), 0 0 45px rgba(0,245,255,0.3); }
        }

        @keyframes p-blink { 
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }

        @keyframes p-shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes p-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }

        @keyframes p-pulse-border {
          0%, 100% { border-color: rgba(0,245,255,0.3); box-shadow: 0 0 10px rgba(0,245,255,0.1); }
          50% { border-color: rgba(0,245,255,0.8); box-shadow: 0 0 30px rgba(0,245,255,0.3); }
        }

        @keyframes p-gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes p-rotate-glow {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.05); }
          100% { transform: rotate(360deg) scale(1); }
        }

        /* Base animations */
        .prof-fade {
          opacity: 0;
          transform: translateY(-30px) rotateX(10deg);
          animation: p-fadeDown 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          perspective: 1000px;
        }

        .prof-up {
          opacity: 0;
          transform: translateY(30px) rotateX(-10deg);
          animation: p-fadeUp 0.85s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          perspective: 1000px;
        }

        /* Premium Card System */
        .p-card {
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(16px);
          background-attachment: fixed;
        }

        .p-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(0,245,255,0.9) 25%, rgba(255,204,68,0.7) 50%, rgba(0,245,255,0.9) 75%, transparent 100%);
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .p-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(0,245,255,0.12) 0%, transparent 65%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
        }

        .p-card:hover::before { opacity: 1; }
        .p-card:hover::after { opacity: 1; }
        
        .p-card:hover {
          border-color: rgba(0,245,255,0.7) !important;
          box-shadow: 
            0 0 50px rgba(0,245,255,0.25),
            0 0 100px rgba(0,245,255,0.12),
            inset 0 1px 0 rgba(0,245,255,0.3),
            inset 0 -20px 40px rgba(0,245,255,0.05) !important;
          transform: translateY(-8px) scale(1.01);
        }

        /* Premium Button */
        .p-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .p-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(110deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%);
          transform: translateX(-100%);
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .p-btn:hover::before { transform: translateX(100%); }
        
        .p-btn:hover {
          transform: translateY(-4px) scale(1.02);
          letter-spacing: 2.5px;
        }

        .p-btn:active { transform: translateY(-1px) scale(0.98); }

        /* Status badge animation */
        .status-badge {
          animation: p-float 3s ease-in-out infinite;
        }

        /* Group hover effects */
        .group-hover\\:shadow-premium:hover {
          box-shadow: 0 0 30px rgba(0,245,255,0.3) !important;
        }

        /* Advanced gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #00f5ff 0%, #ffcc44 50%, #00f5ff 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: p-gradient-shift 6s ease infinite;
        }

        /* Glassmorphism effect */
        .glass-effect {
          background: linear-gradient(135deg, rgba(0,245,255,0.08), rgba(0,40,80,0.16));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(0,245,255,0.15);
          box-shadow: inset 0 1px 0 rgba(0,245,255,0.2), 0 10px 40px rgba(0,0,0,0.3);
        }

        /* Floating effect */
        .float-element {
          animation: p-float 4s ease-in-out infinite;
        }

        /* Smooth transitions */
        * {
          transition-property: color, background-color, border-color, box-shadow, transform;
          transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>

      <div className="container-page pt-16 pb-32 max-w-3xl">

        {/* ── Tag line ── */}
        <div
          className="prof-fade flex items-center gap-3 mb-8 uppercase"
          style={{
            fontFamily: "'Share Tech Mono',monospace",
            fontSize: 12,
            letterSpacing: "5px",
            color: "#00f5ff",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 40,
              height: 2,
              background: "linear-gradient(90deg, #00f5ff, transparent)",
              boxShadow: "0 0 15px #00f5ff",
              flexShrink: 0,
              display: "block",
              animation: "p-shimmer 2s ease infinite",
            }}
          />
          ◆ Identity Module · DevAstra ◆
        </div>

        {/* ══════════════════════════════
            AVATAR CARD
        ══════════════════════════════ */}
        <div
          className="p-card prof-up mb-6 glass-effect"
          style={{
            border: "1.5px solid rgba(0,245,255,0.2)",
            background: "linear-gradient(135deg,rgba(0,245,255,0.07),rgba(0,60,120,0.3))",
            animationDelay: ".15s",
            boxShadow: "0 20px 60px rgba(0,245,255,0.1), inset 0 1px 0 rgba(0,245,255,0.2)",
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            e.currentTarget.style.setProperty('--mx', `${x}%`);
            e.currentTarget.style.setProperty('--my', `${y}%`);
          }}
        >
          {/* Animated Banner */}
          <div
            className="relative overflow-hidden"
            style={{
              height: 100,
              background: "linear-gradient(135deg,rgba(0,80,160,0.9),rgba(0,40,100,0.95),rgba(157,111,255,0.15))",
              position: "relative",
            }}
          >
            {/* Banner grid */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "linear-gradient(rgba(0,245,255,0.1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.1) 1px,transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
            {/* Animated gradient blobs */}
            <div
              className="absolute rounded-full"
              style={{
                bottom: -30,
                left: 50,
                width: 160,
                height: 100,
                background: "radial-gradient(circle, rgba(0,245,255,0.4), transparent)",
                filter: "blur(50px)",
                animation: "p-float 6s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                top: -20,
                right: 60,
                width: 120,
                height: 120,
                background: "radial-gradient(circle, rgba(157,111,255,0.3), transparent)",
                filter: "blur(40px)",
                animation: "p-float 7s ease-in-out infinite 0.5s",
              }}
            />
          </div>

          {/* Avatar + info row */}
          <div className="flex items-end gap-5 px-8 pb-8" style={{ marginTop: -48 }}>
            {/* Avatar circle with advanced glow */}
            <div
              className="flex-shrink-0 rounded-full flex items-center justify-center relative z-10 float-element"
              style={{
                width: 88,
                height: 88,
                border: "2.5px solid #020810",
                background: "linear-gradient(135deg,rgba(0,245,255,0.5),rgba(157,111,255,0.6))",
                fontFamily: "'Orbitron',monospace",
                fontSize: 26,
                fontWeight: 900,
                color: "#fff",
                textShadow: "0 0 25px rgba(0,245,255,0.8), 0 0 50px rgba(157,111,255,0.5)",
                boxShadow: "0 0 0 3px rgba(0,245,255,0.5), 0 0 40px rgba(0,245,255,0.4), 0 0 80px rgba(157,111,255,0.25), inset 0 0 30px rgba(0,245,255,0.2)",
                animation: "p-glow 4s ease-in-out infinite",
              }}
            >
              {initials}
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0" style={{ paddingTop: 48 }}>
              <p
                className="truncate"
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 18,
                  fontWeight: 900,
                  color: "#00f5ff",
                  letterSpacing: 2,
                  textShadow: "0 0 10px rgba(0,245,255,0.4)",
                }}
              >
                {user.displayName ?? user.email?.split("@")[0] ?? "User"}
              </p>
              <p
                style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: 12,
                  color: "#4a7a8a",
                  letterSpacing: "2.5px",
                  marginTop: 6,
                  fontWeight: 600,
                }}
              >
                ▸ Member · DevAstra Platform
              </p>
            </div>

            {/* Status badge */}
            <div
              className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-full status-badge"
              style={{
                border: "1.5px solid rgba(0,245,100,0.6)",
                background: "linear-gradient(135deg,rgba(0,245,100,0.15),rgba(0,245,100,0.05))",
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 11,
                color: "#00f564",
                letterSpacing: "2.5px",
                marginTop: 48,
                boxShadow: "0 0 20px rgba(0,245,100,0.25), inset 0 1px 0 rgba(0,245,100,0.2)",
                transition: "all 0.3s ease",
                fontWeight: 700,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#00f564",
                  boxShadow: "0 0 12px #00f564, 0 0 24px rgba(0,245,100,0.5)",
                  animation: "p-blink 2s ease infinite",
                  flexShrink: 0,
                }}
              />
              ACTIVE
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            STATS ROW
        ══════════════════════════════ */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { val: "PRO", color: "#00f5ff", shadow: "rgba(0,245,255,0.6)", label: "Plan", icon: "◆" },
            { val: "∞", color: "#ffcc44", shadow: "rgba(255,204,68,0.6)", label: "Access", icon: "◇" },
            { val: "✓", color: "#00f564", shadow: "rgba(0,245,100,0.6)", label: "Verified", icon: "◈" },
          ].map(({ val, color, shadow, label, icon }, i) => (
            <div
              key={label}
              className="p-card prof-up text-center py-6 group relative"
              style={{
                border: "1.5px solid rgba(0,245,255,0.15)",
                background: "linear-gradient(135deg,rgba(0,245,255,0.06),rgba(0,40,80,0.18))",
                animationDelay: `${0.25 + i * 0.07}s`,
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                e.currentTarget.style.setProperty('--mx', `${x}%`);
                e.currentTarget.style.setProperty('--my', `${y}%`);
              }}
            >
              {/* Icon */}
              <span
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 14,
                  color: color,
                  opacity: 0.6,
                  display: "block",
                  marginBottom: 8,
                  transition: "all 0.3s ease",
                }}
                className="group-hover:scale-150 group-hover:opacity-100"
              >
                {icon}
              </span>

              {/* Value */}
              <span
                style={{
                  fontFamily: "'Orbitron',monospace",
                  fontSize: 26,
                  fontWeight: 900,
                  color: color,
                  textShadow: `0 0 20px ${shadow}, 0 0 40px ${shadow}`,
                  display: "block",
                  lineHeight: 1,
                  transition: "all .3s ease",
                }}
                className="group-hover:scale-125"
              >
                {val}
              </span>

              {/* Label */}
              <span
                style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: 10,
                  color: "#4a7a8a",
                  letterSpacing: "3.5px",
                  marginTop: 12,
                  display: "block",
                  textTransform: "uppercase",
                  transition: "color .3s ease",
                  fontWeight: 700,
                }}
                className="group-hover:text-cyan-400"
              >
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* ══════════════════════════════
            INFO CARDS
        ══════════════════════════════ */}
        <div className="flex flex-col gap-4 mb-6">

          {/* Email */}
          <div
            className="p-card prof-up px-7 py-6 group"
            style={{
              border: "1.5px solid rgba(0,245,255,0.15)",
              background: "linear-gradient(135deg,rgba(0,245,255,0.06),rgba(0,40,80,0.18))",
              animationDelay: ".42s",
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty('--mx', `${x}%`);
              e.currentTarget.style.setProperty('--my', `${y}%`);
            }}
          >
            <p
              style={{
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 11,
                color: "#00f5ff",
                letterSpacing: "3.5px",
                textTransform: "uppercase",
                marginBottom: 12,
                fontWeight: 700,
              }}
            >
              ▸ ✉ &nbsp;Email Address
            </p>
            <p
              style={{
                fontSize: 16,
                color: "#a8d8e8",
                fontWeight: 500,
                transition: "all .3s ease",
                letterSpacing: "0.5px",
              }}
              className="group-hover:text-cyan-300"
            >
              {user.email}
            </p>
          </div>

          {/* UID */}
          <div
            className="p-card prof-up px-7 py-6 group"
            style={{
              border: "1.5px solid rgba(0,245,255,0.15)",
              background: "linear-gradient(135deg,rgba(0,245,255,0.06),rgba(0,40,80,0.18))",
              animationDelay: ".50s",
            }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              e.currentTarget.style.setProperty('--mx', `${x}%`);
              e.currentTarget.style.setProperty('--my', `${y}%`);
            }}
          >
            <p
              style={{
                fontFamily: "'Share Tech Mono',monospace",
                fontSize: 11,
                color: "#00f5ff",
                letterSpacing: "3.5px",
                textTransform: "uppercase",
                marginBottom: 12,
                fontWeight: 700,
              }}
            >
              ▸ 🔑 &nbsp;User ID
            </p>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p
                className="flex-1 min-w-0 truncate"
                style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: 13,
                  color: "#00f5ff",
                  letterSpacing: ".5px",
                  transition: "color .3s ease",
                  fontWeight: 600,
                }}
              >
                {user.uid}
              </p>
              <button
                onClick={copyUID}
                className="p-btn flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-110"
                style={{
                  fontFamily: "'Share Tech Mono',monospace",
                  fontSize: 11,
                  letterSpacing: "2px",
                  fontWeight: 700,
                  border: copied ? "1.5px solid rgba(0,245,100,0.7)" : "1.5px solid rgba(0,245,255,0.4)",
                  background: copied
                    ? "linear-gradient(135deg,rgba(0,245,100,0.2),rgba(0,245,100,0.1))"
                    : "linear-gradient(135deg,rgba(0,245,255,0.15),rgba(0,245,255,0.08))",
                  color: copied ? "#00f564" : "#00f5ff",
                  boxShadow: copied ? "0 0 20px rgba(0,245,100,0.4)" : "0 0 15px rgba(0,245,255,0.25)",
                  textTransform: "uppercase",
                  transition: "all 0.3s ease",
                }}
              >
                {copied ? "✓ COPIED" : "⎘ COPY"}
              </button>
            </div>
          </div>

          {/* Provider + Member Since */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: "🔒", label: "Auth Provider", value: providerLabel },
              { icon: "📅", label: "Member Since", value: joinDate },
            ].map(({ icon, label, value }, i) => (
              <div
                key={label}
                className="p-card prof-up px-6 py-6 group"
                style={{
                  border: "1.5px solid rgba(0,245,255,0.15)",
                  background: "linear-gradient(135deg,rgba(0,245,255,0.06),rgba(0,40,80,0.18))",
                  animationDelay: `${0.58 + i * 0.07}s`,
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  e.currentTarget.style.setProperty('--mx', `${x}%`);
                  e.currentTarget.style.setProperty('--my', `${y}%`);
                }}
              >
                <p
                  style={{
                    fontFamily: "'Share Tech Mono',monospace",
                    fontSize: 10,
                    color: "#00f5ff",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    marginBottom: 10,
                    fontWeight: 700,
                  }}
                >
                  ▸ {icon} &nbsp;{label}
                </p>
                <p
                  style={{
                    fontSize: 15,
                    color: "#a8d8e8",
                    fontWeight: 600,
                    transition: "color .3s ease",
                  }}
                  className="group-hover:text-cyan-300"
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* ══════════════════════════════
            ACTION BUTTONS — PREMIUM
        ══════════════════════════════ */}
        <div className="flex gap-4 flex-wrap">

          <button
            onClick={() => router.push("/dashboard")}
            className="p-btn relative flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg overflow-hidden transition-all duration-400"
            style={{
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 12,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              minWidth: 160,
              fontWeight: 700,
              border: "2px solid rgba(0,245,255,0.5)",
              background: "linear-gradient(135deg,rgba(0,245,255,0.2),rgba(0,245,255,0.1))",
              color: "#00f5ff",
              boxShadow:
                "0 0 30px rgba(0,245,255,0.35), inset 0 1px 0 rgba(0,245,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            <span style={{ fontSize: 16 }}>◆</span>
            Dashboard
          </button>

          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className="p-btn relative flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg overflow-hidden transition-all duration-400 disabled:opacity-35 disabled:cursor-not-allowed"
            style={{
              fontFamily: "'Share Tech Mono',monospace",
              fontSize: 12,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              minWidth: 160,
              fontWeight: 700,
              border: "2px solid rgba(255,68,85,0.5)",
              background: "linear-gradient(135deg,rgba(255,68,85,0.15),rgba(255,68,85,0.08))",
              color: "#ff4455",
              boxShadow:
                "0 0 30px rgba(255,68,85,0.3), inset 0 1px 0 rgba(255,68,85,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)",
            }}
          >
            <span style={{ fontSize: 16 }}>⏻</span>
            {signingOut ? "Signing out..." : "Sign Out"}
          </button>

        </div>

      </div>
    </>
  );
}