import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { WordByWordProps } from "./types";

export const WordByWord: React.FC<WordByWordProps> = ({
  text = "Stop Building Boring Dashboards Today",
  highlightWordIndex = 2, // highlights "Boring"
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

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
        padding: "80px",
      }}
    >
      {/* Decorative category label */}
      <div
        style={{
          color: "#38bdf8",
          fontSize: 48,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 48,
        }}
      >
        ✦ KINETIC HOOK
      </div>

      {/* Word-by-word staggered baseline reveal container */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "18px 26px",
          maxWidth: 920,
          textAlign: "center",
        }}
      >
        {words.map((word, index) => {
          // Practice 05 Math:
          // 4-frame offset per word, snappy social-media cadence
          const delay = index * 5;
          const currentWordFrame = frame - delay;

          const wordSpring = spring({
            frame: currentWordFrame,
            fps,
            config: { damping: 13, mass: 0.5, stiffness: 130 },
          });

          // Pops upward from clipped baseline (+70px -> 0px) and scales in
          const translateY = interpolate(wordSpring, [0, 1], [80, 0]);
          const scale = interpolate(wordSpring, [0, 1], [0.8, 1]);
          const opacity = interpolate(wordSpring, [0, 1], [0, 1]);

          const isHighlight = index === highlightWordIndex;

          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: "inline-block",
                overflow: "hidden", // ensures words emerge smoothly from baseline
                padding: "4px 8px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  transform: `translateY(${translateY}px) scale(${scale})`,
                  opacity,
                  color: isHighlight ? "#f43f5e" : "#ffffff",
                  fontSize: 88,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  textShadow: isHighlight
                    ? "0 10px 30px rgba(244, 63, 94, 0.4)"
                    : "0 10px 25px rgba(0, 0, 0, 0.5)",
                }}
              >
                {word}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
};
