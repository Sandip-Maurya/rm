import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WRAPPED } from "../constants";

const TITLE_CHARS = "2026 REWIND".split("");

const KARAOKE_WORDS = [
  { text: "Your", start: 4, end: 14 },
  { text: "2026", start: 14, end: 28 },
  { text: "Developer", start: 28, end: 48 },
  { text: "Rewind", start: 48, end: 64 },
  { text: "is in.", start: 64, end: 88 },
];

export const Scene01KineticHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 130 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WRAPPED.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "200px 72px",
        boxSizing: "border-box",
      }}
    >
      {/* Ambient Neon Radial */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 42%, rgba(236, 72, 153, 0.24) 0%, rgba(168, 85, 247, 0.14) 38%, rgba(15, 7, 32, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: "12px 28px",
            borderRadius: 999,
            backgroundColor: "rgba(250, 204, 21, 0.14)",
            border: `1.5px solid ${WRAPPED.gold}`,
            color: WRAPPED.gold,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 2,
            marginBottom: 48,
            opacity: badgeSpring,
            transform: `scale(${interpolate(badgeSpring, [0, 1], [0.8, 1])})`,
          }}
        >
          WRAPPED EDITION
        </div>

        {/* Kinetic Character Wave Headline */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: -3,
            lineHeight: 1.05,
            marginBottom: 64,
          }}
        >
          {TITLE_CHARS.map((ch, idx) => {
            const cSpring = spring({
              frame: frame - idx * 2,
              fps,
              config: { damping: 11, mass: 0.4, stiffness: 140 },
            });
            const waveY =
              cSpring >= 0.92 ? Math.sin(frame * 0.14 + idx * 0.55) * 10 : 0;
            const y = interpolate(cSpring, [0, 1], [55, 0]) + waveY;

            return (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  minWidth: ch === " " ? 28 : undefined,
                  transform: `translateY(${y}px) scale(${cSpring})`,
                  opacity: cSpring,
                  background: `linear-gradient(135deg, #FFFFFF 15%, ${WRAPPED.magenta} 65%, ${WRAPPED.gold} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* Karaoke Word Pill Tracker */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 16,
            maxWidth: 860,
          }}
        >
          {KARAOKE_WORDS.map((w) => {
            const isActive = frame >= w.start && frame < w.end;
            const isPast = frame >= w.end;

            return (
              <span
                key={w.text}
                style={{
                  padding: "14px 26px",
                  borderRadius: 999,
                  fontSize: 44,
                  fontWeight: 800,
                  backgroundColor: isActive
                    ? WRAPPED.magenta
                    : "rgba(255,255,255,0.06)",
                  border: isActive
                    ? `2px solid ${WRAPPED.gold}`
                    : "2px solid transparent",
                  color: isActive
                    ? "#FFFFFF"
                    : isPast
                      ? "rgba(250, 245, 255, 0.8)"
                      : "rgba(250, 245, 255, 0.35)",
                  boxShadow: isActive
                    ? "0 10px 32px rgba(236, 72, 153, 0.5)"
                    : "none",
                  transform: `scale(${isActive ? 1.07 : 1})`,
                }}
              >
                {w.text}
              </span>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
