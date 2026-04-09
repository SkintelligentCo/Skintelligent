import { colors } from "../styles/tokens";

const VARIANTS = {
  terra: { bg: "rgba(196,120,88,0.12)", color: colors.terracotta },
  moss: { bg: "rgba(74,92,69,0.1)", color: colors.moss },
  rose: { bg: "rgba(139,74,60,0.1)", color: colors.deepRose },
  blush: { bg: "rgba(232,196,178,0.35)", color: colors.deepRose },
};

export default function Tag({ children, variant = "terra", motionIndex = 0 }) {
  const v = VARIANTS[variant] || VARIANTS.terra;
  return (
    <span
      className="motion-pill"
      style={{
        "--stagger-index": motionIndex,
        background: v.bg, color: v.color, fontSize: "0.72rem",
        padding: "0.3rem 0.75rem", borderRadius: "100px",
        letterSpacing: "0.04em", whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}
