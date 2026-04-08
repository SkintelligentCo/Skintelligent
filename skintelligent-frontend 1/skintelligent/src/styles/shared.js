import { colors, fonts, radii, shadows } from "./tokens";

// ── Layout ──
export const page = {
  minHeight: "100vh",
  background: colors.cream,
  fontFamily: fonts.body,
  fontWeight: 300,
  color: colors.charcoal,
};

// ── Nav ──
export const nav = {
  position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
  display: "flex", alignItems: "center", justifyContent: "space-between",
  padding: "1.4rem 3rem",
  background: "rgba(250,246,241,0.82)",
  backdropFilter: "blur(14px)",
  borderBottom: `1px solid ${colors.border}`,
};

export const logo = {
  fontFamily: fonts.display, fontSize: "1.55rem",
  color: colors.deepRose, letterSpacing: "-0.02em", cursor: "pointer",
};

export const logoAccent = { color: colors.moss, fontStyle: "italic" };

export const navLink = {
  textDecoration: "none", color: colors.mid, fontSize: "0.875rem",
  letterSpacing: "0.04em", textTransform: "uppercase", cursor: "pointer",
  background: "none", border: "none", fontFamily: "inherit",
};

export const navCta = {
  background: colors.deepRose, color: colors.cream,
  padding: "0.55rem 1.3rem", borderRadius: radii.pill,
  border: "none", cursor: "pointer", fontSize: "0.875rem",
  letterSpacing: "0.04em", textTransform: "uppercase", fontFamily: "inherit",
};

// ── Typography ──
export const sectionLabel = {
  fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase",
  color: colors.terracotta, marginBottom: "0.8rem",
};

export const sectionTitle = {
  fontFamily: fonts.display, fontSize: "clamp(2rem, 3.5vw, 3rem)",
  lineHeight: 1.1, letterSpacing: "-0.02em",
  color: colors.charcoal, marginBottom: "1rem",
};

export const sectionTitleEm = { color: colors.deepRose, fontStyle: "italic" };

export const sectionSub = {
  fontSize: "1rem", color: colors.mid, lineHeight: 1.7, maxWidth: "52ch",
};

// ── Buttons ──
export const btnPrimary = {
  display: "inline-block", background: colors.deepRose, color: colors.cream,
  padding: "0.85rem 2rem", borderRadius: radii.pill, fontSize: "0.9rem",
  letterSpacing: "0.04em", border: "none", cursor: "pointer",
  fontFamily: "inherit", transition: "background 0.22s, transform 0.18s",
};

export const btnGhost = {
  display: "inline-flex", alignItems: "center", gap: "0.45rem",
  color: colors.mid, fontSize: "0.9rem", letterSpacing: "0.04em",
  padding: "0.85rem 1.4rem", border: `1px solid ${colors.border}`,
  borderRadius: radii.pill, background: "none", cursor: "pointer",
  fontFamily: "inherit",
};

export const btnLight = {
  display: "inline-block", background: colors.cream, color: colors.deepRose,
  padding: "0.9rem 2.2rem", borderRadius: radii.pill, fontSize: "0.9rem",
  letterSpacing: "0.04em", fontWeight: 500, border: "none",
  cursor: "pointer", fontFamily: "inherit",
};

// ── Cards ──
export const card = {
  background: colors.cardBg, backdropFilter: "blur(20px)",
  border: `1px solid ${colors.border}`, borderRadius: radii.xl,
  padding: "2rem", boxShadow: shadows.card,
};

// ── Inputs ──
export const input = {
  width: "100%", padding: "0.85rem 1rem", borderRadius: radii.md,
  border: `1px solid ${colors.border}`, background: colors.warmWhite,
  fontSize: "0.9rem", fontFamily: "inherit", outline: "none",
  boxSizing: "border-box",
};

export const inputLarge = {
  ...input, padding: "1rem 1.4rem", borderRadius: "18px", fontSize: "1rem",
};

// ── Chips ──
export const chip = (active) => ({
  padding: "0.55rem 1.1rem", borderRadius: radii.pill,
  border: active ? `2px solid ${colors.deepRose}` : `1px solid ${colors.border}`,
  background: active ? "rgba(139,74,60,0.08)" : "transparent",
  color: active ? colors.deepRose : colors.mid,
  fontSize: "0.82rem", fontFamily: "inherit", cursor: "pointer",
  transition: "all 0.2s",
});

export const filterPill = (active) => ({
  padding: "0.5rem 1.1rem", borderRadius: radii.pill,
  border: active ? `2px solid ${colors.deepRose}` : `1px solid ${colors.border}`,
  background: active ? "rgba(139,74,60,0.08)" : "transparent",
  color: active ? colors.deepRose : colors.mid,
  fontSize: "0.82rem", fontFamily: "inherit", cursor: "pointer",
});
