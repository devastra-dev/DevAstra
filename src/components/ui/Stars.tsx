"use client";

export function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-1 text-yellow-400 text-sm">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>
          {i < Math.round(value) ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
}