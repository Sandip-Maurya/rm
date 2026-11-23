import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FloatingBadgeProps } from "./types";

export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  category = "TOP RATED DEVELOPER TOOL",
  badgeTitle = "SOC 2 Type II Certified",
  ratingScore = "4.98",
  reviewCount = "2,400+ Enterprise Audits",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring (frames 0 - 24)
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 120 },
  });

  // Continuous Periodic Sine Motion (3-second seamless loop)
  // 90 frames at 30 FPS = exactly 3 seconds
  // Frequency: (frame / 90) * 2 * Math.PI ensures frame 0 and frame 90 match seamlessly!
  const loopProgress = (frame / 90) * 2 * Math.PI;

  // Primary vertical float oscillation (amplitude ±18px for video visibility)
  const floatY = Math.sin(loopProgress) * 18;

  // Subtle complementary rotation wobble (amplitude ±1.2deg)
  const floatRotate = Math.sin(loopProgress + Math.PI / 4) * 1.2;

  // Dynamic reactive shadow: expands and softens when floating up, contracts when down
  const shadowBlur = 36 + Math.sin(loopProgress) * 12;
  const shadowSpread = 4 - Math.sin(loopProgress) * 3;
  const shadowOffsetY = 38 - Math.sin(loopProgress) * 8;
  const shadowOpacity = 0.45 - Math.sin(loopProgress) * 0.12;

  // Subtle ambient pulse for the gold star / shield emblem
  const iconPulse = 1 + Math.sin(loopProgress * 2) * 0.04;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060913",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Background ambient radial aura */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, rgba(99, 102, 241, 0.08) 45%, rgba(0,0,0,0) 70%)",
          transform: `translate3d(0, ${floatY * 0.4}px, 0)`,
          pointerEvents: "none",
        }}
      />

      {/* Floating Badge Card Container */}
      <div
        style={{
          transform: `scale(${entrance}) translate3d(0, ${floatY}px, 0) rotate(${floatRotate}deg)`,
          opacity: entrance,
          display: "flex",
          alignItems: "center",
          gap: 36,
          padding: "36px 54px",
          borderRadius: 36,
          backgroundColor: "rgba(15, 23, 42, 0.88)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          backdropFilter: "blur(20px)",
          boxShadow: `0 ${shadowOffsetY}px ${shadowBlur}px ${shadowSpread}px rgba(0, 0, 0, ${shadowOpacity}), 0 0 40px rgba(234, 179, 8, 0.15)`,
        }}
      >
        {/* Golden Emblem / Shield Badge */}
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 28,
            background:
              "linear-gradient(135deg, #fbbf24 0%, #d97706 50%, #92400e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 12px 28px rgba(217, 119, 6, 0.4), inset 0 2px 4px rgba(255,255,255,0.4)",
            transform: `scale(${iconPulse})`,
            flexShrink: 0,
          }}
        >
          {/* Shield icon */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        {/* Text Information Stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 16px",
              borderRadius: 9999,
              backgroundColor: "rgba(234, 179, 8, 0.16)",
              border: "1px solid rgba(251, 191, 36, 0.35)",
              color: "#fde047",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              width: "fit-content",
            }}
          >
            ★ {category}
          </div>

          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#f8fafc",
              letterSpacing: "-0.02em",
            }}
          >
            {badgeTitle}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 4,
            }}
          >
            {/* Stars row */}
            <div style={{ display: "flex", gap: 4, color: "#fbbf24" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>

            <span
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "#ffffff",
              }}
            >
              {ratingScore}
            </span>

            <span style={{ color: "#475569", fontSize: 20 }}>•</span>

            <span
              style={{
                fontSize: 22,
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              {reviewCount}
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
