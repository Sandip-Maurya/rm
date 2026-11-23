import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import type { CursorClickProps } from "./types";

export const CursorClick: React.FC<CursorClickProps> = ({
  productTitle = "Cloud Infrastructure Pro Tier",
  price = "$249.00 / mo",
  buttonText = "Confirm & Deploy",
  successMessage = "Deployment Initiated Successfully!",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial Card Entrance (Frame 0 - 25)
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8 },
  });

  // Cursor glide interpolation:
  // Glides smoothly from bottom right [1550, 920] to the button center [960, 680] between frames 15 and 50
  const cursorX = interpolate(frame, [15, 52], [1550, 960], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cursorY = interpolate(frame, [15, 52], [920, 680], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor click down at frame 58
  const cursorPress = interpolate(frame, [57, 60, 66], [1, 0.86, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button compression & spring bounce back
  // Press starts at 58, releases at 62
  const buttonDepress = interpolate(frame, [58, 62], [1, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const buttonBounce = spring({
    frame: frame - 63,
    fps,
    config: { damping: 9, mass: 0.5, stiffness: 180 },
  });

  const buttonScale = frame < 63 ? buttonDepress : 0.92 + 0.08 * buttonBounce;

  // Ripple effect on button click (frame 59 - 85)
  const rippleProgress = interpolate(frame, [59, 82], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const rippleOpacity = interpolate(frame, [59, 75, 82], [0.6, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Success badge popup (trigger frame 68 onwards)
  const successEntrance = spring({
    frame: frame - 68,
    fps,
    config: { damping: 11, mass: 0.6, stiffness: 140 },
  });

  // Cursor moves away after click (frame 78 - 110)
  const cursorExitX = interpolate(frame, [78, 110], [0, 140], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cursorExitY = interpolate(frame, [78, 110], [0, 80], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const finalCursorX = cursorX + cursorExitX;
  const finalCursorY = cursorY + cursorExitY;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#080c14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(0,0,0,0) 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Checkout / Confirmation Card */}
      <div
        style={{
          width: 900,
          borderRadius: 32,
          padding: 60,
          backgroundColor: "rgba(17, 24, 39, 0.85)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 30px 80px -20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(59, 130, 246, 0.15)",
          transform: `scale(${cardEntrance})`,
          opacity: cardEntrance,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(59, 130, 246, 0.18)",
              border: "1px solid rgba(96, 165, 250, 0.35)",
              color: "#93c5fd",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            ORDER SUMMARY
          </div>
          <span style={{ color: "#64748b", fontSize: 24, fontWeight: 600 }}>
            Step 3 of 3
          </span>
        </div>

        {/* Product Spec */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            paddingTop: 12,
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            paddingBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#f8fafc",
                letterSpacing: "-0.02em",
              }}
            >
              {productTitle}
            </div>
            <div
              style={{
                fontSize: 24,
                color: "#94a3b8",
                marginTop: 8,
              }}
            >
              Includes 32 vCPU, 128 GB RAM &amp; Global Anycast CDN
            </div>
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#38bdf8",
              whiteSpace: "nowrap",
            }}
          >
            {price}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 96,
              borderRadius: 24,
              backgroundColor: "#2563eb",
              backgroundImage: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 15px 35px -5px rgba(37, 99, 235, 0.6), inset 0 1px 1px rgba(255,255,255,0.3)",
              transform: `scale(${buttonScale})`,
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {/* Click ripple animation */}
            {rippleProgress > 0 && rippleProgress < 1 && (
              <div
                style={{
                  position: "absolute",
                  width: rippleProgress * 700,
                  height: rippleProgress * 700,
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  opacity: rippleOpacity,
                  pointerEvents: "none",
                }}
              />
            )}

            <span
              style={{
                color: "#ffffff",
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              {buttonText}
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        </div>

        {/* Success Toast / Notification Card */}
        {frame >= 68 && (
          <div
            style={{
              marginTop: 8,
              padding: "20px 28px",
              borderRadius: 20,
              backgroundColor: "rgba(16, 185, 129, 0.16)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              transform: `scale(${successEntrance}) translateY(${interpolate(
                successEntrance,
                [0, 1],
                [20, 0]
              )}px)`,
              opacity: successEntrance,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                backgroundColor: "#10b981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div
                style={{
                  color: "#6ee7b7",
                  fontSize: 24,
                  fontWeight: 800,
                }}
              >
                {successMessage}
              </div>
              <div style={{ color: "#a7f3d0", fontSize: 18, marginTop: 2 }}>
                Cluster provisioning in us-east-1 • ETA 14s
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SVG Mouse Cursor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transform: `translate3d(${finalCursorX}px, ${finalCursorY}px, 0) scale(${cursorPress})`,
          transformOrigin: "4px 4px",
          pointerEvents: "none",
          filter: "drop-shadow(0 10px 14px rgba(0, 0, 0, 0.65))",
          zIndex: 100,
        }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 3L10.07 20.97L13.58 13.58L20.97 10.07L3 3Z"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
