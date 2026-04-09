import { colors } from "../styles/tokens";

const variants = {
  error: {
    background: "rgba(139,74,60,0.1)",
    color: colors.deepRose,
    border: "rgba(139,74,60,0.16)",
  },
  success: {
    background: "rgba(232,196,178,0.22)",
    color: colors.deepRose,
    border: "rgba(196,120,88,0.18)",
  },
  neutral: {
    background: "rgba(196,120,88,0.08)",
    color: colors.mid,
    border: colors.border,
  },
};

export default function StatusMessage({ children, variant = "error" }) {
  if (!children) {
    return null;
  }

  const styles = variants[variant] || variants.neutral;
  return (
    <div
      className="status-message motion-status"
      style={{
        marginTop: "1rem",
        padding: "0.85rem 1rem",
        borderRadius: "14px",
        background: styles.background,
        color: styles.color,
        border: `1px solid ${styles.border}`,
        fontSize: "0.84rem",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
}
