"use client";

import { useState } from "react";
import type { User } from "firebase/auth";

export function SecureDownloadButton({
  user,
  productId
}: {
  user: User;
  productId: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setError(null);
    setLoading(true);

    try {
      const idToken = await user.getIdToken();

      const res = await fetch(`/api/download/${productId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });

      if (!res.ok) {
        setError("Download failed");
        return;
      }

      const data = await res.json();

      if (!data.url) {
        setError("No download link");
        return;
      }

      // 🔥 FINAL FIX
      window.open(data.url, "_blank");

    } catch (e) {
      console.error(e);
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleDownload}
        disabled={loading}
        className="rounded-full border border-cyan-500/60 px-3 py-1 text-xs"
      >
        {loading ? "Opening..." : "Download"}
      </button>

      {error && (
        <span className="text-red-400 text-xs">{error}</span>
      )}
    </div>
  );
}