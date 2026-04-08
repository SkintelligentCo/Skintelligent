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

// Example "selected" state — hardcoded for visual reference
const SELECTED_TYPE = "Combination";
const SELECTED_CONCERNS = ["Hyperpigmentation", "Dryness"];
const SELECTED_LOVE = ["Niacinamide", "Ceramides"];
const SELECTED_AVOID = ["Fragrance"];

function ChipGroup({ label, items, selected }) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ fontFamily: fonts.display, fontSize: "1rem", marginBottom: "0.3rem" }}>
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.8rem" }}>
        {items.map(item => {
          const active = Array.isArray(selected)
            ? selected.includes(item)
            : selected === item;
          return (
            <button key={item} style={s.chip(active)}>
              {active && "✓ "}{item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div style={{ ...s.page, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 3rem" }}>

        <p style={s.sectionLabel}>Your Profile</p>
        <h2 style={{ ...s.sectionTitle, marginBottom: "2rem" }}>
          Edit skin <em style={s.sectionTitleEm}>profile</em>
        </h2>

        <ChipGroup label="Skin Type" items={SKIN_TYPES} selected={SELECTED_TYPE} />
        <ChipGroup label="Concerns" items={CONCERNS} selected={SELECTED_CONCERNS} />
        <ChipGroup label="Ingredients You Love" items={INGREDIENTS_LOVE} selected={SELECTED_LOVE} />
        <ChipGroup label="Ingredients to Avoid" items={INGREDIENTS_AVOID} selected={SELECTED_AVOID} />

        <button style={s.btnPrimary}>Save Changes</button>
      </div>
    </div>
  );
}
