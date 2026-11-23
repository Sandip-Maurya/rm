import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { MetricTickerProps } from "./types";

export const MetricTicker: React.FC<MetricTickerProps> = ({
  label = "Total Annual Run Rate (ARR)",
  targetValue = 4850230,
  growthBadge = "+134.2% YoY",
  subtext = "Live telemetry • Financial Q4 Close",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card container pop-in entrance spring (frames 0 -> 24)
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });
  const containerScale = interpolate(containerEntrance, [0, 1], [0.85, 1]);
  const containerOpacity = interpolate(containerEntrance, [0, 1], [0, 1]);
  const containerTranslateY = interpolate(containerEntrance, [0, 1], [40, 0]);

  // Practice 09 Math:
  // Float interpolation with Math.round() & Intl.NumberFormat
  // Interpolates smoothly from 0 to targetValue from frame 6 to 58 with deceleration easing
  const rawValue = interpolate(frame, [6, 58], [0, targetValue], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Integer rounding prevents decimal flicker
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(rawValue));

  // Profit badge pop-in spring (triggers as ticker nears peak at frame 45)
  const badgeEntrance = spring({
    frame: frame - 45,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });
  const badgeScale = interpolate(badgeEntrance, [0, 1], [0.6, 1]);
  const badgeOpacity = interpolate(badgeEntrance, [0, 1], [0, 1]);

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
        padding: "80px",
      }}
    >
      {/* Giant Central Glassmorphic Ticker Card */}
      <div
        style={{
          transform: `translateY(${containerTranslateY}px) scale(${containerScale})`,
          opacity: containerOpacity,
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)",
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          borderRadius: 44,
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow:
            "0 35px 90px rgba(0, 0, 0, 0.75), inset 0 1px 2px rgba(255, 255, 255, 0.25)",
          padding: "64px 84px",
          minWidth: 960,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Top Header Row with Label & Animated Profit Pill Badge */}
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
              fontSize: 36,
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            {label}
          </span>

          {/* Profit Badge with upward arrow */}
          <span
            style={{
              transform: `scale(${badgeScale})`,
              opacity: badgeOpacity,
              backgroundColor: "rgba(34, 197, 94, 0.16)",
              color: "#4ade80",
              border: "1px solid rgba(74, 222, 128, 0.35)",
              fontSize: 26,
              fontWeight: 700,
              padding: "8px 22px",
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 0 20px rgba(74, 222, 128, 0.25)",
            }}
          >
            <span>▲</span> {growthBadge}
          </span>
        </div>

        {/* Rolling Central Number Display */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums", // Prevents horizontal layout jitter as digits change
            textShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
          }}
        >
          {formattedValue}
        </div>

        {/* Footer Telemetry Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#71717a",
            fontSize: 22,
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 10px #22c55e",
            }}
          />
          {subtext}
        </div>
      </div>
    </div>
  );
};
