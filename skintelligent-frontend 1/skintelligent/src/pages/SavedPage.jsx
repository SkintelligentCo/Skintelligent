import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

export default function SavedPage() {
  return (
    <div style={{ ...s.page, paddingTop: "6rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 3rem" }}>

        <p style={s.sectionLabel}>Your Collection</p>
        <h2 style={{ ...s.sectionTitle, marginBottom: "0.5rem" }}>
          Saved <em style={s.sectionTitleEm}>products</em>
        </h2>
        <p style={{ ...s.sectionSub, marginBottom: "2rem" }}>
          0 products in your collection.
        </p>

        {/* Empty state */}
        <div style={{ ...s.card, textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>♡</div>
          <div style={{
            fontFamily: fonts.display, fontSize: "1.2rem", marginBottom: "0.5rem",
          }}>
            No saved products yet
          </div>
          <p style={{ fontSize: "0.88rem", color: colors.mid }}>
            Browse your recommendations and tap the heart to save products you're interested in.
          </p>
        </div>
      </div>
    </div>
  );
}
