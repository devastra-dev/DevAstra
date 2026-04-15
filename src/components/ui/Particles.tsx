"use client";

import { useEffect, useState } from "react";

type Particle = {
  top: string;
  left: string;
  duration: string;
};

export function Particles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // 🔥 generate only on client (fix hydration)
    const generated = Array.from({ length: 20 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: `${2 + Math.random() * 3}s`
    }));

    setParticles(generated);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute block w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse"
          style={{
            top: p.top,
            left: p.left,
            animationDuration: p.duration
          }}
        />
      ))}
    </div>
  );
}