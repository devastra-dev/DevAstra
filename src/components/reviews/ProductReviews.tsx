// components/product/ProductReviews.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { getReviewsWithStats, type Review } from "@/lib/reviews-client";
import { useAuth } from "@/components/auth/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

/* ════════════════════════════════════════════
   STAR RATING
════════════════════════════════════════════ */
function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: {
  value: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "lg" ? 22 : size === "sm" ? 14 : 18;

  return (
    <div className="flex gap-1" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: 5 }).map((_, i) => {
        const active = i < (hovered || value);
        return (
          <button
            key={i}
            type="button"
            disabled={readonly}
            onClick={() => !readonly && onChange?.(i + 1)}
            onMouseEnter={() => !readonly && setHovered(i + 1)}
            style={{
              fontSize: sz,
              background: "none",
              border: "none",
              padding: 0,
              cursor: readonly ? "default" : "pointer",
              color: active ? "#ffcc44" : "rgba(255,204,68,0.18)",
              textShadow: active ? "0 0 8px rgba(255,204,68,0.5)" : "none",
              transition: "color .15s, transform .15s, text-shadow .15s",
              transform: !readonly && hovered === i + 1 ? "scale(1.3)" : "scale(1)",
              lineHeight: 1,
            }}
            aria-label={`${i + 1} star`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   AVATAR
════════════════════════════════════════════ */
const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,rgba(0,245,255,0.45),rgba(157,111,255,0.55))",
  "linear-gradient(135deg,rgba(255,204,68,0.45),rgba(255,100,0,0.5))",
  "linear-gradient(135deg,rgba(157,111,255,0.45),rgba(0,80,200,0.5))",
  "linear-gradient(135deg,rgba(0,245,100,0.45),rgba(0,150,80,0.5))",
  "linear-gradient(135deg,rgba(255,68,85,0.45),rgba(150,0,80,0.5))",
];

function UserAvatar({ email }: { email: string }) {
  const initial = email?.charAt(0)?.toUpperCase() || "?";
  const idx     = email.charCodeAt(0) % AVATAR_GRADIENTS.length;

  return (
    <div
      style={{
        width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
        background: AVATAR_GRADIENTS[idx],
        border: "2px solid rgba(0,245,255,0.2)",
        boxShadow: "0 0 12px rgba(0,245,255,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Orbitron',monospace", fontSize: 14, fontWeight: 700,
        color: "#fff", textShadow: "0 0 8px rgba(0,0,0,0.5)",
      }}
    >
      {initial}
    </div>
  );
}

/* ════════════════════════════════════════════
   RATING BREAKDOWN BARS
════════════════════════════════════════════ */
function RatingBars({ reviews }: { reviews: Review[] }) {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const max = reviews.length || 1;

  return (
    <div className="flex flex-col gap-[5px]">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-3">
          <span
            style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
              color: "#4a7a8a", width: 10, textAlign: "right", flexShrink: 0,
            }}
          >
            {star}
          </span>
          <div
            style={{
              flex: 1, height: 4, borderRadius: 2,
              background: "rgba(0,245,255,0.07)", overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(count / max) * 100}%` }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              style={{
                height: "100%", borderRadius: 2,
                background: "linear-gradient(90deg,#00f5ff,#ffcc44)",
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
              color: "#4a7a8a", width: 16, flexShrink: 0,
            }}
          >
            {count}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   CARD WRAPPER
════════════════════════════════════════════ */
function PanelCard({
  children,
  accent = "cyan",
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  accent?: "cyan" | "gold" | "green" | "red";
  className?: string;
  style?: React.CSSProperties;
}) {
  const colors: Record<string, string> = {
    cyan:  "rgba(0,245,255,0.4)",
    gold:  "rgba(255,204,68,0.4)",
    green: "rgba(0,245,100,0.4)",
    red:   "rgba(255,68,85,0.4)",
  };
  const leftBorder: Record<string, string> = {
    cyan:  "#00f5ff",
    gold:  "#ffcc44",
    green: "#00f564",
    red:   "#ff4455",
  };

  return (
    <div
      className={className}
      style={{
        border: `1px solid rgba(0,245,255,0.12)`,
        borderLeft: `3px solid ${leftBorder[accent]}`,
        borderRadius: 4,
        background: "linear-gradient(135deg,rgba(0,245,255,0.03),rgba(0,40,80,0.18))",
        backdropFilter: "blur(8px)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color .3s, box-shadow .3s",
        ...style,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(0,245,255,0.35)`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 24px rgba(0,245,255,0.05)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(0,245,255,0.12)`;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Top shimmer */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg,transparent,${colors[accent]},transparent)`,
          opacity: 0.6,
        }}
      />
      {children}
    </div>
  );
}

