import "./globals.css";

import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { AuthProvider } from "@/components/auth/AuthContext";
import Script from "next/script";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DevAstra",
  description: "Premium developer products and AI projects",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ─── Premium Fonts ─── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        {/* ─── Global Layout Styles ─── */}
        <style>{`
          :root {
            --clr-bg:        #030712;
            --clr-surface:   #0a0f1e;
            --clr-border:    rgba(56,189,248,0.12);
            --clr-cyan:      #22d3ee;
            --clr-cyan-dim:  rgba(34,211,238,0.18);
            --clr-gold:      #f59e0b;
            --clr-gold-dim:  rgba(245,158,11,0.15);
            --clr-green:     #4ade80;
            --clr-green-dim: rgba(74,222,128,0.18);
            --clr-text:      #e2e8f0;
            --clr-muted:     #64748b;
            --font-display:  'Syne', sans-serif;
            --font-mono:     'Space Mono', monospace;
            --font-body:     'Inter', sans-serif;
            --radius-pill:   9999px;
            --glow-cyan:     0 0 24px rgba(34,211,238,0.35), 0 0 8px rgba(34,211,238,0.2);
            --glow-gold:     0 0 24px rgba(245,158,11,0.35),  0 0 8px rgba(245,158,11,0.2);
            --glow-green:    0 0 24px rgba(74,222,128,0.35),  0 0 8px rgba(74,222,128,0.2);
            --transition:    cubic-bezier(0.23,1,0.32,1);
          }

          /* ── Reset & Base ── */
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

          html { scroll-behavior: smooth; }

          body {
            background: var(--clr-bg);
            color: var(--clr-text);
            font-family: var(--font-body);
            font-weight: 300;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
          }

          /* ── Scan-line overlay ── */
          body::before {
            content: '';
            position: fixed;
            inset: 0;
            background: repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.03) 2px,
              rgba(0,0,0,0.03) 4px
            );
            pointer-events: none;
            z-index: 9999;
          }

          /* ── Ambient nebula background ── */
          body::after {
            content: '';
            position: fixed;
            inset: 0;
            background:
              radial-gradient(ellipse 80% 60% at 10% 0%,   rgba(34,211,238,0.07) 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 90% 100%, rgba(245,158,11,0.06) 0%, transparent 55%),
              radial-gradient(ellipse 50% 70% at 50% 50%,  rgba(99,102,241,0.04) 0%, transparent 70%);
            pointer-events: none;
            z-index: 0;
          }

          /* ── Grid texture ── */
          .grid-texture {
            position: fixed;
            inset: 0;
            background-image:
              linear-gradient(var(--clr-border) 1px, transparent 1px),
              linear-gradient(90deg, var(--clr-border) 1px, transparent 1px);
            background-size: 60px 60px;
            pointer-events: none;
            z-index: 0;
            mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 80%);
          }

          /* ── Floating orbs ── */
          .orb {
            position: fixed;
            border-radius: 50%;
            filter: blur(80px);
            pointer-events: none;
            z-index: 0;
            animation: drift var(--dur, 20s) ease-in-out infinite alternate;
          }
          .orb-1 { width: 480px; height: 480px; top: -120px; left: -100px; background: radial-gradient(circle, rgba(34,211,238,0.10), transparent 70%); --dur: 22s; }
          .orb-2 { width: 380px; height: 380px; bottom: -80px;  right: -80px;  background: radial-gradient(circle, rgba(245,158,11,0.09), transparent 70%); --dur: 18s; animation-direction: alternate-reverse; }
          .orb-3 { width: 280px; height: 280px; top: 40%;  left: 55%;  background: radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%); --dur: 25s; }

          @keyframes drift {
            from { transform: translate(0, 0) scale(1); }
            to   { transform: translate(40px, 30px) scale(1.08); }
          }

          /* ── Floating Action Buttons ── */
          .fab-container {
            position: fixed;
            bottom: 2rem;
            right: 1.75rem;
            z-index: 50;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 0.75rem;
          }

          .fab {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0;
            height: 48px;
            padding: 0 14px;
            border-radius: var(--radius-pill);
            border: 1px solid transparent;
            font-family: var(--font-mono);
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-decoration: none;
            cursor: pointer;
            overflow: hidden;
            transition:
              width 0.45s var(--transition),
              gap 0.45s var(--transition),
              box-shadow 0.3s ease,
              border-color 0.3s ease,
              transform 0.3s ease;
            white-space: nowrap;
          }

          /* Icon wrapper */
          .fab-icon {
            font-size: 1.1rem;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
          }

          /* Label */
          .fab-label {
            max-width: 0;
            overflow: hidden;
            opacity: 0;
            transition:
              max-width 0.4s var(--transition),
              opacity 0.3s ease,
              margin-left 0.4s var(--transition);
            font-size: 0.68rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            position: relative;
            z-index: 1;
          }

          .fab:hover .fab-label {
            max-width: 80px;
            opacity: 1;
            margin-left: 0.5rem;
          }

          /* Shimmer */
          .fab::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
            transform: translateX(-100%);
            transition: transform 0.6s ease;
          }
          .fab:hover::before { transform: translateX(100%); }

          .fab:hover { transform: translateY(-2px); }
          .fab:active { transform: translateY(0) scale(0.97); }

          /* ── FAB: Support (Cyan) ── */
          .fab-support {
            background: linear-gradient(135deg, rgba(34,211,238,0.15), rgba(34,211,238,0.08));
            border-color: rgba(34,211,238,0.35);
            color: var(--clr-cyan);
          }
          .fab-support:hover {
            background: linear-gradient(135deg, rgba(34,211,238,0.25), rgba(34,211,238,0.14));
            border-color: var(--clr-cyan);
            box-shadow: var(--glow-cyan), inset 0 1px 0 rgba(34,211,238,0.2);
          }

          /* Pulse ring */
          .fab-support::after {
            content: '';
            position: absolute;
            inset: -3px;
            border-radius: var(--radius-pill);
            border: 1px solid rgba(34,211,238,0.4);
            animation: pulse-ring 2.4s ease-out infinite;
            pointer-events: none;
          }

          /* ── FAB: WhatsApp (Green) ── */
          .fab-whatsapp {
            background: linear-gradient(135deg, rgba(74,222,128,0.15), rgba(74,222,128,0.08));
            border-color: rgba(74,222,128,0.35);
            color: var(--clr-green);
          }
          .fab-whatsapp:hover {
            background: linear-gradient(135deg, rgba(74,222,128,0.25), rgba(74,222,128,0.14));
            border-color: var(--clr-green);
            box-shadow: var(--glow-green), inset 0 1px 0 rgba(74,222,128,0.2);
          }

          /* ── Pulse animation ── */
          @keyframes pulse-ring {
            0%   { opacity: 0.7; transform: scale(1); }
            100% { opacity: 0;   transform: scale(1.5); }
          }

          /* ── Status dot ── */
          .status-dot {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--clr-green);
            box-shadow: 0 0 6px var(--clr-green);
            animation: blink 2s ease-in-out infinite;
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
          }

          /* ── HUD Corner decorations ── */
          .hud-corner {
            position: fixed;
            width: 40px;
            height: 40px;
            pointer-events: none;
            z-index: 10;
            opacity: 0.35;
          }
          .hud-corner::before,
          .hud-corner::after {
            content: '';
            position: absolute;
            background: var(--clr-cyan);
          }
          .hud-corner::before { width: 100%; height: 1px; top: 0; }
          .hud-corner::after  { width: 1px; height: 100%; }

          .hud-tl { top: 0;    left: 0; }
          .hud-tl::after { top: 0; left: 0; }

          .hud-tr { top: 0;    right: 0; transform: scaleX(-1); }
          .hud-tr::after { top: 0; left: 0; }

          .hud-bl { bottom: 0; left: 0;  transform: scaleY(-1); }
          .hud-bl::after { top: 0; left: 0; }

          .hud-br { bottom: 0; right: 0; transform: scale(-1, -1); }
          .hud-br::after { top: 0; left: 0; }

          /* ── Scrollbar ── */
          ::-webkit-scrollbar       { width: 5px; }
          ::-webkit-scrollbar-track { background: var(--clr-bg); }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--clr-cyan), var(--clr-gold));
            border-radius: 4px;
          }

          /* ── Selection ── */
          ::selection { background: rgba(34,211,238,0.25); color: #fff; }
        `}</style>
      </head>

      <body className="relative flex flex-col min-h-screen">

        {/* ── Ambient layers ── */}
        <div className="grid-texture" aria-hidden="true" />
        <div className="orb orb-1" aria-hidden="true" />
        <div className="orb orb-2" aria-hidden="true" />
        <div className="orb orb-3" aria-hidden="true" />

        {/* ── HUD corners ── */}
        <div className="hud-corner hud-tl" aria-hidden="true" />
        <div className="hud-corner hud-tr" aria-hidden="true" />
        <div className="hud-corner hud-bl" aria-hidden="true" />
        <div className="hud-corner hud-br" aria-hidden="true" />

        {/* 🔥 Cursor Glow */}
        <CursorGlow />

        {/* 🔐 Auth */}
        <AuthProvider>

          {/* 🚀 Navbar */}
          <Navbar />

          {/* 📦 MAIN CONTENT */}
          <main className="pt-20 relative z-10 flex-1">
            {children}
          </main>

          {/* ══════════════════════════════════
              🔥 PREMIUM FLOATING ACTION BUTTONS
              ══════════════════════════════════ */}
          <div className="fab-container" role="navigation" aria-label="Quick actions">

            {/* 🔵 SUPPORT */}
            <a
              href="/support"
              className="fab fab-support"
              aria-label="Go to Support"
            >
              <span className="fab-icon" role="img" aria-hidden="true">🛠</span>
              <span className="fab-label">Support</span>
            </a>

            {/* 🟢 WHATSAPP */}
            <a
              href="https://wa.me/919339016057"
              target="_blank"
              rel="noopener noreferrer"
              className="fab fab-whatsapp"
              aria-label="Chat on WhatsApp"
            >
              <span className="status-dot" aria-hidden="true" />
              <span className="fab-icon" role="img" aria-hidden="true">💬</span>
              <span className="fab-label">Chat</span>
            </a>

          </div>

          {/* 🔥 FOOTER */}
          <Footer />

        </AuthProvider>

        {/* 💳 Razorpay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

      </body>
    </html>
  );
}
