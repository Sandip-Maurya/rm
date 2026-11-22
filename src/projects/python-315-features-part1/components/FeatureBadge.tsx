import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants";

interface FeatureBadgeProps {
  icon: string;
  index: string;
  tag: string;
  delay?: number;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({
  icon,
  index,
  tag,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      mass: 0.5,
      stiffness: 120,
    },
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 20,
        padding: "16px 36px",
        borderRadius: 999,
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        border: `2px solid ${THEME.cardBorder}`,
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(14px)",
        transform: `scale(${entrance}) translateY(${(1 - entrance) * -30}px)`,
        opacity: entrance,
      }}
    >
      <span style={{ fontSize: 44, lineHeight: 1 }}>{icon}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 28,
            fontWeight: 900,
            color: THEME.pythonYellow,
            letterSpacing: "0.08em",
          }}
        >
          {index}
        </span>
        <span
          style={{
            color: "rgba(255, 255, 255, 0.35)",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          /
        </span>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            fontWeight: 800,
            color: THEME.textPrimary,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {tag}
        </span>
      </div>
    </div>
  );
};
