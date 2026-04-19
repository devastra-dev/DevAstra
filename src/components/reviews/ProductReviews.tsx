"use client";

import { useEffect, useState } from "react";
import { getReviewsWithStats, type Review } from "@/lib/reviews-client";
import { useAuth } from "@/components/auth/AuthContext";
import { motion } from "framer-motion";

// ⭐ STAR COMPONENT
function StarRating({
  value,
  onChange,
  readonly = false
}: {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
}) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < value;
        return (
          <button
            key={i}
            disabled={readonly}
            onClick={() => !readonly && onChange?.(i + 1)}
            className={`text-xl transition ${
              active ? "text-yellow-400" : "text-slate-600"
            } ${!readonly ? "hover:text-yellow-300 hover:scale-110" : ""}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

// 👤 AVATAR
function UserAvatar({ email }: { email: string }) {
  const initial = email?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
      {initial}
    </div>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [avg, setAvg] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 SORT STATE (NEW)
  const [sort, setSort] = useState<"latest" | "highest">("latest");

  // 🔥 LOAD
  const load = async () => {
    try {
      setError(null);
      const data = await getReviewsWithStats(productId);

      const sorted = [...data.reviews];

      if (sort === "highest") {
        sorted.sort((a, b) => b.rating - a.rating);
      }

      setReviews(sorted);
      setAvg(data.avg);
      setTotal(data.total);
    } catch (err) {
      console.error("❌ Review load failed:", err);
      setError("Unable to load reviews");
    }
  };

  useEffect(() => {
    load(); // eslint-disable-line react-hooks/exhaustive-deps
  }, [productId, sort]);

  const formatDate = (value: unknown) => {
    try {
      const date = new Date(value as any);
      return date.toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    if (!user) return alert("Login required");

    if (!comment.trim()) {
      alert("Write something");
      return;
    }

    setLoading(true);

    try {
      const token = await user.getIdToken();

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, rating, comment })
      });

      if (res.ok) {
        setComment("");
        setRating(5);
        await load();
      } else {
        alert("Failed to submit review");
      }
    } catch {
      alert("Error submitting review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 mt-12"
    >
      {/* 🔥 HEADER */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Customer Reviews
          </h2>

          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <StarRating value={Math.round(avg)} readonly />
              <span className="text-cyan-400 font-semibold">
                {avg.toFixed(1)}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {total} review{total !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* 🔥 SORT (NEW) */}
        <div className="flex justify-end">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
            className="bg-black/40 border border-white/10 text-sm px-3 py-1 rounded text-slate-300"
          >
            <option value="latest">Latest</option>
            <option value="highest">Highest Rated</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* 🔥 FORM */}
      {user && (
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Write a Review
          </h3>

          <StarRating value={rating} onChange={setRating} />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:outline-none"
            rows={4}
            placeholder="Share your experience..."
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-gradient px-6 py-2 rounded-lg transition hover:scale-105"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* 🔥 LIST */}
      <div className="space-y-4">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 p-5 rounded-xl hover:scale-[1.01] transition"
          >
            <div className="flex gap-4">
              <UserAvatar email={review.userEmail} />

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <StarRating value={review.rating} readonly />
                  <span className="text-xs text-slate-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                {/* 🔥 VERIFIED */}
                <p className="text-xs text-green-400">
                  ✔ Verified Purchase
                </p>

                <p className="text-slate-300 text-sm">
                  {review.comment}
                </p>
              </div>
            </div>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="text-center p-6 border border-white/10 rounded-xl text-slate-400">
            No reviews yet — be the first!
          </div>
        )}
      </div>
    </motion.div>
  );
}