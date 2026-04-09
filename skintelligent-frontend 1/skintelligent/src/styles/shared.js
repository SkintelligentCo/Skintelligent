import { colors, fonts, radii, shadows } from "./tokens";

// Layout
export const page = {
  minHeight: "100vh",
  background: "transparent",
  fontFamily: fonts.body,
  fontWeight: 300,
  color: colors.charcoal,
  position: "relative",
  overflowX: "clip",
};

// Nav
export const nav = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.4rem 3rem",
  background: "rgba(253,249,245,0.76)",
  backdropFilter: "blur(20px)",
  borderBottom: `1px solid ${colors.border}`,
  boxShadow: "0 12px 40px rgba(139,74,60,0.08)",
  fontFamily: fonts.body,
};

export const logo = {
  fontFamily: fonts.display,
  fontSize: "1.55rem",
  color: colors.deepRose,
  letterSpacing: "-0.02em",
  cursor: "pointer",
};

export const logoAccent = { color: colors.moss, fontStyle: "italic" };

export const navLink = {
  textDecoration: "none",
  color: colors.mid,
  fontSize: "0.875rem",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  cursor: "pointer",
  background: "none",
  border: "none",
  fontFamily: "inherit",
  padding: "0.45rem 0",
  transition: "color 180ms ease, transform 180ms ease, opacity 180ms ease",
};

export const navCta = {
  background: colors.deepRose,
  color: colors.cream,
  padding: "0.55rem 1.3rem",
  borderRadius: radii.pill,
  border: "none",
  cursor: "pointer",
  fontSize: "0.875rem",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  fontFamily: "inherit",
  boxShadow: "0 16px 32px rgba(139,74,60,0.16)",
  transition: "transform 220ms ease, box-shadow 220ms ease, background 220ms ease",
};

// Typography
export const sectionLabel = {
  fontSize: "0.75rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: colors.terracotta,
  marginBottom: "0.8rem",
};

export const sectionTitle = {
  fontFamily: fonts.display,
  fontSize: "clamp(2rem, 3.5vw, 3rem)",
  lineHeight: 1.1,
  letterSpacing: "-0.02em",
  color: colors.charcoal,
  marginBottom: "1rem",
};

export const sectionTitleEm = { color: colors.deepRose, fontStyle: "italic" };

export const sectionSub = {
  fontSize: "1rem",
  color: colors.mid,
  lineHeight: 1.7,
  maxWidth: "52ch",
};

// Buttons
export const btnPrimary = {
  display: "inline-block",
  background: colors.deepRose,
  color: colors.cream,
  padding: "0.85rem 2rem",
  borderRadius: radii.pill,
  fontSize: "0.9rem",
  letterSpacing: "0.04em",
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 18px 38px rgba(139,74,60,0.18)",
  transition: "background 0.22s, transform 0.22s, box-shadow 0.22s",
};

export const btnGhost = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  color: colors.mid,
  fontSize: "0.9rem",
  letterSpacing: "0.04em",
  padding: "0.85rem 1.4rem",
  border: `1px solid ${colors.border}`,
  borderRadius: radii.pill,
  background: "rgba(255,255,255,0.52)",
  cursor: "pointer",
  fontFamily: "inherit",
  transition: "transform 0.22s, background 0.22s, border-color 0.22s, box-shadow 0.22s",
};

export const btnLight = {
  display: "inline-block",
  background: colors.cream,
  color: colors.deepRose,
  padding: "0.9rem 2.2rem",
  borderRadius: radii.pill,
  fontSize: "0.9rem",
  letterSpacing: "0.04em",
  fontWeight: 500,
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  boxShadow: "0 18px 38px rgba(0,0,0,0.15)",
  transition: "transform 0.22s, box-shadow 0.22s, background 0.22s",
};

export const inlineAction = {
  ...btnGhost,
  padding: "0.7rem 1rem",
  fontSize: "0.82rem",
};

// Cards
export const card = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,248,244,0.74) 100%)",
  backdropFilter: "blur(20px)",
  border: `1px solid ${colors.border}`,
  borderRadius: radii.xl,
  padding: "2rem",
  boxShadow: shadows.card,
  position: "relative",
  transition: "transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease",
};

// Inputs
export const input = {
  width: "100%",
  padding: "0.85rem 1rem",
  borderRadius: radii.md,
  border: `1px solid ${colors.border}`,
  background: "rgba(253,249,245,0.84)",
  fontSize: "0.9rem",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease",
};

export const inputLarge = {
  ...input,
  padding: "1rem 1.4rem",
  borderRadius: "18px",
  fontSize: "1rem",
};

// Chips
export const chip = (active) => ({
  padding: "0.55rem 1.1rem",
  borderRadius: radii.pill,
  border: active ? `2px solid ${colors.deepRose}` : `1px solid ${colors.border}`,
  background: active ? "rgba(139,74,60,0.08)" : "rgba(255,255,255,0.48)",
  color: active ? colors.deepRose : colors.mid,
  fontSize: "0.82rem",
  fontFamily: "inherit",
  cursor: "pointer",
  boxShadow: active ? shadows.chip : "none",
  transition: "transform 0.2s, box-shadow 0.2s, background 0.2s, border-color 0.2s, color 0.2s",
});

export const filterPill = (active) => ({
  padding: "0.5rem 1.1rem",
  borderRadius: radii.pill,
  border: active ? `2px solid ${colors.deepRose}` : `1px solid ${colors.border}`,
  background: active ? "rgba(139,74,60,0.08)" : "rgba(255,255,255,0.48)",
  color: active ? colors.deepRose : colors.mid,
  fontSize: "0.82rem",
  fontFamily: "inherit",
  cursor: "pointer",
  boxShadow: active ? shadows.chip : "none",
  transition: "transform 0.2s, box-shadow 0.2s, background 0.2s, border-color 0.2s, color 0.2s",
});
