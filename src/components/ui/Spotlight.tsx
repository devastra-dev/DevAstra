"use client";

import { useState } from "react";

export function Spotlight({
  children
}: {
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }}
      className="relative overflow-hidden rounded-2xl"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(200px at ${pos.x}px ${pos.y}px, rgba(56,189,248,0.2), transparent 80%)`
        }}
      />

      {children}
    </div>
  );
}