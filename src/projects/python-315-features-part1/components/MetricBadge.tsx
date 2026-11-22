import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants";
import type { MetricComparison } from "../types";

interface MetricBadgeProps {
  metric: MetricComparison;
  delay?: number;
}

export const MetricBadge: React.FC<MetricBadgeProps> = ({ metric, delay = 25 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 120 },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: 870,
        padding: "20px 36px",
        borderRadius: 22,
        backgroundColor: "rgba(15, 23, 42, 0.96)",
        border: `2px solid ${THEME.cardBorder}`,
        boxShadow: "0 18px 45px rgba(0, 0, 0, 0.6)",
        transform: `scale(${entrance}) translateY(${(1 - entrance) * 20}px)`,
        opacity: entrance,
      }}
    >
      {/* Before */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {metric.beforeLabel}
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 54,
            fontWeight: 700,
            color: THEME.accentRed,
            textDecoration: "line-through",
          }}
        >
          {metric.beforeVal}
        </span>
      </div>

      {/* Speed multiplier tag */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          padding: "10px 24px",
          borderRadius: 999,
          backgroundColor: "rgba(74, 222, 128, 0.12)",
          border: `1.5px solid ${THEME.pythonGreen}50`,
        }}
      >
        <span style={{ fontSize: 26, color: THEME.pythonGreen, fontWeight: 700 }}>⚡ 31x FASTER</span>
      </div>

      {/* After */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 700,
            color: THEME.pythonGreen,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {metric.afterLabel}
        </span>
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 58,
            fontWeight: 700,
            color: THEME.pythonGreen,
          }}
        >
          {metric.afterVal}
        </span>
      </div>
    </div>
  );
};
