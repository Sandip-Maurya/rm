import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { PulsingCalloutProps } from "./types";

export const PulsingCallout: React.FC<PulsingCalloutProps> = ({
  calloutTitle = "All-Time Peak Volume",
  calloutValue = "$9.42M",
  sublabel = "Record Breakout • Frame 45 Trigger",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Primary animation: Graph curve draws from left to right (frames 0 -> 45)
  const lineLength = 1100;
  const strokeOffset = interpolate(frame, [5, 45], [lineLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  // Practice 11 Math:
  // Secondary ripple animations triggered when primary animation completes (frame 45)
  const rippleTrigger = 45;
  const rippleFrame1 = Math.max(0, frame - rippleTrigger);
  const rippleFrame2 = Math.max(0, frame - (rippleTrigger + 10)); // 10-frame offset for 2nd radar ring

  // Core Beacon Pop-in Spring (frame 45)
  const beaconSpring = spring({
    frame: frame - rippleTrigger,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });
  const beaconScale = interpolate(beaconSpring, [0, 1], [0, 1]);
  const beaconOpacity = interpolate(beaconSpring, [0, 1], [0, 1]);

  // Radar Ring 1 (expands and fades)
  const isRing1Active = frame >= rippleTrigger;
  const ring1Scale = interpolate(rippleFrame1, [0, 32], [1, 3.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring1Opacity = interpolate(rippleFrame1, [0, 32], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Radar Ring 2 (delayed expanding ring)
  const isRing2Active = frame >= rippleTrigger + 10;
  const ring2Scale = interpolate(rippleFrame2, [0, 32], [1, 3.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ring2Opacity = interpolate(rippleFrame2, [0, 32], [0.9, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Callout Card entrance spring (appears alongside peak trigger)
  const cardSpring = spring({
    frame: frame - (rippleTrigger + 4),
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);
  const cardTranslateY = interpolate(cardSpring, [0, 1], [25, 0]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);

  // Peak coordinates on 1200x500 canvas
  const peakX = 860;
  const peakY = 120;

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
        padding: "80px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1400,
          background:
            "linear-gradient(145deg, rgba(24, 24, 27, 0.95) 0%, rgba(9, 9, 11, 0.95) 100%)",
          borderRadius: 36,
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 35px 90px rgba(0, 0, 0, 0.8)",
          padding: "54px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "#38bdf8", fontSize: 26, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              ✦ TELEMETRY BREAKPOINT
            </div>
            <div style={{ color: "#ffffff", fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em" }}>
              Dynamic Point-of-Interest Trigger
            </div>
          </div>
          <div style={{ color: "#71717a", fontSize: 22, fontWeight: 500 }}>
            {sublabel}
          </div>
        </div>

        {/* SVG Canvas Area */}
        <div style={{ position: "relative", width: "100%", height: 420 }}>
          <svg viewBox="0 0 1200 450" style={{ width: "100%", height: "100%", overflow: "visible" }}>
            <defs>
              <filter id="glow-callout" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Grid Reference Lines */}
            <line x1="40" y1="120" x2="1160" y2="120" stroke="rgba(56, 189, 248, 0.15)" strokeDasharray="4 6" strokeWidth="2" />
            <line x1="40" y1="260" x2="1160" y2="260" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="6 6" strokeWidth="2" />
            <line x1="40" y1="390" x2="1160" y2="390" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />

            {/* Trend line leading up to peak point */}
            <path
              d={`M 40 370 C 240 360, 380 290, 540 280 C 700 270, 760 140, ${peakX} ${peakY}`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow-callout)"
              strokeDasharray={lineLength}
              strokeDashoffset={strokeOffset}
            />

            {/* Pulsing Radar Ring 1 */}
            {isRing1Active && (
              <circle
                cx={peakX}
                cy={peakY}
                r="18"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                style={{
                  transformOrigin: `${peakX}px ${peakY}px`,
                  transform: `scale(${ring1Scale})`,
                  opacity: ring1Opacity,
                }}
              />
            )}

            {/* Pulsing Radar Ring 2 (delayed) */}
            {isRing2Active && (
              <circle
                cx={peakX}
                cy={peakY}
                r="18"
                fill="none"
                stroke="#60a5fa"
                strokeWidth="3"
                style={{
                  transformOrigin: `${peakX}px ${peakY}px`,
                  transform: `scale(${ring2Scale})`,
                  opacity: ring2Opacity,
                }}
              />
            )}

            {/* Core Glowing Dot */}
            <g
              style={{
                transformOrigin: `${peakX}px ${peakY}px`,
                transform: `scale(${beaconScale})`,
                opacity: beaconOpacity,
              }}
            >
              <circle cx={peakX} cy={peakY} r="18" fill="#38bdf8" opacity="0.4" />
              <circle cx={peakX} cy={peakY} r="9" fill="#ffffff" stroke="#38bdf8" strokeWidth="4" />
            </g>
          </svg>

          {/* Floating Callout Card positioned directly adjacent to peak */}
          <div
            style={{
              position: "absolute",
              left: "58%",
              top: "-15px",
              transform: `translateY(${cardTranslateY}px) scale(${cardScale})`,
              opacity: cardOpacity,
              background: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              borderRadius: 20,
              padding: "20px 28px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span style={{ color: "#94a3b8", fontSize: 20, fontWeight: 600, letterSpacing: "0.02em" }}>
              {calloutTitle}
            </span>
            <span style={{ color: "#38bdf8", fontSize: 46, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {calloutValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
