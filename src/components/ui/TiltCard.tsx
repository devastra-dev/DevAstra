"use client";

import { useRef } from "react";

export function TiltCard({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rx = -(y - rect.height / 2) / 20;
    const ry = (x - rect.width / 2) / 20;

    ref.current!.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
  };

  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "rotateX(0) rotateY(0) scale(1)";
    }
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`transition-transform duration-300 will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}