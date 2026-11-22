import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { StatCardProps } from "./types";

export const StatCard: React.FC<StatCardProps> = ({
  label = "Monthly Recurring Revenue",
  value = "$84,200",
  growth = "+14.8%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Practice 01 Spring Formula:
  // Tuning spring parameters (damping, mass, stiffness) for an organic, tactile pop
  const entrance = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 110 },
  });

  const scale = interpolate(entrance, [0, 1], [0.8, 1]);
  const translateY = interpolate(entrance, [0, 1], [40, 0]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          opacity,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 44,
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow: "0 35px 90px rgba(0, 0, 0, 0.75), inset 0 1px 2px rgba(255, 255, 255, 0.25)",
          padding: "72px 80px",
          minWidth: 860,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: "#a1a1aa",
              fontSize: 40,
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </span>
          <span
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "#4ade80",
              border: "1px solid rgba(74, 222, 128, 0.35)",
              fontSize: 28,
              fontWeight: 600,
              padding: "10px 22px",
              borderRadius: 9999,
            }}
          >
            {growth}
          </span>
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: 120,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#a1a1aa",
            fontSize: 26,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
          Live analytics • Apple-style pop-in
        </div>
      </div>
    </div>
  );
};
