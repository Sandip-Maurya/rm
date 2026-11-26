import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ScreenGlareProps } from "./types";

/** Nested inner Remotion composition rendered live inside the 3D laptop display */
const EmbeddedDashboardComposition: React.FC<{ headline: string }> = ({
  headline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bars = [0.42, 0.68, 0.55, 0.88, 0.74, 0.96, 0.62, 0.84];
  const metricValue = Math.round(
    interpolate(frame, [0, 90], [12480, 94620], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  const pulse = 0.5 + 0.5 * Math.sin(frame * 0.16);

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(145deg, #070d1f 0%, #0f1b38 55%, #160c2e 100%)",
        padding: 44,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Top Navbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#34d399",
              boxShadow: `0 0 ${12 + pulse * 10}px #34d399`,
            }}
          />
          <span
            style={{
              color: "#e2e8f0",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            {headline}
          </span>
        </div>
        <div
          style={{
            padding: "6px 16px",
            borderRadius: 9999,
            backgroundColor: "rgba(56, 189, 248, 0.18)",
            border: "1px solid rgba(56, 189, 248, 0.45)",
            color: "#38bdf8",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          NESTED STREAM • {fps} FPS
        </div>
      </div>

      {/* Main KPI Row */}
      <div style={{ display: "flex", gap: 28 }}>
        <div
          style={{
            flex: 1.3,
            padding: 28,
            borderRadius: 24,
            backgroundColor: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <div style={{ fontSize: 18, color: "#94a3b8", fontWeight: 700 }}>
            ACTIVE THROUGHPUT
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#ffffff",
              marginTop: 8,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {metricValue.toLocaleString("en-US")}
          </div>
          <div style={{ fontSize: 20, color: "#34d399", fontWeight: 700, marginTop: 6 }}>
            ▲ +142.8% REAL-TIME COMPOSITOR
          </div>
        </div>

        <div
          style={{
            flex: 1,
            padding: 28,
            borderRadius: 24,
            backgroundColor: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(168, 85, 247, 0.3)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 18, color: "#d8b4fe", fontWeight: 700 }}>
            GPU PIPELINE LOAD
          </div>
          <div style={{ fontSize: 56, fontWeight: 900, color: "#c084fc" }}>
            {Math.round(72 + Math.sin(frame * 0.12) * 14)}%
          </div>
        </div>
      </div>

      {/* Animated Chart Area */}
      <div
        style={{
          height: 220,
          padding: "24px 32px",
          borderRadius: 24,
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "flex-end",
          gap: 20,
        }}
      >
        {bars.map((target, idx) => {
          const s = spring({
            frame: frame - idx * 3,
            fps,
            config: { damping: 14, mass: 0.6 },
          });
          const liveMod = 0.88 + 0.12 * Math.sin(frame * 0.14 + idx * 0.9);
          const barPct = target * s * liveMod * 100;
          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${barPct}%`,
                borderRadius: 12,
                background:
                  idx % 2 === 0
                    ? "linear-gradient(180deg, #38bdf8 0%, #6366f1 100%)"
                    : "linear-gradient(180deg, #f472b6 0%, #9333ea 100%)",
                boxShadow: "0 0 24px rgba(56, 189, 248, 0.35)",
              }}
            />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ScreenGlare: React.FC<ScreenGlareProps> = ({
  title = "3D Screen Replacement & Glass Glare",
  screenHeadline = "CLOUD TELEMETRY STUDIO",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Laptop chassis rotates smoothly into view
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.85, stiffness: 80 },
  });

  const rotateY = interpolate(entrance, [0, 1], [-36, -12]) + Math.sin(frame * 0.03) * 4;
  const rotateX = interpolate(entrance, [0, 1], [20, 8]);
  const translateY = interpolate(entrance, [0, 1], [120, 15]);
  const scale = interpolate(entrance, [0, 1], [0.76, 1]);

  // Diagonal translucent glass glare sweep across screen
  const glareX = interpolate(frame, [30, 75], [-150, 250], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Secondary subtle return sheen
  const glareOpacity = interpolate(frame, [28, 36, 68, 78], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 48%, #101933 0%, #050814 62%, #020308 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Header Overlay */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 80,
          opacity: entrance,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(56, 189, 248, 0.14)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#7dd3fc",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          CATEGORY J // PRACTICE 50
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
      </div>

      {/* 3D Perspective Stage */}
      <div
        style={{
          perspective: 1800,
          marginTop: 70,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Rotating Laptop Lid + Base Assembly */}
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
            opacity: entrance,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Laptop Screen Lid */}
          <div
            style={{
              width: 1080,
              height: 660,
              borderRadius: 32,
              background: "linear-gradient(145deg, #334155 0%, #1e293b 50%, #0f172a 100%)",
              padding: 18,
              boxShadow:
                "0 40px 100px rgba(0, 0, 0, 0.85), 0 0 60px rgba(56, 189, 248, 0.16), inset 0 2px 3px rgba(255,255,255,0.28)",
              border: "2px solid rgba(148, 163, 184, 0.35)",
              position: "relative",
            }}
          >
            {/* Webcam Notch */}
            <div
              style={{
                position: "absolute",
                top: 18,
                left: "50%",
                transform: "translateX(-50%)",
                width: 120,
                height: 20,
                backgroundColor: "#020617",
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  backgroundColor: "#1e3a8a",
                }}
              />
            </div>

            {/* Embedded Screen Replacement Viewport */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 18,
                overflow: "hidden",
                position: "relative",
                backgroundColor: "#050814",
                isolation: "isolate",
              }}
            >
              {/* Nested Sub-Composition */}
              <Sequence layout="none">
                <EmbeddedDashboardComposition headline={screenHeadline} />
              </Sequence>

              {/* Static Subtle Corner Glass Reflection */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(125deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 34%, rgba(255,255,255,0) 58%)",
                  mixBlendMode: "screen",
                  pointerEvents: "none",
                  zIndex: 14,
                }}
              />

              {/* Animated Diagonal Glass Glare Sweep */}
              <div
                style={{
                  position: "absolute",
                  top: "-25%",
                  left: 0,
                  width: "44%",
                  height: "150%",
                  transform: `translateX(${glareX}%) skewX(-30deg)`,
                  background:
                    "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 32%, rgba(255,255,255,0.58) 50%, rgba(255,255,255,0.2) 68%, rgba(255,255,255,0) 100%)",
                  mixBlendMode: "screen",
                  opacity: glareOpacity,
                  pointerEvents: "none",
                  zIndex: 15,
                }}
              />
            </div>
          </div>

          {/* Laptop Metallic Lower Keyboard Deck */}
          <div
            style={{
              width: 1180,
              height: 54,
              marginTop: -6,
              borderRadius: "8px 8px 28px 28px",
              background:
                "linear-gradient(180deg, #475569 0%, #1e293b 55%, #0f172a 100%)",
              borderTop: "2px solid rgba(255, 255, 255, 0.35)",
              boxShadow: "0 30px 60px rgba(0, 0, 0, 0.9)",
              transform: "rotateX(65deg)",
              transformOrigin: "top center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Thumb notch */}
            <div
              style={{
                width: 160,
                height: 10,
                borderRadius: 9999,
                backgroundColor: "rgba(2, 6, 23, 0.65)",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
