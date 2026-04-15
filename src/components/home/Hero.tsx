"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  return (
    <div className="text-center space-y-8">

      {/* 🔥 TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold tracking-tight text-gradient"
      >
        Build & Sell Premium Code 🚀
      </motion.h1>

      {/* ✨ SUBTEXT */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 text-lg max-w-xl mx-auto"
      >
        High-quality AI tools, SaaS templates, and developer products ready to use.
      </motion.p>

      {/* 🎯 BUTTONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center gap-4"
      >
        <MagneticButton className="btn-gradient">
          <Link href="/products">Explore</Link>
        </MagneticButton>

        <Link
          href="/dashboard"
          className="btn-secondary"
        >
          Dashboard
        </Link>
      </motion.div>

    </div>
  );
}