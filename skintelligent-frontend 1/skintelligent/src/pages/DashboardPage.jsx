import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";
import Tag from "../components/Tag";
import FitScoreRing from "../components/FitScoreRing";
import ScoreBar from "../components/ScoreBar";

// Hardcoded example cards — replace with real data
const EXAMPLE_PRODUCTS = [
  {
    brand: "CeraVe", name: "Moisturizing Cream", price: "$19",
    desc: "Ceramide-rich formula that restores the skin barrier. Non-comedogenic, fragrance-free.",
    ingredients: ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
    score: 91, factor: "Great for Combination skin",
  },
  {
    brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", price: "$6",
    desc: "High-strength vitamin and mineral formula targeting blemishes and congestion.",
    ingredients: ["Niacinamide", "Zinc PCA"],
    score: 84, factor: "Targets: Acne, Large Pores",
  },
  {
    brand: "La Roche-Posay", name: "Cicaplast Baume B5+", price: "$18",
    desc: "Multi-purpose balm for skin repair. Dermatologist recommended for irritated skin.",
    ingredients: ["Panthenol", "Madecassoside", "Shea Butter"],
    score: 87, factor: "Targets: Redness, Dryness",
  },
  {
    brand: "Paula's Choice", name: "2% BHA Liquid Exfoliant", price: "$35",
    desc: "Leave-on exfoliant that unclogs pores and smooths texture.",
    ingredients: ["Salicylic Acid", "Green Tea"],
    score: 78, factor: "Contains your favorites: Salicylic Acid",
  },
  {
    brand: "Skinceuticals", name: "C E Ferulic", price: "$182",
    desc: "Gold-standard vitamin C serum. Clinical-grade antioxidant protection.",
    ingredients: ["Vitamin C", "Vitamin E", "Ferulic Acid"],
    score: 82, factor: "Targets: Hyperpigmentation, Fine Lines",
  },
  {
    brand: "Supergoop", name: "Unseen Sunscreen SPF 40", price: "$38",
    desc: "Invisible, weightless SPF that doubles as a makeup primer.",
    ingredients: ["Avobenzone", "Homosalate"],
    score: 65, factor: "Not optimized for Combination skin",
  },
];

function ProductCard({ product }) {
  return (
    <div style={{
      ...s.card, position: "relative", overflow: "hidden", cursor: "pointer",
      transition: "transform 0.25s, box-shadow 0.25s",
    }}>
      {/* Accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${colors.terracotta}, ${colors.blush})`,
      }} />

      {/* Save icon */}
      <span style={{
        position: "absolute", top: "1rem", right: "1rem",
        fontSize: "1.2rem", opacity: 0.5, cursor: "pointer",
      }}>♡</span>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <div>
          <div style={{
            fontSize: "0.72rem", color: colors.lightMid,
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem",
          }}>{product.brand}</div>
          <div style={{
            fontFamily: fonts.display, fontSize: "1.1rem",
            color: colors.charcoal, paddingRight: "2rem",
          }}>{product.name}</div>
        </div>
        <FitScoreRing score={product.score} />
      </div>

      <p style={{ fontSize: "0.82rem", color: colors.mid, lineHeight: 1.65, marginBottom: "1rem" }}>
        {product.desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
        {product.ingredients.map(i => <Tag key={i} variant="moss">{i}</Tag>)}
        <Tag variant="terra">{product.price}</Tag>
      </div>

      <div style={{
        padding: "0.65rem 0.9rem", borderRadius: "12px",
        background: "rgba(74,92,69,0.07)", fontSize: "0.78rem",
        lineHeight: 1.5, color: colors.moss,
      }}>
        ✓ {product.factor}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div style={{ ...s.page, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 3rem" }}>

        {/* Profile summary */}
        <div style={{
          ...s.card, marginBottom: "3rem", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.2rem" }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: `linear-gradient(135deg, ${colors.blush}, ${colors.sage})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.4rem",
            }}>🌿</div>
            <div>
              <div style={{ fontFamily: fonts.display, fontSize: "1.15rem", marginBottom: "0.2rem" }}>
                Your Skin Profile
              </div>
              <div style={{
                fontSize: "0.78rem", color: colors.lightMid,
                textTransform: "uppercase", letterSpacing: "0.05em",
              }}>Combination · Sensitive</div>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            <Tag>Hyperpigmentation</Tag>
            <Tag>Dryness</Tag>
            <Tag variant="moss">Niacinamide ✓</Tag>
            <Tag variant="moss">Ceramides ✓</Tag>
          </div>
          <button style={s.btnGhost}>Edit Profile</button>
        </div>

        {/* Section header */}
        <p style={s.sectionLabel}>Your Recommendations</p>
        <h2 style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>
          Products ranked for <em style={s.sectionTitleEm}>your skin</em>
        </h2>
        <p style={{ ...s.sectionSub, marginBottom: "2rem" }}>
          Sorted by personal fit score. Every recommendation is explainable — tap any card to see why.
        </p>

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          <button style={s.filterPill(true)}>All Products</button>
          <button style={s.filterPill(false)}>High Fit (75+)</button>
          <button style={s.filterPill(false)}>Worth the Hype</button>
        </div>

        {/* Product grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}>
          {EXAMPLE_PRODUCTS.map((p, i) => <ProductCard key={i} product={p} />)}
        </div>
      </div>
    </div>
  );
}
