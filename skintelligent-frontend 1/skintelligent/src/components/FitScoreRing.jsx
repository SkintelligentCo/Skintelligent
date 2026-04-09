import { useEffect, useState } from "react";

import { colors, fonts, motion } from "../styles/tokens";

export default function FitScoreRing({ score, size = 52, color, className = "" }) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const [displayScore, setDisplayScore] = useState(0);
  const ringColor =
    color ||
    (normalizedScore >= 80
      ? colors.moss
      : normalizedScore >= 55
        ? colors.terracotta
        : colors.deepRose);
  const strokeWidth = Math.max(4, Math.round(size * 0.1));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setDisplayScore(normalizedScore);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, [normalizedScore]);

  return (
    <div
      className={`fit-score-ring motion-ring ${className}`.trim()}
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "grid",
        placeItems: "center",
        flexShrink: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: "rotate(-90deg)", overflow: "visible" }}
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(196,120,88,0.12)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: `stroke-dashoffset 980ms ${motion.easing.liquid}`,
          }}
        />
      </svg>
      <div
        className="fit-score-ring__inner"
        style={{
          position: "absolute",
          inset: strokeWidth + 3,
          borderRadius: "50%",
          background: colors.cream,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.display,
          fontSize: size > 56 ? "1.3rem" : "0.95rem",
          color: ringColor,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
        }}
      >
        {Math.round(normalizedScore)}
      </div>
    </div>
  );
}
