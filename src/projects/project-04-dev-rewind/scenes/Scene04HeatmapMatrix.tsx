import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WRAPPED } from "../constants";

const ROWS = 7;
const COLS = 16;

const INTENSITY_COLORS = [
  "rgba(168, 85, 247, 0.14)",
  "rgba(168, 85, 247, 0.42)",
  "#A855F7",
  "#EC4899",
  "#FACC15",
];

const getIntensity = (r: number, c: number): number => {
  const v = Math.abs(Math.sin(r * 13.7 + c * 29.3) * 43758.5) % 1;
  if (v < 0.14) return 0;
  if (v < 0.36) return 1;
  if (v < 0.62) return 2;
  if (v < 0.85) return 3;
  return 4;
};

export const Scene04HeatmapMatrix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

  const badgeSpring = spring({
    frame: frame - 70,
    fps,
    config: { damping: 10, mass: 0.55, stiffness: 130 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WRAPPED.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "190px 64px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 52%, rgba(236, 72, 153, 0.22) 0%, rgba(15, 7, 32, 0) 68%)",
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
          width: "100%",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: 56,
            opacity: headerSpring,
            transform: `translateY(${interpolate(headerSpring, [0, 1], [24, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: WRAPPED.magenta,
              letterSpacing: 2.5,
              marginBottom: 14,
            }}
          >
            365-DAY PULSE
          </div>
          <div
            style={{
              fontSize: 74,
              fontWeight: 900,
              color: WRAPPED.text,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            Your Year in Motion
          </div>
        </div>

        {/* 7x16 Manhattan Wave Heatmap */}
        <div
          style={{
            padding: 34,
            borderRadius: 30,
            backgroundColor: WRAPPED.surface,
            border: `2px solid ${WRAPPED.border}`,
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.55)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {Array.from({ length: ROWS }).map((_, r) => (
            <div key={r} style={{ display: "flex", gap: 12 }}>
              {Array.from({ length: COLS }).map((__, c) => {
                const delay = (r + c) * 1.6;
                const cellSpring = spring({
                  frame: frame - delay,
                  fps,
                  config: { damping: 12, mass: 0.35, stiffness: 150 },
                });
                const level = getIntensity(r, c);
                const bg = INTENSITY_COLORS[level] ?? INTENSITY_COLORS[0];

                return (
                  <div
                    key={c}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 10,
                      backgroundColor: bg,
                      transform: `scale(${cellSpring})`,
                      opacity: cellSpring,
                      boxShadow:
                        level === 4
                          ? "0 0 14px rgba(250, 204, 21, 0.5)"
                          : "none",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Final Congratulatory Badge */}
        <div
          style={{
            marginTop: 64,
            padding: "24px 48px",
            borderRadius: 999,
            background: `linear-gradient(135deg, ${WRAPPED.violet}, ${WRAPPED.magenta})`,
            border: `2px solid ${WRAPPED.gold}`,
            boxShadow: "0 20px 56px rgba(236, 72, 153, 0.48)",
            color: "#FFFFFF",
            fontSize: 42,
            fontWeight: 900,
            letterSpacing: 1,
            opacity: badgeSpring,
            transform: `scale(${interpolate(badgeSpring, [0, 1], [0.7, 1])})`,
          }}
        >
          ★ TOP 1% BUILDER
        </div>
      </div>
    </AbsoluteFill>
  );
};
