import { colors, fonts } from "../styles/tokens";

export default function ScoreBar({ label, value, max = 100, width = "70px" }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0.6rem 0", borderTop: `1px solid ${colors.border}`,
    }}>
      <span style={{ fontSize: "0.8rem", color: colors.mid }}>{label}</span>
      <div style={{
        width, height: "5px", background: "rgba(196,120,88,0.15)",
        borderRadius: "100px", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", width: `${(value / max) * 100}%`,
          background: `linear-gradient(90deg, ${colors.terracotta}, ${colors.deepRose})`,
          borderRadius: "100px", transition: "width 1.2s ease-out",
        }} />
      </div>
      <span style={{
        fontFamily: fonts.display, fontSize: "1.1rem",
        color: colors.deepRose, minWidth: "35px", textAlign: "right",
      }}>
        {value}
      </span>
    </div>
  );
}
