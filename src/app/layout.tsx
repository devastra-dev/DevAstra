import "./globals.css";

import type { Metadata } from "next";

import { Navbar } from "@/components/layout/Navbar";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { AuthProvider } from "@/components/auth/AuthContext";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { validateEnv } from "@/lib/env";

validateEnv();

export const metadata: Metadata = {
  title: {
    default: "DevAstra — Premium Developer Tools & AI Templates",
    template: "%s | DevAstra",
  },
  description:
    "Discover premium AI-powered SaaS templates, production-ready codebases, and developer tools. Ship faster, scale further with DevAstra.",
  keywords: ["developer tools", "AI templates", "SaaS starter", "Next.js", "premium code"],
  authors: [{ name: "DevAstra" }],
  openGraph: {
    title: "DevAstra — Premium Developer Tools",
    description: "AI-powered SaaS templates, production-ready codebases and developer tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* ─── Premium Fonts ─── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

      </head>

      <body className="relative flex flex-col min-h-screen" style={{ position: "relative" }}>

        {/* ── Ambient layers ── */}
        <div className="grid-texture" aria-hidden="true" style={{ position: "fixed" }} />
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
          <main className="pt-20 relative z-10 flex-1" style={{ position: "relative" }}>
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
