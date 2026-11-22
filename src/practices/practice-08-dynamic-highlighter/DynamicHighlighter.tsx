import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { DynamicHighlighterProps } from "./types";

export const DynamicHighlighter: React.FC<DynamicHighlighterProps> = ({
  prefixText = "Ship video apps",
  highlightedText = "10x Faster",
  suffixText = "with Remotion",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Sentence fade & slight rise (frames 0 -> 20)
  const textEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const textTranslateY = interpolate(textEntrance, [0, 1], [30, 0]);
  const textOpacity = interpolate(textEntrance, [0, 1], [0, 1]);

  // Practice 08 Math:
  // Sweeping fluorescent highlighter animation (frames 22 -> 45)
  // Behind the keyword, width: 0% -> 100%
  const highlightWidth = interpolate(frame, [22, 45], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Dynamic hand-drawn marker tilt / skew
  const highlightSkew = interpolate(frame, [22, 45], [-4, -2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Secondary hand-drawn scribble SVG underline draw-in (frames 35 -> 58)
  const scribbleLength = 320;
  const scribbleOffset = interpolate(frame, [35, 58], [scribbleLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

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
      {/* Category Eyebrow */}
      <div
        style={{
          color: "#a1a1aa",
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginBottom: 40,
        }}
      >
        ✦ PRODUCT HIGHLIGHT
      </div>

      {/* Main Sentence */}
      <div
        style={{
          transform: `translateY(${textTranslateY}px)`,
          opacity: textOpacity,
          color: "#ffffff",
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: "-0.03em",
          lineHeight: 1.25,
          textAlign: "center",
          maxWidth: 1500,
        }}
      >
        <span>{prefixText} </span>

        {/* Highlighted Keyword Container */}
        <span
          style={{
            position: "relative",
            display: "inline-block",
            color: "#ffffff",
            padding: "0 12px",
            margin: "0 4px",
            zIndex: 1, // Keeps text strictly in front of the highlighter background
          }}
        >
          {highlightedText}

          {/* Sweeping Fluorescent Highlighter Stroke (Behind Text) */}
          <span
            style={{
              position: "absolute",
              top: "12%",
              left: 0,
              width: `${highlightWidth}%`,
              height: "82%",
              backgroundColor: "rgba(250, 204, 21, 0.88)", // Bright fluorescent yellow marker
              borderRadius: "8px 14px 10px 16px", // Organic marker tip look
              transform: `skewX(${highlightSkew}deg)`,
              transformOrigin: "left center",
              zIndex: -1, // Sits strictly behind the typography
              boxShadow: "0 0 25px rgba(250, 204, 21, 0.5)",
            }}
          />

          {/* Hand-drawn SVG marker underline accent */}
          <svg
            width="100%"
            height="18"
            viewBox="0 0 320 18"
            style={{
              position: "absolute",
              left: 0,
              bottom: -18,
              overflow: "visible",
            }}
          >
            <path
              d="M 4 8 Q 80 16, 160 10 T 316 8"
              fill="none"
              stroke="#facc15"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={scribbleLength}
              strokeDashoffset={scribbleOffset}
            />
          </svg>
        </span>

        <span> {suffixText}</span>
      </div>
    </div>
  );
};
