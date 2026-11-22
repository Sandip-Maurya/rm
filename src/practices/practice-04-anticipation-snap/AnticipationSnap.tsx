import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { AnticipationBadgeProps } from "./types";

export const AnticipationSnap: React.FC<AnticipationBadgeProps> = ({
  buttonText = "Launch Mission 🚀",
  sublabel = "T-minus zero: Anticipation & Snap Motion",
}) => {
  const frame = useCurrentFrame();

  // Practice 04 Math:
  // Disney Animation Principle: Rest/Hold -> Anticipation (pullback) -> Snap (rocket off-screen)
  // Frames 0 -> 40: Rests comfortably at 0px for viewers to read
  // Frames 40 -> 54: Pulls back slightly to the left (-50px) with horizontal compression
  // Frames 54 -> 76: Rockets completely off the right edge (+1600px) with velocity stretch
  const translateX = interpolate(
    frame,
    [0, 40, 54, 76],
    [0, 0, -50, 1600],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.12, 0.85, 0.2, 1),
    }
  );

  // Dynamic squash & stretch: neutral during hold, compresses on pullback, stretches when rocketing
  const scaleX = interpolate(
    frame,
    [0, 40, 54, 64, 76],
    [1.0, 1.0, 0.9, 1.25, 1.0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Fades in quickly, stays solid throughout the hold, exits cleanly once off-screen
  const opacity = interpolate(
    frame,
    [0, 10, 74, 80],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        gap: 36,
      }}
    >
      {/* Subtitle / context label */}
      <div
        style={{
          color: "#71717a",
          fontSize: 32,
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {sublabel}
      </div>

      {/* Pill Badge / Rocketing Button */}
      <div
        style={{
          transform: `translateX(${translateX}px) scaleX(${scaleX})`,
          opacity,
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          borderRadius: 36,
          padding: "36px 72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          boxShadow:
            "0 25px 60px rgba(59, 130, 246, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.35)",
          border: "2px solid rgba(255, 255, 255, 0.25)",
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {buttonText}
        </span>
      </div>
    </div>
  );
};
