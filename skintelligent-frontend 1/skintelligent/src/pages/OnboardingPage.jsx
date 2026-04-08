import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

const SKIN_TYPES = ["Oily", "Dry", "Combination", "Normal", "Sensitive"];
const CONCERNS = [
  "Acne", "Hyperpigmentation", "Fine Lines", "Dryness",
  "Redness", "Dark Circles", "Large Pores", "Uneven Texture",
  "Sun Damage", "Dullness",
];
const INGREDIENTS_LOVE = [
  "Niacinamide", "Ceramides", "Hyaluronic Acid", "Retinol",
  "Vitamin C", "Salicylic Acid", "Peptides", "Squalane",
  "Azelaic Acid", "Green Tea",
];
const INGREDIENTS_AVOID = [
  "Fragrance", "Alcohol", "Parabens", "Sulfates",
  "Essential Oils", "Silicones", "Mineral Oil", "Formaldehyde",
];

// Shows Step 1 statically — your team wires up the step progression
export default function OnboardingPage({ setPage }) {
  return (
    <div style={{
      ...s.page, display: "flex", alignItems: "center",
      justifyContent: "center", minHeight: "100vh", padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: 600 }}>

        {/* Progress bar */}
        <div style={{
          height: 3, background: colors.border,
          borderRadius: 100, marginBottom: "2.5rem", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: "25%",
            background: `linear-gradient(90deg, ${colors.terracotta}, ${colors.deepRose})`,
            borderRadius: 100,
          }} />
        </div>

        <p style={s.sectionLabel}>Step 1 of 4</p>
        <h2 style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>What's your skin type?</h2>
        <p style={s.sectionSub}>This helps us filter products that work best for your skin's baseline.</p>

        {/* Skin type chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1.5rem" }}>
          {SKIN_TYPES.map((type, i) => (
            <button key={type} style={s.chip(i === 2)}>
              {i === 2 && "✓ "}{type}
            </button>
          ))}
        </div>

        {/* Step 2 preview */}
        <div style={{ marginTop: "3rem", opacity: 0.35 }}>
          <p style={s.sectionLabel}>Step 2 of 4</p>
          <h2 style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>What are your top concerns?</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginTop: "1rem" }}>
            {CONCERNS.slice(0, 5).map(c => (
              <button key={c} style={s.chip(false)}>{c}</button>
            ))}
          </div>
        </div>

        {/* Nav buttons */}
        <div style={{ display: "flex", gap: "1rem", marginTop: "2.5rem" }}>
          <button style={s.btnPrimary}>Continue →</button>
        </div>
      </div>
    </div>
  );
}

// Export the option lists so the team can use them
export { SKIN_TYPES, CONCERNS, INGREDIENTS_LOVE, INGREDIENTS_AVOID };
