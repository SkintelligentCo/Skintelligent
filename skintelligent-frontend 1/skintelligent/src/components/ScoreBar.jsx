import { useEffect, useState } from "react";

import { colors, fonts, motion } from "../styles/tokens";

export default function ScoreBar({ label, value, max = 100 }) {
  const normalizedValue = Math.max(0, Math.min(max, value));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setDisplayValue(normalizedValue);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [normalizedValue]);

  return (
    <div
      className="motion-score-bar"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(150px, 1.55fr) minmax(160px, 1fr) auto",
        alignItems: "center",
        columnGap: "1rem",
        padding: "0.85rem 0",
        borderTop: `1px solid ${colors.border}`,
      }}
    >
      <span style={{ fontSize: "0.92rem", color: colors.mid, lineHeight: 1.3 }}>{label}</span>
      <div
        style={{
          width: "100%",
          height: "6px",
          background: "rgba(196,120,88,0.15)",
          borderRadius: "100px",
          overflow: "hidden",
        }}
      >
        <div
          className="score-bar-fill"
          style={{
            height: "100%",
            width: `${(displayValue / max) * 100}%`,
            background: `linear-gradient(90deg, ${colors.terracotta}, ${colors.deepRose})`,
            borderRadius: "100px",
            transition: `width 1000ms ${motion.easing.softOut}`,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: fonts.display,
          fontSize: "1.18rem",
          color: colors.deepRose,
          minWidth: "2.2ch",
          textAlign: "right",
          lineHeight: 1,
        }}
      >
        {normalizedValue}
      </span>
    </div>
  );
}
