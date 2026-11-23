import React from "react";
import { AbsoluteFill, interpolate, Easing, useCurrentFrame } from "remotion";
import type { ScreenWipeProps } from "./types";

export const ScreenWipe: React.FC<ScreenWipeProps> = ({
  scene1Headline = "Enterprise Intelligence Engine",
  scene1Subtext = "Phase 01: Real-time Data Ingestion & Stream Processing",
  scene2Headline = "Next-Gen Analytics Hub",
  scene2Subtext = "Phase 02: Multi-Model Inference & Live Decisioning",
}) => {
  const frame = useCurrentFrame();

  // Wipe transition from frame 25 to 55 with smooth cubic easing
  const progress = interpolate(frame, [25, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
  });

  // Ribbon translation: sweeps from off-screen left to off-screen right
  // We use extra margin (-150% to 150%) so with -15deg skew and wide ribbon it covers completely
  const ribbonX = interpolate(progress, [0, 1], [-160, 160]);

  // Reveal clip-path progress for Scene 2 (or clip-path based on skewed polygon)
  // Polygon coordinates for angled slice wiping from left to right:
  // At progress 0, cutoff is well to the left (< -20%). At progress 1, cutoff is well past right (> 120%).
  const clipCutoffTop = interpolate(progress, [0, 1], [-40, 140]);
  const clipCutoffBottom = clipCutoffTop - 25; // angled slope matching roughly skew -15deg

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030712",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* SCENE 1: Deep Indigo / Slate Theme */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #1e1b4b 0%, #090d16 80%)",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 9999,
            backgroundColor: "rgba(99, 102, 241, 0.15)",
            border: "1px solid rgba(129, 140, 248, 0.35)",
            color: "#a5b4fc",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              boxShadow: "0 0 12px #6366f1",
            }}
          />
          Architecture Review // Stage 01
        </div>

        <h1
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: "#f8fafc",
            textAlign: "center",
            maxWidth: 1400,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
          }}
        >
          {scene1Headline}
        </h1>

        <p
          style={{
            fontSize: 32,
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: 1000,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          {scene1Subtext}
        </p>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 40,
          }}
        >
          <div
            style={{
              padding: "20px 36px",
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 800, color: "#818cf8" }}>
              1.4M ops/s
            </div>
            <div style={{ fontSize: 20, color: "#64748b", marginTop: 4 }}>
              Throughput
            </div>
          </div>
          <div
            style={{
              padding: "20px 36px",
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 800, color: "#38bdf8" }}>
              &lt; 3.2 ms
            </div>
            <div style={{ fontSize: 20, color: "#64748b", marginTop: 4 }}>
              Avg Latency
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* SCENE 2: Revealed behind the angled cut */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 40%, #064e3b 0%, #022c22 40%, #02120d 90%)",
          padding: 80,
          clipPath: `polygon(0% 0%, ${clipCutoffTop}% 0%, ${clipCutoffBottom}% 100%, 0% 100%)`,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 9999,
            backgroundColor: "rgba(16, 185, 129, 0.18)",
            border: "1px solid rgba(52, 211, 153, 0.45)",
            color: "#6ee7b7",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 14px #10b981",
            }}
          />
          Live Production // Stage 02
        </div>

        <h1
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            maxWidth: 1400,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            textShadow: "0 4px 30px rgba(0,0,0,0.6)",
          }}
        >
          {scene2Headline}
        </h1>

        <p
          style={{
            fontSize: 32,
            color: "#a7f3d0",
            textAlign: "center",
            maxWidth: 1000,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          {scene2Subtext}
        </p>

        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 40,
          }}
        >
          <div
            style={{
              padding: "20px 36px",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              borderRadius: 16,
              border: "1px solid rgba(52, 211, 153, 0.25)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 800, color: "#34d399" }}>
              99.995%
            </div>
            <div style={{ fontSize: 20, color: "#6ee7b7", marginTop: 4 }}>
              Uptime SLA
            </div>
          </div>
          <div
            style={{
              padding: "20px 36px",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              borderRadius: 16,
              border: "1px solid rgba(52, 211, 153, 0.25)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 44, fontWeight: 800, color: "#fbbf24" }}>
              0 Zero-Downtime
            </div>
            <div style={{ fontSize: 20, color: "#6ee7b7", marginTop: 4 }}>
              Deploys
            </div>
          </div>
        </div>
      </AbsoluteFill>

      {/* SWEEPING ANGLE CUT RIBBON / COLOR SLICE OVERLAY */}
      {/* High-impact multi-layer neon energy divider bar along the cutting edge */}
      <div
        style={{
          position: "absolute",
          top: -200,
          bottom: -200,
          left: 0,
          width: 80,
          background: "linear-gradient(90deg, rgba(52,211,153,0.1), #34d399 40%, #ffffff 60%, rgba(99,102,241,0.8) 100%)",
          boxShadow: "0 0 60px 20px rgba(52, 211, 153, 0.7), 0 0 100px 40px rgba(99, 102, 241, 0.5)",
          transform: `translateX(calc(${ribbonX}vw)) skewX(-15deg)`,
          pointerEvents: "none",
          opacity: progress > 0.01 && progress < 0.99 ? 1 : 0,
        }}
      />
    </AbsoluteFill>
  );
};
