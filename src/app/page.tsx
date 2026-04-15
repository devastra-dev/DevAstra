"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";

/* 🔥 SSR SAFE DYNAMIC IMPORTS */
const Particles = dynamic(
  () => import("@/components/ui/Particles").then(m => m.Particles),
  { ssr: false }
);

const Hero = dynamic(
  () => import("@/components/home/Hero").then(m => m.Hero),
  { ssr: false }
);

const FeaturedProducts = dynamic(
  () => import("@/components/home/FeaturedProducts").then(m => m.FeaturedProducts),
  { ssr: false }
);

const Reveal = dynamic(
  () => import("@/components/ui/Reveal").then(m => m.Reveal),
  { ssr: false }
);

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">

      {/* 🌌 PARTICLES (SAFE) */}
      <Particles />

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full top-[-100px] left-1/3 animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-blue-500/20 blur-[120px] rounded-full bottom-[-100px] right-10 animate-pulse" />
      </div>

      {/* 📦 CONTENT */}
      <div className="container-page pt-24 pb-20 space-y-32">

        {/* 🚀 HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Hero />
        </motion.div>

        {/* 🔒 TRUST BAR */}
        <Reveal>
          <div className="grid grid-cols-3 gap-4 text-center text-sm text-slate-400">
            <div className="glass-panel py-4">⚡ Instant Download</div>
            <div className="glass-panel py-4">🔒 Secure Payment</div>
            <div className="glass-panel py-4">💎 Premium Quality</div>
          </div>
        </Reveal>

        {/* 💎 PRODUCTS */}
        <Reveal>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FeaturedProducts />
          </motion.div>
        </Reveal>

        {/* ⚡ WHY */}
        <Reveal>
          <div className="grid md:grid-cols-3 gap-8 text-center">

            <div className="glass-panel p-6">
              <h3 className="font-semibold text-white">Save Months of Work</h3>
              <p className="text-sm text-slate-400 mt-2">
                Skip development time with ready-to-use codebases.
              </p>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-semibold text-white">Production Ready</h3>
              <p className="text-sm text-slate-400 mt-2">
                Built with scalable architecture and clean code.
              </p>
            </div>

            <div className="glass-panel p-6">
              <h3 className="font-semibold text-white">Easy Customization</h3>
              <p className="text-sm text-slate-400 mt-2">
                Modify quickly and launch your own product.
              </p>
            </div>

          </div>
        </Reveal>

        {/* 🚀 CTA */}
        <Reveal>
          <div className="text-center space-y-6">

            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-500 bg-clip-text text-transparent">
              Start Building Today 🚀
            </h2>

            <p className="text-slate-400">
              Don’t waste time — launch faster with premium code.
            </p>

            <Link
              href="/products"
              className="btn-gradient px-8 py-4 text-lg"
            >
              Browse Products
            </Link>

          </div>
        </Reveal>

      </div>
    </main>
  );
}