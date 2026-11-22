import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { THEME } from "../constants";
import { OUTRO_COPY } from "../content/copy";

export const Scene05Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ctaSpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 11, mass: 0.5, stiffness: 120 },
  });

  const part2Pills = [
    { label: "🌍 UTF-8 Default", color: THEME.pythonBlue },
    { label: "🚀 Improved JIT", color: THEME.pythonYellow },
    { label: "🔬 Tachyon Profiler", color: THEME.pythonGreen },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        gap: 36,
      }}
    >
      <Background accentGlowColor="#a855f7" />

      {/* Outro Headline Reveal */}
      <div
        style={{
          display: "flex",
          gap: 20,
        }}
      >
        {OUTRO_COPY.headlineWords.map((word, index) => {
          const wordSpring = spring({
            frame: frame - index * 6,
            fps,
            config: { damping: 12, mass: 0.5 },
          });

          return (
            <span
              key={index}
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: 72,
                fontWeight: 900,
                color: index === 1 ? THEME.pythonYellow : THEME.textPrimary,
                transform: `scale(${wordSpring}) translateY(${(1 - wordSpring) * 30}px)`,
                opacity: wordSpring,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 26,
          color: THEME.textMuted,
          textAlign: "center",
        }}
      >
        {OUTRO_COPY.question}
      </div>

      {/* Part 2 Preview Cards */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          width: "100%",
          maxWidth: 640,
          margin: "16px 0",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            fontWeight: 800,
            color: THEME.textDim,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Coming In Part 2
        </span>

        {part2Pills.map((pill, idx) => {
          const pillSpring = spring({
            frame: frame - 14 - idx * 5,
            fps,
            config: { damping: 13, mass: 0.4 },
          });

          return (
            <div
              key={idx}
              style={{
                padding: "18px 28px",
                borderRadius: 18,
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: `1px solid ${pill.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transform: `translateX(${(1 - pillSpring) * -40}px)`,
                opacity: pillSpring,
              }}
            >
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: THEME.textPrimary,
                }}
              >
                {pill.label}
              </span>
              <span style={{ color: pill.color, fontSize: 20 }}>➔</span>
            </div>
          );
        })}
      </div>

      {/* Big Action CTA Pill */}
      <div
        style={{
          padding: "20px 48px",
          borderRadius: 999,
          background: `linear-gradient(135deg, ${THEME.pythonBlue} 0%, #0284c7 100%)`,
          boxShadow: `0 14px 40px rgba(56, 189, 248, 0.5)`,
          color: "#ffffff",
          fontFamily: "Inter, sans-serif",
          fontSize: 26,
          fontWeight: 900,
          letterSpacing: "0.04em",
          transform: `scale(${ctaSpring})`,
          opacity: ctaSpring,
        }}
      >
        {OUTRO_COPY.cta}
      </div>
    </AbsoluteFill>
  );
};
