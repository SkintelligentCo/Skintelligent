import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";
import Tag from "../components/Tag";
import FitScoreRing from "../components/FitScoreRing";

export default function LookupPage() {
  return (
    <div style={{ ...s.page, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 3rem" }}>

        <p style={s.sectionLabel}>Product Lookup</p>
        <h2 style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>
          Search any <em style={s.sectionTitleEm}>product</em>
        </h2>
        <p style={{ ...s.sectionSub, marginBottom: "2rem" }}>
          Look up by name, brand, or ingredient and get your personal fit score instantly.
        </p>

        <input
          placeholder="Search products, brands, or ingredients..."
          style={{ ...s.inputLarge, marginBottom: "2rem" }}
        />

        {/* Example result card */}
        <div style={{ ...s.card, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, ${colors.terracotta}, ${colors.blush})`,
          }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
            <div>
              <div style={{
                fontSize: "0.72rem", color: colors.lightMid,
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.25rem",
              }}>CeraVe</div>
              <div style={{ fontFamily: fonts.display, fontSize: "1.1rem", color: colors.charcoal }}>
                Moisturizing Cream
              </div>
            </div>
            <FitScoreRing score={91} />
          </div>
          <p style={{ fontSize: "0.82rem", color: colors.mid, lineHeight: 1.65, marginBottom: "1rem" }}>
            Ceramide-rich formula that restores the skin barrier. Non-comedogenic, fragrance-free.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem" }}>
            <Tag variant="moss">Ceramides</Tag>
            <Tag variant="moss">Hyaluronic Acid</Tag>
            <Tag variant="moss">Niacinamide</Tag>
            <Tag variant="terra">$19</Tag>
          </div>
          <div style={{
            padding: "0.65rem 0.9rem", borderRadius: "12px",
            background: "rgba(74,92,69,0.07)", fontSize: "0.78rem",
            lineHeight: 1.5, color: colors.moss,
          }}>
            ✓ Great for Combination skin
          </div>
        </div>

        {/* Empty state */}
        <div style={{
          textAlign: "center", padding: "3rem 2rem", color: colors.lightMid,
          fontSize: "0.9rem", marginTop: "2rem",
        }}>
          Start typing to search your product database.
        </div>
      </div>
    </div>
  );
}
