import { colors, fonts } from "../styles/tokens";

export default function FitScoreRing({ score, size = 52, color }) {
  const ringColor = color || (score >= 80 ? colors.moss : score >= 55 ? colors.terracotta : colors.deepRose);
  const inner = size - 10;

  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `conic-gradient(${ringColor} ${score * 3.6}deg, rgba(196,120,88,0.12) 0deg)`,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <div style={{
        width: inner, height: inner, borderRadius: "50%", background: colors.cream,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: fonts.display, fontSize: size > 56 ? "1.3rem" : "0.95rem",
        color: ringColor,
      }}>
        {score}
      </div>
    </div>
  );
}
