import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

export default function LandingPage({ setPage }) {
  return (
    <div style={s.page}>

      {/* ── HERO ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "9rem 3rem 4rem", position: "relative",
      }}>
        <div style={{
          position: "absolute", right: "-10%", top: "5%",
          width: "65vw", height: "65vw",
          background: "radial-gradient(ellipse, rgba(232,196,178,0.45) 0%, rgba(143,175,136,0.12) 55%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: 640, position: "relative", zIndex: 1 }}>
          <p style={{
            fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase",
            color: colors.terracotta, marginBottom: "1.2rem",
          }}>
            AI-Powered Skincare Intelligence
          </p>
          <h1 style={{
            fontFamily: fonts.display, fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
            lineHeight: 1.06, letterSpacing: "-0.03em", marginBottom: "1.6rem",
          }}>
            Skin that <em style={{ fontStyle: "italic", color: colors.deepRose }}>knows</em> what it needs
          </h1>
          <p style={{
            fontSize: "1.05rem", lineHeight: 1.7, color: colors.mid,
            maxWidth: "46ch", marginBottom: "2.4rem",
          }}>
            Skintelligent decodes ingredients, detects hype, and builds personalized
            routines that actually work — for your skin, not everyone else's.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button style={s.btnPrimary} onClick={() => setPage("signup")}>Build your profile →</button>
            <button style={s.btnGhost} onClick={() => setPage("login")}>Sign in</button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: colors.warmWhite, padding: "6rem 3rem" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={s.sectionLabel}>Platform Features</p>
          <h2 style={{ ...s.sectionTitle, textAlign: "center" }}>
            Everything your skin <em style={s.sectionTitleEm}>deserves to know</em>
          </h2>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.5rem", maxWidth: 1200, margin: "0 auto",
        }}>
          {[
            { icon: "👤", title: "Personalized User Profile", desc: "Create your skin identity — type, concerns, and ingredient preferences." },
            { icon: "⚡", title: "Recommendation Engine", desc: "AI-powered matching that surfaces the right products from thousands of options." },
            { icon: "🔍", title: "Product Lookup & Fit Scoring", desc: "Look up any product and instantly get a personal fit score." },
            { icon: "💡", title: "Explainable Recommendations", desc: "Every recommendation comes with a clear breakdown of why it was chosen." },
            { icon: "💬", title: "Review Sentiment Analysis", desc: "Thousands of reviews distilled into actionable insight." },
            { icon: "📣", title: "Worth the Hype Detection", desc: "Find out if a viral product actually delivers or if it's just marketing." },
            { icon: "🧪", title: "Ingredient Level Analysis", desc: "Deep-dive into every ingredient — function, safety, and interaction." },
            { icon: "🗂️", title: "Saved Products & History", desc: "Bookmark products and track your recommendation history." },
          ].map((f, i) => (
            <div key={i} style={{
              ...s.card, transition: "transform 0.25s, box-shadow 0.25s",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                width: 46, height: 46, borderRadius: "14px",
                background: "rgba(196,120,88,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.3rem", marginBottom: "1.1rem",
              }}>{f.icon}</div>
              <div style={{
                fontFamily: fonts.display, fontSize: "1.05rem",
                color: colors.charcoal, marginBottom: "0.55rem",
              }}>{f.title}</div>
              <p style={{ fontSize: "0.82rem", color: colors.mid, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ textAlign: "center", padding: "6rem 3rem" }}>
        <p style={s.sectionLabel}>By the Numbers</p>
        <h2 style={{ ...s.sectionTitle, textAlign: "center" }}>
          Trusted by skin-curious people <em style={s.sectionTitleEm}>everywhere</em>
        </h2>
        <div style={{
          display: "flex", justifyContent: "center", gap: "5rem",
          marginTop: "3rem", flexWrap: "wrap",
        }}>
          {[
            { num: "50K+", label: "Products Analyzed" },
            { num: "1.2M", label: "Reviews Processed" },
            { num: "8K+", label: "Ingredients in Database" },
            { num: "97%", label: "Recommendation Accuracy" },
          ].map(stat => (
            <div key={stat.label}>
              <div style={{
                fontFamily: fonts.display, fontSize: "3rem",
                color: colors.deepRose, lineHeight: 1, marginBottom: "0.4rem",
              }}>{stat.num}</div>
              <div style={{
                fontSize: "0.82rem", color: colors.lightMid,
                letterSpacing: "0.06em", textTransform: "uppercase",
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: colors.charcoal, textAlign: "center",
        padding: "7rem 3rem", position: "relative", overflow: "hidden",
      }}>
        <h2 style={{
          ...s.sectionTitle, color: colors.cream,
          maxWidth: "16ch", margin: "0 auto 1.2rem",
        }}>
          Your skin deserves smarter <em style={{ color: colors.blush, fontStyle: "italic" }}>choices</em>
        </h2>
        <p style={{ ...s.sectionSub, color: "rgba(250,246,241,0.55)", margin: "0 auto 2.5rem" }}>
          Build your profile in minutes. Get your first personalized recommendation immediately — no credit card required.
        </p>
        <button style={s.btnLight} onClick={() => setPage("signup")}>Create your skin profile →</button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: colors.charcoal, borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "2.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ ...s.logo, color: colors.blush, fontSize: "1.1rem" }}>
          Skin<span style={{ color: colors.sage, fontStyle: "italic" }}>telligent</span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(250,246,241,0.35)", letterSpacing: "0.04em" }}>
          © 2025 Skintelligent. Intelligent skincare, demystified.
        </p>
      </footer>
    </div>
  );
}
