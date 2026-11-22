import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { MaskedSlideUpProps } from "./types";

export const MaskedSlideUp: React.FC<MaskedSlideUpProps> = ({
  category = "ANNUAL REPORT 2026",
  line1 = "Quarterly Executive",
  line2 = "Strategic Review",
}) => {
  const frame = useCurrentFrame();

  // Practice 06 Math:
  // Masked slide-up timing with cubic-bezier editorial easing
  // Category line (frames 5 -> 25)
  const categoryY = interpolate(frame, [5, 25], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const categoryOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 1: Main editorial title (frames 10 -> 35)
  const line1Y = interpolate(frame, [10, 35], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Line 2: Staggered second line (frames 16 -> 42)
  const line2Y = interpolate(frame, [16, 42], [100, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Subtle accent line reveal from left to right (frames 25 -> 55)
  const lineWidth = interpolate(frame, [25, 55], [0, 120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0c0a09", // Warm editorial dark
        fontFamily:
          '"Playfair Display", "Georgia", "Times New Roman", serif',
        padding: "0 140px",
      }}
    >
      {/* Category Eyebrow in modern sans-serif */}
      <div
        style={{
          overflow: "hidden",
          height: 48,
          marginBottom: 16,
        }}
      >
        <span
          style={{
            display: "inline-block",
            transform: `translateY(${categoryY}%)`,
            opacity: categoryOpacity,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            color: "#e2b170", // Warm champagne gold
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {category}
        </span>
      </div>

      {/* Line 1 - Masked editorial container */}
      {/* Ample line-height and height (135px) prevents clipping descenders like g, y, p */}
      <div
        style={{
          overflow: "hidden",
          height: 135,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <h1
          style={{
            margin: 0,
            padding: 0,
            transform: `translateY(${line1Y}%)`,
            color: "#fafaf9",
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          {line1}
        </h1>
      </div>

      {/* Line 2 - Staggered masked editorial container */}
      <div
        style={{
          overflow: "hidden",
          height: 135,
          display: "flex",
          alignItems: "flex-end",
          marginBottom: 36,
        }}
      >
        <h1
          style={{
            margin: 0,
            padding: 0,
            transform: `translateY(${line2Y}%)`,
            color: "#a8a29e", // Elegant muted titanium
            fontSize: 104,
            fontWeight: 400,
            fontStyle: "italic",
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          {line2}
        </h1>
      </div>

      {/* Gold accent floor divider line */}
      <div
        style={{
          width: lineWidth,
          height: 4,
          backgroundColor: "#e2b170",
          borderRadius: 2,
        }}
      />
    </div>
  );
};
