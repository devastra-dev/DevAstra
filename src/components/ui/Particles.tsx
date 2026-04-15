"use client";

import { useEffect, useMemo, useState } from "react";

type Particle = {
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
};

export function Particles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔥 generate once (no re-renders)
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 30 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 2
    }));
  }, []);

  // 🔐 prevent SSR mismatch
  if (!mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-cyan-400"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
            filter: "blur(1px)"
          }}
        />
      ))}

      {/* 🔥 custom animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </div>
  );
}