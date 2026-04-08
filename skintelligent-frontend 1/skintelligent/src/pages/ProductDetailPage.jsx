import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";
import FitScoreRing from "../components/FitScoreRing";
import ScoreBar from "../components/ScoreBar";

// Hardcoded example product for visual reference
const PRODUCT = {
  brand: "CeraVe",
  name: "Moisturizing Cream",
  category: "Moisturizer",
  price: "$19",
  reviewCount: 48200,
  hypeScore: 62,
  safetyScore: 96,
  score: 91,
  ingredients: [
    { name: "Ceramides (1,3,6-II)", score: 90, label: "Barrier ✓", variant: "sage" },
    { name: "Hyaluronic Acid", score: 78, label: "Hydrate ✓", variant: "rose" },
    { name: "Niacinamide", score: 65, label: "Tone ✓", variant: "terra" },
    { name: "Petrolatum", score: 40, label: "Occlusive", variant: "rose" },
  ],
  sentiment: { positive: 84, negative: 9, mixed: 7 },
  factors: [
    { label: "Great for Combination skin", positive: true },
    { label: "Targets: Dryness, Redness", positive: true },
    { label: "Contains your favorites: Niacinamide, Ceramides", positive: true },
  ],
};

const barColors = {
  sage: `linear-gradient(90deg, #b2d4ac, ${colors.moss})`,
  rose: `linear-gradient(90deg, ${colors.blush}, ${colors.deepRose})`,
  terra: `linear-gradient(90deg, ${colors.blush}, ${colors.terracotta})`,
};

export default function ProductDetailPage() {
  return (
    <div style={{ ...s.page, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "2rem 3rem" }}>
        <div style={s.card}>

          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{
              fontSize: "0.72rem", color: colors.lightMid,
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem",
            }}>
              {PRODUCT.brand} · {PRODUCT.category} · {PRODUCT.price}
            </div>
            <h3 style={{ fontFamily: fonts.display, fontSize: "1.4rem", color: colors.charcoal }}>
              {PRODUCT.name}
            </h3>
          </div>

          {/* Badges */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "0.3rem 0.7rem", borderRadius: "100px",
              background: "rgba(74,92,69,0.12)", color: colors.moss,
            }}>Worth the Hype ✓</span>
            <span style={{
              fontSize: "0.7rem", letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "0.3rem 0.7rem", borderRadius: "100px",
              background: "rgba(139,74,60,0.1)", color: colors.deepRose,
            }}>{PRODUCT.reviewCount.toLocaleString()} reviews</span>
          </div>

          {/* Fit Score */}
          <div style={{
            display: "flex", alignItems: "center", gap: "1.2rem",
            padding: "1.2rem", borderRadius: "16px",
            background: "rgba(74,92,69,0.05)", marginBottom: "1.5rem",
          }}>
            <FitScoreRing score={PRODUCT.score} size={64} />
            <div>
              <div style={{
                fontFamily: fonts.display, fontSize: "1rem",
                color: colors.charcoal, marginBottom: "0.25rem",
              }}>Your Fit Score</div>
              <div style={{ fontSize: "0.82rem", color: colors.mid }}>
                Excellent match for your profile
              </div>
            </div>
          </div>

          {/* Explainable factors */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", marginBottom: "1.5rem" }}>
            {PRODUCT.factors.map((f, i) => (
              <div key={i} style={{
                padding: "0.55rem 0.85rem", borderRadius: "10px",
                background: f.positive ? "rgba(74,92,69,0.06)" : "rgba(196,120,88,0.07)",
                fontSize: "0.8rem", color: f.positive ? colors.moss : colors.terracotta,
              }}>
                {f.positive ? "✓ " : "⚠ "}{f.label}
              </div>
            ))}
          </div>

          {/* Ingredient scores */}
          <div style={{
            fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
            color: colors.lightMid, marginBottom: "0.6rem",
          }}>Key Ingredient Scores</div>
          {PRODUCT.ingredients.map(ing => (
            <div key={ing.name} style={{
              display: "flex", alignItems: "center", gap: "0.8rem",
              padding: "0.45rem 0", fontSize: "0.82rem",
            }}>
              <span style={{ color: colors.charcoal, minWidth: "140px" }}>{ing.name}</span>
              <div style={{
                flex: 1, height: 6, background: "rgba(196,120,88,0.12)",
                borderRadius: 100, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%", width: `${ing.score}%`, borderRadius: 100,
                  background: barColors[ing.variant],
                }} />
              </div>
              <span style={{
                fontSize: "0.68rem", letterSpacing: "0.04em",
                color: colors.lightMid, textTransform: "uppercase",
                minWidth: "65px", textAlign: "right",
              }}>{ing.label}</span>
            </div>
          ))}

          {/* Sentiment */}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
            {[
              { label: `${PRODUCT.sentiment.positive}% Positive`, color: colors.moss },
              { label: `${PRODUCT.sentiment.negative}% Negative`, color: "#c47878" },
              { label: `${PRODUCT.sentiment.mixed}% Mixed`, color: "#c4a878" },
            ].map(sent => (
              <div key={sent.label} style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                fontSize: "0.73rem", padding: "0.35rem 0.75rem",
                borderRadius: "100px", border: `1px solid ${colors.border}`, color: colors.mid,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: sent.color }} />
                {sent.label}
              </div>
            ))}
          </div>

          {/* Hype + Safety */}
          <div style={{ marginTop: "1.5rem" }}>
            <ScoreBar label="Hype Meter" value={PRODUCT.hypeScore} width="90px" />
            <ScoreBar label="Safety Score" value={PRODUCT.safetyScore} width="90px" />
          </div>

          {/* Explanation box */}
          <div style={{
            marginTop: "1.2rem", padding: "0.9rem",
            background: "rgba(74,92,69,0.07)", borderRadius: "12px",
            fontSize: "0.8rem", color: colors.moss, lineHeight: 1.6,
          }}>
            💚 <strong>Why this works for you:</strong> Ceramide-rich formula perfectly suits your
            combination-sensitive type. Niacinamide aligns with your hyperpigmentation concern.
            Non-fragrant, non-comedogenic.
          </div>

          {/* Save button */}
          <button style={{ ...s.btnPrimary, width: "100%", marginTop: "1.5rem", textAlign: "center" }}>
            ♡ Save Product
          </button>
        </div>
      </div>
    </div>
  );
}
