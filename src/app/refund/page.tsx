// app/refund/page.tsx  (or pages/refund.tsx)
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Our refund terms for digital products.",
};

export default function RefundPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;500;600&display=swap');

        .refund-page {
          background-color: #020810;
          background-image:
            linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }
        .refund-page::after {
          content: ''; position: fixed; inset: 0; z-index: 0;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px);
          pointer-events: none;
        }
        .r-blob { position:fixed; border-radius:50%; filter:blur(90px); pointer-events:none; z-index:0; }

        /* Fonts */
        .font-orbitron { font-family:'Orbitron',monospace; }
        .font-mono-tech { font-family:'Share Tech Mono',monospace; }

        /* Header */
        .r-header { opacity:0; transform:translateY(-18px); animation:r-fadeDown 0.7s ease forwards 0.1s; }
        .r-tagline::before { content:''; width:32px; height:1px; background:#00f5ff; box-shadow:0 0 8px #00f5ff; }
        .r-h1-glow {
          font-family:'Orbitron',monospace; font-weight:900; text-transform:uppercase;
          letter-spacing:2px; line-height:1.1;
          text-shadow:0 0 30px rgba(0,245,255,0.3),0 0 60px rgba(0,128,255,0.15);
        }
        .pulse-dot { width:6px; height:6px; border-radius:50%; background:#00f5ff; box-shadow:0 0 6px #00f5ff; animation:r-pulse 2s ease infinite; }

        /* Alert */
        .r-alert {
          opacity:0; transform:translateX(-10px);
          animation:r-slideIn 0.6s ease forwards 0.4s;
        }

        /* Cards */
        .r-card { border-radius:4px; overflow:hidden; position:relative; transition:border-color 0.3s,box-shadow 0.3s; }
        .r-card::before {
          content:''; position:absolute; top:0; left:0; right:0; height:1px;
          opacity:0; transition:opacity 0.3s;
        }
        .r-card:hover::before { opacity:1; }

        .r-card-base {
          border:1px solid rgba(0,245,255,0.13);
          background:linear-gradient(135deg,rgba(0,245,255,0.03) 0%,rgba(0,40,80,0.18) 100%);
        }
        .r-card-base::before { background:linear-gradient(90deg,transparent,rgba(0,245,255,0.5),transparent); }
        .r-card-base:hover { border-color:rgba(0,245,255,0.38); box-shadow:0 0 24px rgba(0,245,255,0.05); }

        .r-card-warn {
          border:1px solid rgba(255,68,85,0.2);
          background:linear-gradient(135deg,rgba(255,68,85,0.04) 0%,rgba(0,40,80,0.18) 100%);
          border-left:3px solid #ff4455;
        }
        .r-card-warn::before { background:linear-gradient(90deg,transparent,rgba(255,68,85,0.6),transparent); }
        .r-card-warn:hover { border-color:rgba(255,68,85,0.4); box-shadow:0 0 24px rgba(255,68,85,0.06); }

        .r-card-ok {
          border:1px solid rgba(0,245,100,0.18);
          background:linear-gradient(135deg,rgba(0,245,100,0.03) 0%,rgba(0,40,80,0.18) 100%);
          border-left:3px solid #00f564;
        }
        .r-card-ok::before { background:linear-gradient(90deg,transparent,rgba(0,245,100,0.5),transparent); }
        .r-card-ok:hover { border-color:rgba(0,245,100,0.38); box-shadow:0 0 24px rgba(0,245,100,0.05); }

        /* Section fade in */
        .r-section { opacity:0; transform:translateY(22px); transition:opacity 0.55s ease,transform 0.55s ease; }
        .r-section.visible { opacity:1; transform:translateY(0); }

        /* Timeline */
        .r-timeline { display:flex; }
        .r-tstep {
          flex:1; text-align:center; padding:14px 8px 10px;
          border:1px solid rgba(0,245,255,0.13); background:rgba(0,245,255,0.02);
          font-family:'Share Tech Mono',monospace; font-size:11px; color:#4a7a8a;
          letter-spacing:1px; transition:border-color 0.2s,color 0.2s;
        }
        .r-tstep:not(:last-child) { border-right:none; }
        .r-tstep:hover { border-color:rgba(255,68,85,0.3); color:#ff8899; }
        .r-tstep-num { font-size:16px; font-weight:700; color:#ff4455; display:block; margin-bottom:5px; font-family:'Orbitron',monospace; }

        /* Contact link */
        .r-contact-link {
          display:inline-flex; align-items:center; gap:10px;
          padding:12px 20px; border:1px solid rgba(0,245,255,0.2); background:rgba(0,245,255,0.04);
          border-radius:3px; font-family:'Share Tech Mono',monospace; font-size:13px;
          color:#00f5ff; text-decoration:none; letter-spacing:1px;
          transition:all 0.25s ease;
        }
        .r-contact-link:hover { background:rgba(0,245,255,0.10); border-color:#00f5ff; box-shadow:0 0 16px rgba(0,245,255,0.15); }

        /* Footer */
        .r-footer { opacity:0; animation:r-fadeUp 0.6s ease forwards 1.3s; }

        @keyframes r-fadeDown { to { opacity:1; transform:translateY(0); } }
        @keyframes r-fadeUp   { to { opacity:1; } }
        @keyframes r-slideIn  { to { opacity:1; transform:translateX(0); } }
        @keyframes r-pulse    { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.8);} }
      `}</style>

      <main className="refund-page font-['Rajdhani',sans-serif] relative min-h-screen" style={{ color: "#a8d8e8" }}>

        {/* Ambient blobs */}
        <div className="r-blob" style={{ width: 420, height: 420, background: "rgba(255,68,85,0.05)", top: -80, right: -100 }} />
        <div className="r-blob" style={{ width: 350, height: 350, background: "rgba(0,128,255,0.06)", bottom: "15%", left: -80 }} />
        <div className="r-blob" style={{ width: 280, height: 280, background: "rgba(0,245,255,0.04)", top: "55%", right: "30%" }} />

        <div className="relative z-10 max-w-3xl mx-auto px-6 py-16 pb-24">

          {/* ── Header ── */}
          <header className="r-header mb-14">
            <div
              className="r-tagline font-mono-tech flex items-center gap-3 mb-4 text-cyan-400 uppercase"
              style={{ fontSize: 11, letterSpacing: "4px" }}
            >
              Legal Document
            </div>
            <h1
              className="r-h1-glow text-white"
              style={{ fontSize: "clamp(28px,5vw,46px)" }}
            >
              Refund{" "}
              <span style={{ color: "#ff4455", textShadow: "0 0 24px rgba(255,68,85,0.4)" }}>
                Policy
              </span>
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed font-medium max-w-md" style={{ color: "#4a7a8a", letterSpacing: "0.5px" }}>
              Due to the nature of digital products, all sales are final. Please review
              our policy carefully before purchase.
            </p>
            <div
              className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-sm font-mono-tech"
              style={{ border: "1px solid rgba(0,245,255,0.13)", background: "rgba(0,245,255,0.03)", fontSize: 11, color: "#00c8d4", letterSpacing: "1.5px" }}
            >
              <span className="pulse-dot" />
              Last Updated: {new Date().getFullYear()} · Version 1.4
            </div>
          </header>

          {/* ── Alert Banner ── */}
          <div
            className="r-alert flex items-start gap-4 mb-6 rounded-sm"
            style={{
              padding: "18px 24px",
              border: "1px solid rgba(255,68,85,0.3)",
              borderLeft: "3px solid #ff4455",
              background: "linear-gradient(90deg, rgba(255,68,85,0.07), rgba(255,68,85,0.02))",
            }}
          >
            <span style={{ fontSize: 18, filter: "drop-shadow(0 0 6px #ff4455)", flexShrink: 0, marginTop: 1 }}>⚠</span>
            <div>
              <strong
                className="font-orbitron block mb-1"
                style={{ fontSize: 12, letterSpacing: "1px", color: "#ff4455" }}
              >
                No Refund Policy Active
              </strong>
              <p className="text-[15px] leading-relaxed" style={{ color: "#ffb3ba" }}>
                Once a product is downloaded or accessed, we do not offer refunds. All digital
                sales are considered final upon delivery.
              </p>
            </div>
          </div>

          {/* ── Sections ── */}
          <div className="flex flex-col gap-5" id="r-sections">

            {/* Section 1 – No Refund */}
            <div className="r-section">
              <div className="r-card r-card-warn">
                <div className="px-8 py-7">
                  <span className="font-mono-tech block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>
                    Section 01 / 03
                  </span>
                  <h2
                    className="font-orbitron uppercase flex items-center gap-4 mb-5"
                    style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px", color: "#ff4455", textShadow: "0 0 12px rgba(255,68,85,0.3)" }}
                  >
                    No Refund
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(255,68,85,0.2),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]" style={{ color: "#a8d8e8" }}>
                    Once a product is downloaded or accessed, we do not offer refunds. Digital
                    products are non-returnable by nature — access constitutes delivery.
                  </p>
                  <div className="r-timeline mt-5">
                    {["Refund after download", "Refund after access granted", "Change of mind"].map((label) => (
                      <div key={label} className="r-tstep">
                        <span className="r-tstep-num">✕</span>
                        <span style={{ fontSize: 10 }}>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 – Exceptions */}
            <div className="r-section">
              <div className="r-card r-card-ok">
                <div className="px-8 py-7">
                  <span className="font-mono-tech block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>
                    Section 02 / 03
                  </span>
                  <h2
                    className="font-orbitron uppercase flex items-center gap-4 mb-5"
                    style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px", color: "#00f564", textShadow: "0 0 12px rgba(0,245,100,0.3)" }}
                  >
                    Exceptions
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(0,245,100,0.2),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75] mb-4" style={{ color: "#a8d8e8" }}>
                    Refunds may be considered <em>only</em> in the following verified edge cases:
                  </p>
                  <ul className="flex flex-col gap-3">
                    {["Product is not delivered", "Payment deducted but access not given"].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed" style={{ color: "#a8d8e8" }}>
                        <span
                          className="flex-shrink-0 mt-[6px] w-[7px] h-[7px] rounded-full"
                          style={{ background: "#00f564", boxShadow: "0 0 8px #00f564" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 – Contact */}
            <div className="r-section">
              <div className="r-card r-card-base">
                <div className="px-8 py-7">
                  <span className="font-mono-tech block uppercase mb-2" style={{ fontSize: 10, color: "rgba(0,245,255,0.7)", letterSpacing: "3px" }}>
                    Section 03 / 03
                  </span>
                  <h2
                    className="font-orbitron uppercase text-white flex items-center gap-4 mb-5"
                    style={{ fontSize: 13, fontWeight: 700, letterSpacing: "2px" }}
                  >
                    Contact
                    <span className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(0,245,255,0.15),transparent)" }} />
                  </h2>
                  <p className="text-[15px] leading-[1.75]" style={{ color: "#a8d8e8" }}>
                    For refund requests under the above exceptions, contact support within{" "}
                    <strong style={{ color: "#ffaa00" }}>24 hours</strong> of purchase. Requests
                    beyond this window will not be entertained.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <a href="mailto:devastra093@gmail.com" className="r-contact-link">
                      <span>✉</span> devastra093@gmail.com
                    </a>
                    <div
                      className="inline-flex items-center gap-2 px-4 py-3 rounded-sm font-mono-tech"
                      style={{ border: "1px solid rgba(255,170,0,0.3)", background: "rgba(255,170,0,0.07)", fontSize: 11, color: "#ffaa00", letterSpacing: "1px" }}
                    >
                      <span>⏱</span> 24-HR WINDOW
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── Footer ── */}
          <footer
            className="r-footer mt-14 pt-7 text-center font-mono-tech"
            style={{ borderTop: "1px solid rgba(0,245,255,0.12)", fontSize: 12, color: "#4a7a8a", letterSpacing: "1px" }}
          >
            <p>
              © 2025 <span style={{ color: "#00f5ff" }}>DevAstra</span> · All rights reserved ·
              Refund Protocol v1.4
            </p>
          </footer>

        </div>

        {/* Scroll-based section reveal */}
        <Script id="refund-anim" strategy="afterInteractive">
          {`
            (function() {
              if (window.__refundAnimLoaded) return;
              window.__refundAnimLoaded = true;
              
              const obs = new IntersectionObserver(entries => {
                entries.forEach((e, i) => {
                  if (e.isIntersecting) {
                    setTimeout(() => e.target.classList.add('visible'), i * 90);
                    obs.unobserve(e.target);
                  }
                });
              }, { threshold: 0.08 });
              document.querySelectorAll('.r-section').forEach(s => obs.observe(s));
            })();
          `}
        </Script>
      </main>
    </>
  );
}