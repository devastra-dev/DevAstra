"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!email || !message) {
      setError("All fields are required");
      return;
    }

    if (message.length < 10) {
      setError("Message must be at least 10 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, message })
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTicketId(data.ticketId || null);

        setEmail("");
        setMessage("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-cyan-500/20 blur-[150px] rounded-full top-[-150px] left-1/3 animate-pulse" />
        <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[150px] rounded-full bottom-[-150px] right-10 animate-pulse" />
      </div>

      {/* 🔥 CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl p-8 space-y-6 backdrop-blur-xl shadow-2xl"
      >
        {/* HEADER */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-white">
            Need Help?
          </h1>
          <p className="text-slate-400 text-sm">
            Fast support • Usually replies within hours
          </p>
        </div>

        {/* ========================= */}
        {/* ✅ SUCCESS STATE */}
        {/* ========================= */}
        {success ? (
          <div className="text-center space-y-4">
            <div className="text-green-400 text-lg font-semibold">
              ✅ Request Sent Successfully
            </div>

            {ticketId && (
              <div className="text-sm text-slate-300">
                Ticket ID:
                <span className="ml-2 text-cyan-400 font-mono">
                  {ticketId}
                </span>
              </div>
            )}

            <p className="text-xs text-slate-500">
              Save this ID for future reference
            </p>

            <button
              onClick={() => setSuccess(false)}
              className="px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition"
            >
              Send Another Request
            </button>
          </div>
        ) : (
          <>
            {/* INPUTS */}
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
              />

              <textarea
                placeholder="Describe your issue..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-lg bg-black/40 border border-white/10 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* ❌ ERROR */}
            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {/* EXTRA TRUST */}
            <div className="text-center text-xs text-slate-500 space-y-1">
              <p>🔒 Your message is secure & private</p>
              <p>⚡ Priority support for customers</p>
            </div>
          </>
        )}

        {/* 🔥 WHATSAPP CTA */}
        <a
          href="https://wa.me/919339016057"
          target="_blank"
          className="block text-center text-sm text-green-400 hover:text-green-300 transition"
        >
          💬 Need faster reply? Chat on WhatsApp →
        </a>
      </motion.div>
    </main>
  );
}