// app/privacy/page.tsx  (or pages/privacy.tsx)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  const sections = [
    {
      num: "01",
      title: "Information We Collect",
      content: (
        <ul className="flex flex-col gap-3 mt-1">
          {["Email address", "Purchase history", "Support messages"].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-300"
            >
              <span className="mt-[3px] text-[11px] text-cyan-400 drop-shadow-[0_0_6px_#00f5ff] flex-shrink-0">
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      num: "02",
      title: "How We Use Data",
      content: (
        <ul className="flex flex-col gap-3 mt-1">
          {["Provide product access", "Customer support", "Improve services"].map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[15px] leading-relaxed text-slate-300"
            >
              <span className="mt-[3px] text-[11px] text-cyan-400 drop-shadow-[0_0_6px_#00f5ff] flex-shrink-0">
                ▸
              </span>
              {item}
            </li>
          ))}
        </ul>
      ),
    },
    {
      num: "03",
      title: "Data Security",
      content: (
        <p className="text-[15px] leading-[1.75] text-slate-300">
          We use secure systems and encrypted infrastructure to ensure your data is protected
          at every layer — both at rest and in transit.
        </p>
      ),
    },
    {
      num: "04",
      title: "Third Parties",
      content: (
        <>
          <p className="text-[15px] leading-[1.75] text-slate-300">
            Payments are handled via Razorpay. We do not store card details or any sensitive
            financial information on our servers.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-3 py-2 rounded-sm border border-blue-500/30 bg-blue-900/10 font-mono text-[11px] tracking-wide text-blue-400">
            <span>🔒</span> PCI-DSS Compliant · Razorpay Secured
          </div>
        </>
      ),
    },
    {
      num: "05",
      title: "Contact",
      content: (
        <>
          <p className="text-[15px] leading-[1.75] text-slate-300">
            Have questions about your data or this policy? Reach out directly.
          </p>

          {/* 🔥 FIXED ANCHOR */}
          <a
            href="mailto:devastra093@gmail.com"
            className="inline-flex items-center gap-3 mt-4 px-5 py-3 rounded-sm border border-cyan-500/20 bg-cyan-400/5 font-mono text-[13px] tracking-wide text-cyan-400 transition-all duration-200 hover:bg-cyan-400/10 hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(0,245,255,0.15)]"
          >
            <span>✉</span> devastra093@gmail.com
          </a>
        </>
      ),
    },
  ];
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600&display=swap');

        .privacy-page {
          background-color: #020810;
          background-image:
            linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .privacy-page::after {
          content: '';
          position: fixed; inset: 0; z-index: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px
          );
          pointer-events: none;
        }
        .blob {
          position: fixed; border-radius: 50%;
          filter: blur(90px); pointer-events: none; z-index: 0;
        }
        .card-glow::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,245,255,0.5), transparent);
          opacity: 0; transition: opacity 0.3s ease;
        }
        .card-glow:hover::before { opacity: 1; }
        .card-glow:hover {
          border-color: rgba(0,245,255,0.35) !important;
          box-shadow: 0 0 24px rgba(0,245,255,0.06), inset 0 0 24px rgba(0,245,255,0.02);
        }
        .h1-glow {
          text-shadow: 0 0 30px rgba(0,245,255,0.3), 0 0 60px rgba(0,128,255,0.15);
          font-family: 'Orbitron', monospace;
        }
        .font-orbitron { font-family: 'Orbitron', monospace; }
        .font-mono-tech { font-family: 'Share Tech Mono', monospace; }
        .font-rajdhani { font-family: 'Rajdhani', sans-serif; }
        .tagline-line::before {
          content: '';
          display: block; width: 32px; height: 1px;
          background: #00f5ff;
          box-shadow: 0 0 8px #00f5ff;
          flex-shrink: 0;
        }
        .pulse-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #00f5ff;
          box-shadow: 0 0 6px #00f5ff;
          animation: pulse-anim 2s ease infinite;
          flex-shrink: 0;
        }
        @keyframes pulse-anim {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.8); }
        }
        .section-fade {
          opacity: 0; transform: translateY(20px);
          animation: fadeUp 0.6s ease forwards;
        }
        .section-fade:nth-child(1) { animation-delay: 0.3s; }
        .section-fade:nth-child(2) { animation-delay: 0.45s; }
        .section-fade:nth-child(3) { animation-delay: 0.6s; }
        .section-fade:nth-child(4) { animation-delay: 0.75s; }
        .section-fade:nth-child(5) { animation-delay: 0.9s; }
        @keyframes fadeUp {
          to { opacity:1; transform:translateY(0); }
        }
        .header-fade {
          opacity: 0; transform: translateY(-16px);
          animation: fadeDown 0.7s ease forwards 0.1s;
        }
        @keyframes fadeDown {
          to { opacity:1; transform:translateY(0); }
        }
      `}</style>

      <main
        className="privacy-page font-rajdhani relative min-h-screen"
        style={{ color: "#a8d8e8" }}
      >
        {/* Ambient blobs */}
        <div className="blob" style={{ width: 420, height: 420, background: "rgba(0,128,255,0.07)", top: -100, left: -100 }} />
        <div className="blob" style={{ width: 350, height: 350, background: "rgba(0,245,255,0.05)", bottom: "10%", right: -80 }} />
        <div className="blob" style={{ width: 280, height: 280, background: "rgba(0,80,200,0.06)", top: "50%", left: "40%" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 pb-24">

          {/* ── Header ── */}
          <header className="header-fade mb-16">
            <div
              className="tagline-line flex items-center gap-3 mb-4 font-mono-tech text-cyan-400 uppercase tracking-[4px]"
              style={{ fontSize: 11 }}
            >
              System Document
            </div>

            <h1 className="h1-glow text-white uppercase tracking-wider leading-tight" style={{ fontSize: "clamp(28px,5vw,46px)", fontWeight: 900 }}>
              Privacy <span className="text-cyan-400">Policy</span>
            </h1>

            <p className="mt-3 text-[15px] leading-relaxed font-medium tracking-wide max-w-md" style={{ color: "#4a7a8a" }}>
              We respect your privacy and are committed to protecting your personal data with
              enterprise-grade security protocols.
            </p>

            <div
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 border font-mono-tech tracking-widest rounded-sm"
              style={{ border: "1px solid rgba(0,245,255,0.15)", background: "rgba(0,245,255,0.03)", fontSize: 11, color: "#00c8d4" }}
            >
              <span className="pulse-dot" />
              Last Updated: 2025 · Version 2.1
            </div>
          </header>

          {/* ── Sections ── */}
          <div className="flex flex-col gap-5">
            {sections.map(({ num, title, content }) => (
              <div key={num} className="section-fade">
                <div
                  className="card-glow relative rounded-sm transition-all duration-300"
                  style={{
                    border: "1px solid rgba(0,245,255,0.12)",
                    background: "linear-gradient(135deg, rgba(0,245,255,0.03) 0%, rgba(0,40,80,0.2) 100%)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div className="px-8 py-7">
                    <span
                      className="block font-mono-tech uppercase tracking-[3px] mb-2"
                      style={{ fontSize: 10, color: "rgba(0,245,255,0.7)" }}
                    >
                      Section {num} / 05
                    </span>

                    <h2
                      className="font-orbitron text-white uppercase tracking-widest mb-5 flex items-center gap-4"
                      style={{ fontSize: 13, fontWeight: 700 }}
                    >
                      {title}
                      <span
                        className="flex-1 h-px"
                        style={{ background: "linear-gradient(90deg, rgba(0,245,255,0.15), transparent)" }}
                      />
                    </h2>

                    {content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Footer ── */}
          <footer
            className="mt-16 pt-7 text-center font-mono-tech tracking-wide"
            style={{ borderTop: "1px solid rgba(0,245,255,0.12)", fontSize: 12, color: "#4a7a8a" }}
          >
            <p>
              © 2025 <span className="text-cyan-400">DevAstra</span> · All rights reserved ·
              Privacy Protocol v2.1
            </p>
          </footer>

        </div>
      </main>
    </>
  );
}