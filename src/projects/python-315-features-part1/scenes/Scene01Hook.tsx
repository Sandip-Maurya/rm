import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { PythonLogo } from "../components/PythonLogo";
import { THEME } from "../constants";
import { HOOK_COPY } from "../content/copy";

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Badge entrance
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  // Python logo float + pulse
  const logoSpring = spring({
    frame: frame - 10,
    fps,
    config: { damping: 10, mass: 0.6, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
      }}
    >
      <Background accentGlowColor={THEME.pythonYellow} />

      {/* Top Tag Pill */}
      <div
        style={{
          padding: "12px 28px",
          borderRadius: 999,
          backgroundColor: "rgba(250, 204, 21, 0.12)",
          border: `1.5px solid ${THEME.pythonYellow}60`,
          color: THEME.pythonYellow,
          fontFamily: "Inter, sans-serif",
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "0.1em",
          transform: `scale(${badgeSpring})`,
          opacity: badgeSpring,
          marginBottom: 40,
        }}
      >
        {HOOK_COPY.badge}
      </div>

      {/* Python Official Dual-Snake Emblem */}
      <div style={{ marginBottom: 46 }}>
        <PythonLogo size={190} delay={6} />
      </div>

      {/* Word-by-Word Kinetic Reveal (Practice 05) */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "18px 24px",
          maxWidth: 900,
          textAlign: "center",
          marginBottom: 36,
        }}
      >
        {HOOK_COPY.titleWords.map((word, index) => {
          const wordSpring = spring({
            frame: frame - 18 - index * 6,
            fps,
            config: { damping: 13, mass: 0.5 },
          });

          return (
            <span
              key={index}
              style={{
                display: "inline-block",
                fontFamily: "Inter, sans-serif",
                fontSize: 88,
                fontWeight: 900,
                color: index === 1 ? THEME.pythonYellow : THEME.textPrimary,
                textShadow: index === 1 ? `0 0 35px ${THEME.pythonYellow}60` : "none",
                transform: `translateY(${(1 - wordSpring) * 60}px) scale(${wordSpring})`,
                opacity: wordSpring,
                lineHeight: 1.1,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtitle Card */}
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 28,
          fontWeight: 600,
          color: THEME.textMuted,
          textAlign: "center",
          maxWidth: 800,
          opacity: spring({
            frame: frame - 42,
            fps,
            config: { damping: 15 },
          }),
        }}
      >
        {HOOK_COPY.subtitle}
      </div>
    </AbsoluteFill>
  );
};
