import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { KeyframeBannerProps } from "./types";

export const KeyframeBanner: React.FC<KeyframeBannerProps> = ({
  badgeText = "BREAKING NEWS",
  headline = "Major AI Breakthrough Announced",
  subheadline = "New generative motion model achieves real-time interactive rendering",
}) => {
  const frame = useCurrentFrame();

  // Practice 03 Math:
  // Multi-point piecewise array interpolation with strict clamping:
  // Enter (0 -> 20), Hold rock-solid (20 -> 120), Exit (120 -> 140)
  const translateX = interpolate(
    frame,
    [0, 20, 120, 140],
    [-2200, 0, 0, 2200],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  const opacity = interpolate(
    frame,
    [0, 10, 125, 140],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Pulsing live red dot animation during hold (frames 20 - 120)
  // Sinusoidal opacity oscillation between 0.4 and 1.0
  const pulseOpacity = 0.7 + Math.sin(frame * 0.25) * 0.3;
  const pulseScale = 1 + Math.sin(frame * 0.25) * 0.15;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-start",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "80px 100px",
      }}
    >
      <div
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          background:
            "linear-gradient(135deg, rgba(24, 24, 27, 0.96) 0%, rgba(9, 9, 11, 0.96) 100%)",
          borderLeft: "14px solid #ef4444",
          borderTop: "1px solid rgba(255, 255, 255, 0.16)",
          borderRight: "1px solid rgba(255, 255, 255, 0.16)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
          borderRadius: 28,
          boxShadow:
            "0 35px 80px rgba(0, 0, 0, 0.85), 0 0 60px rgba(239, 68, 68, 0.22)",
          padding: "54px 72px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 1720,
          width: "100%",
        }}
      >
        {/* Top bar with pulsing live red dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Outer radar glow */}
            <div
              style={{
                position: "absolute",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                opacity: pulseOpacity * 0.45,
                transform: `scale(${pulseScale * 1.6})`,
              }}
            />
            {/* Core dot */}
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                backgroundColor: "#ef4444",
                opacity: pulseOpacity,
              }}
            />
          </div>

          <span
            style={{
              color: "#ef4444",
              fontSize: 36,
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {badgeText}
          </span>
          <span style={{ color: "#52525b", fontSize: 32 }}>•</span>
          <span style={{ color: "#a1a1aa", fontSize: 32, fontWeight: 500 }}>
            LIVE FEED
          </span>
        </div>

        {/* Main Headline */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 82,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {headline}
        </div>

        {/* Subheadline / details */}
        <div
          style={{
            color: "#d4d4d8",
            fontSize: 42,
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
          }}
        >
          {subheadline}
        </div>
      </div>
    </div>
  );
};
