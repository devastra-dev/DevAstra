"use client";

import { useState } from "react";

export function DemoVideo({ url }: { url: string }) {
  const [play, setPlay] = useState(false);

  if (!url) return null;

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10">

      {!play && (
        <div
          onClick={() => setPlay(true)}
          className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-cyan-500 flex items-center justify-center text-black text-xl shadow-lg">
            ▶
          </div>
        </div>
      )}

      <iframe
        src={url}
        className="w-full h-[280px]"
        allowFullScreen
      />
    </div>
  );
}