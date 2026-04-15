"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function PremiumLogo() {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 2 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="relative group cursor-pointer"
    >
      {/* 🔥 OUTER GLOW */}
      <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

      {/* 🔥 MAIN LOGO CONTAINER */}
      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-white/10 shadow-lg shadow-cyan-500/20">

        {/* 🌊 LIGHT SWEEP EFFECT */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />

        {/* 🔥 IMAGE */}
        <Image
          src="/logo.png"
          alt="DevAstra Logo"
          fill
          className="object-cover"
          priority
        />

      </div>

      {/* ⚡ PULSE DOT (LIVE FEEL) */}
      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400 animate-ping" />
      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-400" />
    </motion.div>
  );
}