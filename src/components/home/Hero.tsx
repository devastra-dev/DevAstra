"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useEffect, useState, useRef } from "react";

/* ── Typing animation hook ──────────────────────────────────────────── */
const PHRASES = [
  "AI-Powered SaaS Templates",
  "Production-Ready Codebases",
  "Premium Developer Tools",
  "Ship Faster, Scale Further",
];

function useTypingAnimation() {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIdx];
    const speed = isDeleting ? 35 : 65;

    if (!isDeleting && charIdx === current.length) {
      const timeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((prev) => (prev + 1) % PHRASES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setText(current.substring(0, isDeleting ? charIdx - 1 : charIdx + 1));
      setCharIdx((prev) => (isDeleting ? prev - 1 : prev + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx]);

  return text;
}

/* ── Hex grid decoration ────────────────────────────────────────────── */
function HexGrid() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2322d3ee' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: "60px 52px",
      }}
    />
  );
}

/* ── Floating glow orbs ─────────────────────────────────────────────── */
function FloatingOrb({
  size,
  color,
  top,
  left,
  delay,
}: {
  size: number;
  color: string;
  top: string;
  left: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${size * 0.4}px)`,
      }}
      animate={{
        y: [0, -20, 0, 15, 0],
        x: [0, 10, -5, 8, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 8 + delay,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
}

/* ── Holographic ring ───────────────────────────────────────────────── */
function HoloRing({ size, delay }: { size: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full border pointer-events-none"
      style={{
        width: size,
        height: size,
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        borderColor: "rgba(34, 211, 238, 0.08)",
      }}
      animate={{
        scale: [1, 1.15, 1],
        opacity: [0.3, 0.6, 0.3],
        rotate: [0, 360],
      }}
      transition={{
        duration: 12 + delay * 2,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
    />
  );
}

/* ── Pulse beacon ───────────────────────────────────────────────────── */
function PulseBeacon() {
  return (
    <div className="relative inline-flex items-center justify-center">
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-cyan-400"
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.8, 0, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />
      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════ */
/*                         HERO COMPONENT                                */
/* ══════════════════════════════════════════════════════════════════════ */
export function Hero() {
  const typedText = useTypingAnimation();
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── mouse-reactive glow ── */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    const el = containerRef.current;
    el?.addEventListener("mousemove", handleMouse);
    return () => el?.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="hero-wrapper relative flex flex-col items-center justify-center min-h-[100vh] overflow-hidden pt-28"
    >
      {/* ── VIDEO BACKGROUND ────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-20">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          poster=""
        >
          {/* Using a procedural animated gradient as fallback — no external video needed */}
        </video>
        {/* Animated gradient fallback that simulates video-like movement */}
        <div className="hero-video-gradient absolute inset-0" />
      </div>

      {/* ── DARK OVERLAY + GRADIENT ─────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950/95" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cyan-950/20 via-transparent to-blue-950/20" />

      {/* ── HEX GRID ────────────────────────────────────────────────── */}
      <HexGrid />

      {/* ── FLOATING GLOW ORBS ──────────────────────────────────────── */}
      <FloatingOrb size={300} color="rgba(34,211,238,0.12)" top="-10%" left="10%" delay={0} />
      <FloatingOrb size={200} color="rgba(139,92,246,0.10)" top="60%" left="75%" delay={2} />
      <FloatingOrb size={150} color="rgba(59,130,246,0.08)" top="30%" left="-5%" delay={4} />

      {/* ── HOLOGRAPHIC RINGS ───────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <HoloRing size={500} delay={0} />
        <HoloRing size={700} delay={3} />
        <HoloRing size={900} delay={6} />
      </div>

      {/* ── MOUSE REACTIVE SPOTLIGHT ────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 -z-[5] pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at calc(${springX.get() * 100}% ) calc(${springY.get() * 100}%), rgba(34,211,238,0.06), transparent 60%)`,
        }}
      />

      {/* ── CONTENT ─────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-4">

        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/5 backdrop-blur-md px-5 py-2"
        >
          <PulseBeacon />
          <span className="text-xs font-semibold text-cyan-300 tracking-[0.2em] uppercase">
            Platform Active — v2.0
          </span>
        </motion.div>

        {/* 🔥 TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]"
        >
          <span className="block text-white drop-shadow-[0_0_40px_rgba(34,211,238,0.15)]">
            Build & Sell
          </span>
          <span className="block hero-title-gradient mt-1">
            Premium Code
          </span>
          <span className="block text-3xl md:text-4xl lg:text-5xl mt-3 text-white/60 font-medium">
            🚀
          </span>
        </motion.h1>

        {/* ✨ TYPING SUBTEXT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            High-quality AI tools, SaaS templates, and developer products ready to use.
          </p>

          {/* Typing animation line */}
          <div className="flex items-center justify-center gap-2 h-8">
            <span className="text-cyan-400/60 text-sm font-mono tracking-wider">{">"}</span>
            <span className="text-cyan-300 text-sm md:text-base font-mono tracking-wide">
              {typedText}
            </span>
            <motion.span
              className="w-[2px] h-5 bg-cyan-400 inline-block"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* 🎯 BUTTONS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <MagneticButton className="hero-cta-primary">
            <Link href="/products" className="flex items-center gap-3">
              <span>Explore Products</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </MagneticButton>

          <Link href="/dashboard" className="hero-cta-secondary group">
            <span className="hero-cta-secondary-glow" />
            <span className="relative z-10 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-60"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </span>
          </Link>
        </motion.div>

        {/* Trust micro-copy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-6 pt-4"
        >
          {[
            { icon: "⚡", label: "Instant Download" },
            { icon: "🔒", label: "Secure Payment" },
            { icon: "♾️", label: "Lifetime Access" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-slate-500 tracking-wider uppercase"
            >
              <span className="text-sm">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── SCROLL INDICATOR ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-slate-600 tracking-[0.3em] uppercase font-medium">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-slate-700/60 flex items-start justify-center p-1.5">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-cyan-400/80"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}