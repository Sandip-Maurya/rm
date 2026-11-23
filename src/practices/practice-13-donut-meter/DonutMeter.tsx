import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { DonutMeterProps } from "./types";

export const DonutMeter: React.FC<DonutMeterProps> = ({
  label = "SYSTEM EFFICIENCY",
  targetPercent = 84,
  subtext = "Optimal Operating Range",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container pop-in spring (frames 0 -> 24)
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });
  const containerScale = interpolate(containerEntrance, [0, 1], [0.85, 1]);
  const containerOpacity = interpolate(containerEntrance, [0, 1], [0, 1]);

  // Practice 13 Math:
  // Circular SVG Trigonometry:
  // Radius = 190, Circumference = 2 * PI * 190 ≈ 1193.8
  const radius = 190;
  const strokeWidth = 32;
  const circumference = 2 * Math.PI * radius;

  // Percentage value interpolation (frames 10 -> 55)
  const currentPercent = interpolate(frame, [10, 55], [0, targetPercent], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const targetOffset = circumference * (1 - targetPercent / 100);
  const currentOffset = interpolate(frame, [10, 55], [circumference, targetOffset], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Integer rounded percentage display to prevent decimals
  const displayPercent = Math.round(currentPercent);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "40px",
      }}
    >
      {/* 1:1 Square Chassis Card */}
      <div
        style={{
          transform: `scale(${containerScale})`,
          opacity: containerOpacity,
          width: 820,
          height: 820,
          background:
            "linear-gradient(145deg, rgba(24, 24, 27, 0.95) 0%, rgba(9, 9, 11, 0.95) 100%)",
          backdropFilter: "blur(24px)",
          borderRadius: 48,
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow:
            "0 35px 90px rgba(0, 0, 0, 0.8), 0 0 80px rgba(56, 189, 248, 0.08)",
          padding: "50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Top Label */}
        <div
          style={{
            color: "#38bdf8",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          ✦ {label}
        </div>

        {/* Circular Dial SVG Canvas */}
        <div style={{ position: "relative", width: 480, height: 480 }}>
          <svg
            width="480"
            height="480"
            viewBox="0 0 480 480"
            style={{
              // Rotating by -90deg so progress starts at 12 o'clock (top) instead of 3 o'clock (right)
              transform: "rotate(-90deg)",
              overflow: "visible",
            }}
          >
            <defs>
              {/* Neon cyan gradient along stroke */}
              <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              {/* Stroke glow */}
              <filter id="donutGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Muted Track */}
            <circle
              cx="240"
              cy="240"
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth={strokeWidth}
            />

            {/* Animated Filling Progress Ring */}
            <circle
              cx="240"
              cy="240"
              r={radius}
              fill="none"
              stroke="url(#donutGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={currentOffset}
              filter="url(#donutGlow)"
            />
          </svg>

          {/* Centered Number Readout */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                color: "#ffffff",
                fontSize: 110,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <span>{displayPercent}</span>
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#38bdf8",
                  marginLeft: 4,
                  marginTop: 8,
                }}
              >
                %
              </span>
            </div>
          </div>
        </div>

        {/* Footer Subtitle */}
        <div
          style={{
            marginTop: 28,
            color: "#a1a1aa",
            fontSize: 24,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 10px #22c55e",
            }}
          />
          {subtext}
        </div>
      </div>
    </div>
  );
};
