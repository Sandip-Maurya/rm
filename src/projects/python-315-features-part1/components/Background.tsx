import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { THEME } from "../constants";

export const Background: React.FC<{ accentGlowColor?: string }> = ({
  accentGlowColor = THEME.pythonBlue,
}) => {
  const frame = useCurrentFrame();

  // Subtle breathing radial glow
  const glowOpacity = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [0.18, 0.32],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        overflow: "hidden",
      }}
    >
      {/* Background Grid Pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.7,
        }}
      />

      {/* Top Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 900,
          height: 600,
          background: `radial-gradient(circle, ${accentGlowColor} 0%, transparent 70%)`,
          opacity: glowOpacity,
          filter: "blur(90px)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom Subtle Depth Glow */}
      <div
        style={{
          position: "absolute",
          bottom: -250,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 500,
          background: `radial-gradient(circle, ${THEME.pythonYellow} 0%, transparent 70%)`,
          opacity: glowOpacity * 0.5,
          filter: "blur(110px)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
