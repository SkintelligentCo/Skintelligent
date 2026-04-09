import { Link } from "react-router-dom";

import { PageTransition, Reveal, StaggerGroup } from "../components/Motion";
import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

const features = [
  {
    title: "Personalized User Profile",
    desc: "Create your skin identity with type, concerns, and ingredient preferences.",
  },
  {
    title: "Recommendation Engine",
    desc: "Ranked product matching that surfaces the right products for your profile.",
  },
  {
    title: "Product Lookup",
    desc: "Search the catalog and get a personal fit score on every product.",
  },
  {
    title: "Explainable Recommendations",
    desc: "Each recommendation comes with clear reasons, warnings, and score breakdowns.",
  },
  {
    title: "Ingredient Analysis",
    desc: "Inspect ingredient fit, possible conflicts, and sensitivity risks in one place.",
  },
  {
    title: "Saved Products",
    desc: "Build a shortlist and compare the products that are worth revisiting.",
  },
];

const stats = [
  { num: "50K+", label: "Products Analyzed" },
  { num: "1.2M", label: "Reviews Processed" },
  { num: "8K+", label: "Ingredients Indexed" },
  { num: "97%", label: "Recommendation Confidence" },
];

export default function LandingPage() {
  return (
    <PageTransition style={s.page}>
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "9rem 3rem 4rem",
          position: "relative",
        }}
      >
        <div
          className="motion-hero-blob"
          style={{
            position: "absolute",
            right: "-10%",
            top: "5%",
            width: "65vw",
            height: "65vw",
            background:
              "radial-gradient(ellipse, rgba(232,196,178,0.45) 0%, rgba(143,175,136,0.12) 55%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: 640, position: "relative", zIndex: 1 }}>
          <Reveal as="p" delay={40} style={{ ...s.sectionLabel, marginBottom: "1.2rem" }}>
            AI-Powered Skincare Intelligence
          </Reveal>
          <Reveal
            as="h1"
            delay={100}
            variant="liquid"
            style={{
              fontFamily: fonts.display,
              fontSize: "clamp(3rem, 5.5vw, 5.2rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
              marginBottom: "1.6rem",
            }}
          >
            Skin that <em style={{ fontStyle: "italic", color: colors.deepRose }}>knows</em> what it
            needs
          </Reveal>
          <Reveal
            as="p"
            delay={180}
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.7,
              color: colors.mid,
              maxWidth: "46ch",
              marginBottom: "2.4rem",
            }}
          >
            Skintelligent decodes ingredients, checks the hype, and builds personalized routines
            that match your skin instead of the crowd.
          </Reveal>
          <Reveal
            delay={250}
            variant="bounce"
            style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
          >
            <Link to="/signup" className="motion-button" style={{ ...s.btnPrimary, textDecoration: "none" }}>
              Build your profile
            </Link>
            <Link to="/login" className="motion-button" style={{ ...s.btnGhost, textDecoration: "none" }}>
              Sign in
            </Link>
          </Reveal>
        </div>
      </section>

      <section style={{ background: colors.warmWhite, padding: "6rem 3rem" }}>
        <Reveal delay={40} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={s.sectionLabel}>Platform Features</p>
          <h2 style={{ ...s.sectionTitle, textAlign: "center" }}>
            Everything your skin <em style={s.sectionTitleEm}>deserves to know</em>
          </h2>
        </Reveal>
        <StaggerGroup
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {features.map((feature, index) => (
            <Reveal key={feature.title} index={index} variant="bounce" style={{ ...s.card }} className="motion-card motion-liquid-surface">
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "14px",
                  background: "rgba(196,120,88,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  marginBottom: "1.1rem",
                  color: colors.deepRose,
                }}
              >
                +
              </div>
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: "1.05rem",
                  color: colors.charcoal,
                  marginBottom: "0.55rem",
                }}
              >
                {feature.title}
              </div>
              <p style={{ fontSize: "0.82rem", color: colors.mid, lineHeight: 1.65 }}>{feature.desc}</p>
            </Reveal>
          ))}
        </StaggerGroup>
      </section>

      <section style={{ textAlign: "center", padding: "6rem 3rem" }}>
        <Reveal delay={40}>
          <p style={s.sectionLabel}>By the Numbers</p>
          <h2 style={{ ...s.sectionTitle, textAlign: "center" }}>
            Trusted by skin-curious people <em style={s.sectionTitleEm}>everywhere</em>
          </h2>
        </Reveal>
        <StaggerGroup
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "5rem",
            marginTop: "3rem",
            flexWrap: "wrap",
          }}
        >
          {stats.map((stat, index) => (
            <Reveal key={stat.label} index={index} variant="pop" className="motion-stat">
              <div
                style={{
                  fontFamily: fonts.display,
                  fontSize: "3rem",
                  color: colors.deepRose,
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  color: colors.lightMid,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                {stat.label}
              </div>
            </Reveal>
          ))}
        </StaggerGroup>
      </section>

      <section
        style={{
          background: colors.charcoal,
          textAlign: "center",
          padding: "7rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Reveal
          variant="liquid"
          style={{
            position: "absolute",
            top: "-20%",
            right: "-8%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,196,178,0.18), transparent 68%)",
            pointerEvents: "none",
          }}
          className="motion-hero-blob"
        />
        <Reveal
          as="h2"
          delay={60}
          style={{
            ...s.sectionTitle,
            color: colors.cream,
            maxWidth: "16ch",
            margin: "0 auto 1.2rem",
            position: "relative",
          }}
        >
          Your skin deserves smarter <em style={{ color: colors.blush, fontStyle: "italic" }}>choices</em>
        </Reveal>
        <Reveal
          as="p"
          delay={140}
          style={{ ...s.sectionSub, color: "rgba(250,246,241,0.55)", margin: "0 auto 2.5rem" }}
        >
          Build your profile in minutes and get ranked recommendations immediately.
        </Reveal>
        <Reveal delay={220} variant="bounce">
          <Link to="/signup" className="motion-button" style={{ ...s.btnLight, textDecoration: "none" }}>
            Create your skin profile
          </Link>
        </Reveal>
      </section>
    </PageTransition>
  );
}