/* ════════════════════════════════════════════
   SORT CHIP
════════════════════════════════════════════ */
function SortChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: 999,
        border: active ? "1px solid rgba(0,245,255,0.45)" : "1px solid rgba(0,245,255,0.12)",
        background: active ? "rgba(0,245,255,0.08)" : "transparent",
        fontFamily: "'Share Tech Mono',monospace",
        fontSize: 10, letterSpacing: "1px", textTransform: "uppercase",
        color: active ? "#00f5ff" : "#4a7a8a",
        cursor: "pointer", transition: "all .2s",
      }}
    >
      {label}
    </button>
  );
}

/* ════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════ */
export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();

  const [reviews,    setReviews]    = useState<Review[]>([]);
  const [rating,     setRating]     = useState(5);
  const [comment,    setComment]    = useState("");
  const [avg,        setAvg]        = useState(0);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);
  const [sort,       setSort]       = useState<"latest" | "highest">("latest");
  const [charCount,  setCharCount]  = useState(0);

  /* ── LOAD ── */
  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await getReviewsWithStats(productId);
      const sorted = [...data.reviews];
      if (sort === "highest") sorted.sort((a, b) => b.rating - a.rating);
      setReviews(sorted);
      setAvg(data.avg);
      setTotal(data.total);
    } catch (err) {
      console.error("❌ Review load failed:", err);
      setError("Unable to load reviews. Please try again.");
    }
  }, [productId, sort]);

  useEffect(() => { load(); }, [load]);

  /* ── FORMAT DATE ── */
  const formatDate = (value: unknown) => {
    try {
      return new Date(value as string).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      });
    } catch { return "Unknown"; }
  };

  /* ── SUBMIT ── */
  const handleSubmit = async () => {
    if (!user)          return alert("Login required");
    if (!comment.trim()) return alert("Write something first");

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ productId, rating, comment }),
      });

      if (res.ok) {
        setComment("");
        setRating(5);
        setCharCount(0);
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

  /* ────────────────────────────────────────
     STYLES (global, injected once)
  ──────────────────────────────────────── */
  return (
    <>
      <style>{`
        .rev-textarea {
          width: 100%; padding: 14px 16px; resize: vertical; min-height: 110px;
          background: rgba(0,10,20,0.5); border: 1px solid rgba(0,245,255,0.12);
          border-radius: 3px; color: #a8d8e8; outline: none;
          font-family: 'Rajdhani',sans-serif; font-size: 15px; font-weight: 400;
          transition: border-color .2s, box-shadow .2s;
        }
        .rev-textarea:focus {
          border-color: rgba(0,245,255,0.4);
          box-shadow: 0 0 12px rgba(0,245,255,0.07);
        }
        .rev-textarea::placeholder { color: #4a7a8a; }
        .rev-submit {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 26px; border-radius: 3px; cursor: pointer;
          border: 1px solid rgba(0,245,255,0.35);
          background: linear-gradient(135deg,rgba(0,245,255,0.12),rgba(0,245,255,0.06));
          font-family: 'Share Tech Mono',monospace; font-size: 12px;
          letter-spacing: 1.5px; text-transform: uppercase; color: #00f5ff;
          position: relative; overflow: hidden;
          transition: transform .25s, box-shadow .25s, border-color .25s;
        }
        .rev-submit::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(110deg,transparent 30%,rgba(255,255,255,0.07) 50%,transparent 70%);
          transform: translateX(-100%); transition: transform .5s;
        }
        .rev-submit:hover::before { transform: translateX(100%); }
        .rev-submit:hover { border-color: #00f5ff; box-shadow: 0 0 18px rgba(0,245,255,0.15); transform: translateY(-1px); }
        .rev-submit:active { transform: translateY(0) scale(.98); }
        .rev-submit:disabled { opacity: .5; cursor: not-allowed; transform: none; }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{ marginTop: 56 }}
      >

        {/* ══════════════════════════════
            HEADER CARD
        ══════════════════════════════ */}
        <PanelCard accent="cyan" style={{ marginBottom: 14 }}>
          <div style={{ padding: "24px 28px" }}>

            {/* Title + avg */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
              <div>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(0,245,255,0.6)", letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                  Product Feedback
                </span>
                <h2 style={{ fontFamily: "'Orbitron',monospace", fontSize: 15, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "1.5px", textShadow: "0 0 20px rgba(0,245,255,0.2)" }}>
                  Customer Reviews
                </h2>
                <div style={{ marginTop: 10 }}>
                  <StarRating value={Math.round(avg)} readonly size="md" />
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span style={{ fontFamily: "'Orbitron',monospace", fontSize: 26, fontWeight: 900, color: "#00f5ff", textShadow: "0 0 16px rgba(0,245,255,0.4)", display: "block", lineHeight: 1 }}>
                  {avg.toFixed(1)}
                </span>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#4a7a8a", letterSpacing: "1.5px", display: "block", marginTop: 5 }}>
                  {total} REVIEW{total !== 1 ? "S" : ""}
                </span>
              </div>
            </div>

            {/* Rating breakdown bars */}
            {reviews.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <RatingBars reviews={reviews} />
              </div>
            )}

            {/* Sort chips + total */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <SortChip label="Latest"  active={sort === "latest"}  onClick={() => setSort("latest")} />
                <SortChip label="Highest" active={sort === "highest"} onClick={() => setSort("highest")} />
              </div>
              <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#4a7a8a", letterSpacing: "1px" }}>
                {total} TOTAL
              </span>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 16px", marginTop: 14,
                    border: "1px solid rgba(255,68,85,0.3)",
                    borderLeft: "3px solid #ff4455",
                    background: "rgba(255,68,85,0.06)", borderRadius: 3,
                    fontFamily: "'Share Tech Mono',monospace", fontSize: 12,
                    color: "#ff8899", letterSpacing: "1px",
                  }}
                >
                  ⚠ &nbsp;{error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PanelCard>

        {/* ══════════════════════════════
            WRITE REVIEW FORM
        ══════════════════════════════ */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            style={{ marginBottom: 14 }}
          >
            <PanelCard accent="gold">
              <div style={{ padding: "24px 28px" }}>
                <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "rgba(0,245,255,0.6)", letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: 14 }}>
                  Write a Review
                </span>

                {/* Star picker */}
                <div style={{ marginBottom: 16 }}>
                  <StarRating value={rating} onChange={setRating} size="lg" />
                </div>

                {/* Textarea */}
                <div style={{ position: "relative" }}>
                  <textarea
                    className="rev-textarea"
                    value={comment}
                    onChange={(e) => { setComment(e.target.value); setCharCount(e.target.value.length); }}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    maxLength={600}
                  />
                  <span style={{
                    position: "absolute", bottom: 10, right: 14,
                    fontFamily: "'Share Tech Mono',monospace", fontSize: 10,
                    color: charCount > 550 ? "#ffcc44" : "#4a7a8a", letterSpacing: "1px",
                  }}>
                    {charCount}/600
                  </span>
                </div>

                {/* Submit row */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
                  <button
                    className="rev-submit"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? (
                      <>⟳ &nbsp;Submitting...</>
                    ) : (
                      <>⟶ &nbsp;Submit Review</>
                    )}
                  </button>
                </div>
              </div>
            </PanelCard>
          </motion.div>
        )}

        {/* ══════════════════════════════
            REVIEWS LIST
        ══════════════════════════════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <AnimatePresence mode="popLayout">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id || i}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              >
                <div
                  style={{
                    border: "1px solid rgba(0,245,255,0.10)",
                    borderRadius: 4, padding: "18px 22px",
                    background: "linear-gradient(135deg,rgba(0,245,255,0.02),rgba(0,40,80,0.14))",
                    backdropFilter: "blur(6px)", position: "relative", overflow: "hidden",
                    transition: "border-color .3s, box-shadow .3s, transform .25s",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(0,245,255,0.32)";
                    el.style.boxShadow   = "0 0 16px rgba(0,245,255,0.04)";
                    el.style.transform   = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(0,245,255,0.10)";
                    el.style.boxShadow   = "none";
                    el.style.transform   = "translateY(0)";
                  }}
                >
                  {/* Top shimmer */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,rgba(0,245,255,0.25),transparent)", opacity: 0.5 }} />

                  {/* Header row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <UserAvatar email={review.userEmail} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, color: "#c8e8f0", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {review.userEmail}
                      </p>
                      <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#4a7a8a", letterSpacing: "1px", marginTop: 2 }}>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Stars + verified */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <StarRating value={review.rating} readonly size="sm" />
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "'Share Tech Mono',monospace", fontSize: 10, color: "#00f564", letterSpacing: "1px" }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00f564", boxShadow: "0 0 5px #00f564", display: "inline-block" }} />
                      Verified Purchase
                    </span>
                  </div>

                  {/* Comment */}
                  <p style={{ fontSize: 15, lineHeight: 1.65, color: "#a8d8e8", fontFamily: "'Rajdhani',sans-serif" }}>
                    {review.comment}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {reviews.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: "center", padding: "44px 20px",
                border: "1px dashed rgba(0,245,255,0.12)", borderRadius: 4,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12, opacity: 0.35 }}>◎</div>
              <p style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: 12, color: "#4a7a8a", letterSpacing: "2px", textTransform: "uppercase" }}>
                No reviews yet — be the first!
              </p>
            </motion.div>
          )}
        </div>

      </motion.div>
    </>
  );
}