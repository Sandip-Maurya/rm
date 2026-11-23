import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { KaraokePillProps, WordTimestamp } from "./types";

const DEFAULT_WORDS: WordTimestamp[] = [
  { text: "Build", start: 10, end: 24 },
  { text: "videos", start: 25, end: 42 },
  { text: "programmatically", start: 43, end: 72 },
  { text: "with", start: 73, end: 84 },
  { text: "React", start: 85, end: 100 },
  { text: "and", start: 101, end: 110 },
  { text: "code", start: 111, end: 125 },
];

export const KaraokePill: React.FC<KaraokePillProps> = ({
  speaker = "ALEX CHEN // CO-FOUNDER",
  words = DEFAULT_WORDS,
}) => {
  const frame = useCurrentFrame();

  // Find currently active word index based on frame
  let activeIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (frame >= words[i].start && frame <= words[i].end) {
      activeIndex = i;
      break;
    } else if (frame > words[i].end) {
      activeIndex = i;
    }
  }

  // Smooth floating pill position tracker based on active index
  // We compute approximate horizontal offsets for a 2-line layout
  // Line 1: Build videos programmatically with
  // Line 2: React and code
  const wordLayouts = useMemo(() => {
    return [
      { line: 0, width: 170 }, // Build
      { line: 0, width: 220 }, // videos
      { line: 0, width: 520 }, // programmatically
      { line: 1, width: 150 }, // with
      { line: 1, width: 200 }, // React
      { line: 1, width: 140 }, // and
      { line: 1, width: 180 }, // code
    ];
  }, []);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05070e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "100px 60px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.18) 0%, rgba(99, 102, 241, 0.1) 40%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Speaker Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 24px",
          borderRadius: 9999,
          backgroundColor: "rgba(168, 85, 247, 0.16)",
          border: "1px solid rgba(192, 132, 252, 0.35)",
          color: "#d8b4fe",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 80,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#a855f7",
            boxShadow: "0 0 14px #a855f7",
          }}
        />
        {speaker}
      </div>

      {/* Dynamic Subtitle Words Wrap Container */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px 28px",
          maxWidth: 960,
          lineHeight: 1.3,
        }}
      >
        {words.map((item, idx) => {
          const isActive = frame >= item.start && frame <= item.end;
          const isSpoken = frame > item.end;

          // Scale bounce when word becomes active
          const wordProgress = interpolate(
            frame,
            [item.start, item.start + 6, item.end],
            [1.0, 1.12, 1.0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          // Pill highlight opacity & glow
          const pillGlow = isActive
            ? "0 0 35px rgba(168, 85, 247, 0.55), 0 10px 25px rgba(0,0,0,0.5)"
            : "none";

          return (
            <div
              key={idx}
              style={{
                position: "relative",
                padding: "16px 28px",
                borderRadius: 24,
                backgroundColor: isActive
                  ? "#a855f7"
                  : isSpoken
                  ? "rgba(255, 255, 255, 0.08)"
                  : "transparent",
                border: isActive
                  ? "2px solid #e9d5ff"
                  : "2px solid transparent",
                boxShadow: pillGlow,
                transform: `scale(${isActive ? wordProgress : 1})`,
                transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 56,
                  fontWeight: 900,
                  letterSpacing: "-0.02em",
                  color: isActive
                    ? "#ffffff"
                    : isSpoken
                    ? "#f8fafc"
                    : "rgba(255, 255, 255, 0.35)",
                  textShadow: isActive
                    ? "0 2px 10px rgba(0,0,0,0.5)"
                    : "none",
                }}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom Live Audio Wave Meter Indicator */}
      <div
        style={{
          marginTop: 100,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((bar) => {
          const isSpeaking = activeIndex >= 0 && activeIndex < words.length;
          const barHeight = isSpeaking
            ? 20 + Math.abs(Math.sin((frame * 0.25) + bar * 0.8)) * 36
            : 8;

          return (
            <div
              key={bar}
              style={{
                width: 8,
                height: barHeight,
                borderRadius: 9999,
                backgroundColor: isSpeaking ? "#c084fc" : "#475569",
                boxShadow: isSpeaking
                  ? "0 0 12px rgba(192, 132, 252, 0.7)"
                  : "none",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
