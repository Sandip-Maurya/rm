import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE } from "../constants";
import { ConstellationBackground } from "../components/ConstellationBackground";

const LINE_ONE = ["Deployments", "shouldn't", "take"];
const LINE_TWO = ["half", "your", "afternoon."];

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Strikethrough animates right as narrator speaks "half your afternoon"
  const strikeProgress = interpolate(frame, [42, 66], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const lineTwoDim = interpolate(frame, [46, 68], [1, 0.48], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const renderWord = (word: string, index: number, baseDelay: number, color: string) => {
    const prog = spring({
      frame: frame - (baseDelay + index * 4),
      fps,
      config: { damping: 14, mass: 0.45, stiffness: 140 },
    });
    const y = interpolate(prog, [0, 1], [68, 0]);
    return (
      <span
        key={`${word}-${index}`}
        style={{
          display: "inline-block",
          overflow: "hidden",
          paddingBottom: 10,
          marginRight: 26,
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: `translateY(${y}px)`,
            opacity: prog,
            color,
          }}
        >
          {word}
        </span>
      </span>
    );
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bg,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Ambient radial indigo/cyan glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 42%, rgba(99, 102, 241, 0.16) 0%, rgba(9, 9, 11, 0) 62%)",
          pointerEvents: "none",
        }}
      />

      <ConstellationBackground opacity={0.95} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 1520,
        }}
      >
        {/* Top Kicker Badge */}
        <div
          style={{
            opacity: tagOpacity,
            padding: "10px 22px",
            borderRadius: 999,
            backgroundColor: "rgba(99, 102, 241, 0.12)",
            border: "1px solid rgba(99, 102, 241, 0.45)",
            color: PALETTE.cyan,
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            letterSpacing: 1.6,
            marginBottom: 34,
          }}
        >
          // CONTINUOUS DEPLOYMENT
        </div>

        {/* Line 1 */}
        <div
          style={{
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.08,
          }}
        >
          {LINE_ONE.map((w, i) => renderWord(w, i, 2, PALETTE.textPrimary))}
        </div>

        {/* Line 2 with animated SVG Strikethrough */}
        <div
          style={{
            position: "relative",
            display: "inline-block",
            fontSize: 104,
            fontWeight: 800,
            letterSpacing: -3,
            lineHeight: 1.12,
            marginTop: 8,
          }}
        >
          <div style={{ opacity: lineTwoDim }}>
            {LINE_TWO.map((w, i) => renderWord(w, i, 18, PALETTE.textPrimary))}
          </div>

          {strikeProgress > 0 && (
            <svg
              viewBox="0 0 980 60"
              style={{
                position: "absolute",
                left: -20,
                right: 0,
                top: "44%",
                width: "102%",
                height: 46,
                overflow: "visible",
                pointerEvents: "none",
              }}
            >
              <path
                d="M 8 34 Q 480 12 968 30"
                fill="none"
                stroke={PALETTE.coral}
                strokeWidth={14}
                strokeLinecap="round"
                strokeDasharray={1000}
                strokeDashoffset={1000 * (1 - strikeProgress)}
                style={{
                  filter: `drop-shadow(0 0 18px ${PALETTE.coral})`,
                }}
              />
            </svg>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
