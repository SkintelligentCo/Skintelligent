// Skintelligent design tokens.
// Import everywhere and avoid hardcoded style values where a token exists.

export const colors = {
  cream: "#FAF6F1",
  warmWhite: "#FDF9F5",
  blush: "#E8C4B2",
  terracotta: "#C47858",
  deepRose: "#8B4A3C",
  moss: "#4A5C45",
  sage: "#8FAF88",
  charcoal: "#1E1A18",
  mid: "#5C4F47",
  lightMid: "#9C8B82",
  cardBg: "rgba(255,255,255,0.72)",
  border: "rgba(196,120,88,0.18)",
};

export const fonts = {
  display: "'DM Serif Display', serif",
  body: "'DM Sans', sans-serif",
  googleUrl:
    "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap",
};

export const radii = {
  sm: "10px",
  md: "14px",
  lg: "20px",
  xl: "24px",
  pill: "100px",
};

export const shadows = {
  card: "0 24px 60px rgba(139,74,60,0.1)",
  cardHover: "0 20px 50px rgba(139,74,60,0.12)",
  modal: "0 32px 80px rgba(139,74,60,0.18)",
  chip: "0 8px 24px rgba(0,0,0,0.07)",
};

export const motion = {
  duration: {
    fast: 180,
    base: 280,
    slow: 460,
    page: 700,
  },
  easing: {
    softOut: "cubic-bezier(0.22, 1, 0.36, 1)",
    bounceOut: "cubic-bezier(0.175, 0.885, 0.32, 1.28)",
    liquid: "cubic-bezier(0.16, 1, 0.3, 1)",
    sharpOut: "cubic-bezier(0.2, 0.84, 0.32, 1)",
  },
  distance: {
    sm: 10,
    md: 18,
    lg: 28,
  },
  scale: {
    hover: 1.03,
    softHover: 1.015,
    press: 0.97,
  },
  stagger: 90,
};
