import { colors, fonts } from "../styles/tokens";
import * as s from "../styles/shared";

export default function LoadingBlock({ title = "Loading...", message = "Please wait." }) {
  return (
    <div className="motion-card liquid-card" style={{ ...s.card, maxWidth: 420, textAlign: "center" }}>
      <div
        className="loading-orb motion-spinner"
        style={{
          width: 48,
          height: 48,
          margin: "0 auto 1rem",
          borderRadius: "50%",
          border: `4px solid rgba(196,120,88,0.16)`,
          borderTopColor: colors.deepRose,
        }}
      />
      <div style={{ fontFamily: fonts.display, fontSize: "1.2rem", marginBottom: "0.45rem" }}>
        {title}
      </div>
      <p style={{ margin: 0, color: colors.mid, lineHeight: 1.6 }}>{message}</p>
    </div>
  );
}
