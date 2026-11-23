import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CardFlipProps } from "./types";

export const CardFlip3D: React.FC<CardFlipProps> = ({
  cardType = "TITANIUM BLACK // METAL EDITION",
  frontNumber = "•••• •••• •••• 8492",
  frontHolder = "ALEXANDER CHEN",
  frontExpiry = "08 / 29",
  backCvv = "842",
  backLimit = "$150,000",
  backStatus = "VIP CONCIERGE ACTIVE",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card initial scale-in entrance (frames 0 -> 20)
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const entranceScale = interpolate(cardEntrance, [0, 1], [0.85, 1]);
  const entranceOpacity = interpolate(cardEntrance, [0, 1], [0, 1]);

  // Practice 17 Math:
  // CSS 3D perspective rotation around the Y-axis
  // Holds front face for reading until frame 28
  // Rotates 180 degrees smoothly across frames 28 -> 62 with cubic easing
  // Holds back face for reading from frame 62 -> 90
  const rotationY = interpolate(frame, [28, 62], [0, 180], {
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic light reflection shimmer sweeping across card face during the turn
  const sheenTranslateX = interpolate(frame, [28, 62], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        gap: 36,
      }}
    >
      {/* Category Eyebrow */}
      <div
        style={{
          color: "#38bdf8",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        ✦ 3D PERSPECTIVE INTERACTION
      </div>

      {/* 3D Perspective Viewport */}
      <div
        style={{
          width: 820,
          height: 480,
          perspective: 1200, // 3D Camera depth
          transform: `scale(${entranceScale})`,
          opacity: entranceOpacity,
        }}
      >
        {/* Flipping Card Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transform: `rotateY(${rotationY}deg)`,
          }}
        >
          {/* ========================================================= */}
          {/* FRONT FACE (rotateY: 0deg, backfaceVisibility: hidden)    */}
          {/* ========================================================= */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: 36,
              background:
                "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              boxShadow:
                "0 35px 90px rgba(0, 0, 0, 0.85), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
              padding: "48px 56px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            {/* Dynamic light reflection sheen */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: "60%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent)",
                transform: `translateX(${sheenTranslateX}%) skewX(-25deg)`,
                pointerEvents: "none",
              }}
            />

            {/* Front Top Bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#94a3b8", fontSize: 20, fontWeight: 700, letterSpacing: "0.1em" }}>
                {cardType}
              </div>
              {/* EMV Smart Chip */}
              <div
                style={{
                  width: 58,
                  height: 44,
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #fcd34d 0%, #b45309 100%)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "inset 0 0 4px rgba(0, 0, 0, 0.5)",
                }}
              />
            </div>

            {/* Card Number */}
            <div
              style={{
                color: "#ffffff",
                fontSize: 52,
                fontWeight: 700,
                letterSpacing: "0.14em",
                fontFamily:
                  '"JetBrains Mono", "SF Mono", Menlo, Consolas, monospace',
                textShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
              }}
            >
              {frontNumber}
            </div>

            {/* Front Bottom Details */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ color: "#64748b", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Cardholder
                </div>
                <div style={{ color: "#ffffff", fontSize: 28, fontWeight: 700, letterSpacing: "0.05em" }}>
                  {frontHolder}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#64748b", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Expires
                </div>
                <div style={{ color: "#ffffff", fontSize: 28, fontWeight: 700, letterSpacing: "0.05em" }}>
                  {frontExpiry}
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* BACK FACE (rotateY: 180deg, backfaceVisibility: hidden)   */}
          {/* ========================================================= */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: 36,
              background:
                "linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(2, 6, 23, 0.99) 100%)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              boxShadow:
                "0 35px 90px rgba(0, 0, 0, 0.85), 0 0 50px rgba(56, 189, 248, 0.15)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
              paddingBottom: 40,
            }}
          >
            {/* Magnetic Stripe */}
            <div
              style={{
                width: "100%",
                height: 72,
                backgroundColor: "#020617",
                marginTop: 36,
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            />

            {/* Signature & CVV Band */}
            <div style={{ padding: "0 56px", display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  flex: 1,
                  height: 52,
                  backgroundColor: "rgba(255, 255, 255, 0.85)",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  paddingRight: 16,
                  color: "#0f172a",
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 26,
                  fontWeight: 800,
                  letterSpacing: "0.1em",
                }}
              >
                CVV: {backCvv}
              </div>
            </div>

            {/* Back Details Grid */}
            <div
              style={{
                padding: "0 56px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ color: "#64748b", fontSize: 16, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Authorized Credit Line
                </div>
                <div style={{ color: "#38bdf8", fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em" }}>
                  {backLimit}
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "rgba(56, 189, 248, 0.15)",
                  color: "#38bdf8",
                  border: "1px solid rgba(56, 189, 248, 0.35)",
                  fontSize: 18,
                  fontWeight: 700,
                  padding: "8px 18px",
                  borderRadius: 9999,
                }}
              >
                {backStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
