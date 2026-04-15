import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { AuthProvider } from "@/components/auth/AuthContext";
import Script from "next/script";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "DevAstra",
  description: "Premium developer products and AI projects"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="relative flex flex-col min-h-screen" data-scroll-behavior="smooth">

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

          {/* ========================= */}
          {/* 🔥 PREMIUM FLOATING SUPPORT */}
          {/* ========================= */}
          <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

            {/* 🔵 SUPPORT */}
            <a
              href="/support"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 text-black font-medium shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all duration-300"
            >
              <span className="text-lg">🛠</span>
              <span className="hidden sm:inline opacity-0 group-hover:opacity-100 transition">
                Support
              </span>
            </a>

            {/* 🟢 WHATSAPP */}
            <a
              href="https://wa.me/919339016057"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white font-medium shadow-lg shadow-green-500/30 hover:bg-green-400 transition-all duration-300"
            >
              <span className="text-lg">💬</span>
              <span className="hidden sm:inline opacity-0 group-hover:opacity-100 transition">
                Chat
              </span>
            </a>

          </div>

          {/* 🔥 FOOTER (IMPORTANT ADD) */}
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