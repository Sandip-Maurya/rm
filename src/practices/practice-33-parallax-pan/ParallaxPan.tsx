import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { ParallaxPanProps } from "./types";

export const ParallaxPan: React.FC<ParallaxPanProps> = ({
  headline = "DEEP MULTI-PLANE OPTICAL PARALLAX",
  badgeText = "CAMERA SYSTEMS // 2.5D DEPTH",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial title entrance
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // Camera Pan progression from frame 15 to 105 (3 seconds pan)
  const pan = interpolate(frame, [15, 105], [0, 1], {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Parallax Multi-Depth Offsets:
  // Layer 1 (Distant Background Star/Grid): moves slowly (-100px)
  // Layer 2 (Midground UI Cards & Metrics): moves at normal camera speed (-420px)
  // Layer 3 (Foreground Floating Macro Badge): rushes past camera with blur (-880px)
  const bgTranslateX = interpolate(pan, [0, 1], [0, -100]);
  const midTranslateX = interpolate(pan, [0, 1], [0, -420]);
  const foreTranslateX = interpolate(pan, [0, 1], [0, -880]);

  // Foreground macro blur and opacity dissipation as it rushes by
  const foreBlur = interpolate(pan, [0, 0.4, 0.9], [0, 4, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030611",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* =========================================================================
          LAYER 1: DISTANT BACKGROUND PLANE (moves -100px)
         ========================================================================= */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 2500,
          height: "100%",
          transform: `translate3d(${bgTranslateX}px, 0, 0)`,
          pointerEvents: "none",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Deep background galaxy spheres */}
        <div
          style={{
            position: "absolute",
            top: 150,
            left: 300,
            width: 700,
            height: 700,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 1400,
            width: 800,
            height: 800,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(0,0,0,0) 70%)",
          }}
        />
      </div>

      {/* Screen HUD Header Overlay (Fixed) */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 100,
          zIndex: 50,
          transform: `scale(${headerEntrance})`,
          opacity: headerEntrance,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 22px",
            borderRadius: 9999,
            backgroundColor: "rgba(56, 189, 248, 0.15)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#38bdf8",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#38bdf8",
              boxShadow: "0 0 10px #38bdf8",
            }}
          />
          {badgeText}
        </div>

        <h1
          style={{
            fontSize: 54,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            margin: 0,
            textShadow: "0 4px 20px rgba(0,0,0,0.8)",
          }}
        >
          {headline}
        </h1>
      </div>

      {/* =========================================================================
          LAYER 2: MIDGROUND PRIMARY CONTENT (moves -420px)
         ========================================================================= */}
      <div
        style={{
          position: "absolute",
          top: 230,
          left: 100,
          width: 2500,
          display: "flex",
          gap: 60,
          transform: `translate3d(${midTranslateX}px, 0, 0)`,
          zIndex: 20,
        }}
      >
        {/* Card 1: Data Pipeline Engine */}
        <div
          style={{
            width: 580,
            height: 600,
            borderRadius: 32,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                backgroundColor: "rgba(56, 189, 248, 0.2)",
                border: "1px solid #38bdf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            </div>

            <div style={{ fontSize: 38, fontWeight: 900, color: "#ffffff", marginBottom: 12 }}>
              Spatial Multi-Layer
            </div>
            <div style={{ fontSize: 22, color: "#94a3b8", lineHeight: 1.4 }}>
              Zero-friction optical depth rendering with independent focal velocity vectors.
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: "#38bdf8" }}>
              3.5x
            </span>
            <span style={{ fontSize: 20, color: "#64748b", marginLeft: 12 }}>
              Depth Multiplier
            </span>
          </div>
        </div>

        {/* Card 2: Neural Inference Node */}
        <div
          style={{
            width: 580,
            height: 600,
            borderRadius: 32,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                backgroundColor: "rgba(236, 72, 153, 0.2)",
                border: "1px solid #ec4899",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>

            <div style={{ fontSize: 38, fontWeight: 900, color: "#ffffff", marginBottom: 12 }}>
              Global CDN Mesh
            </div>
            <div style={{ fontSize: 22, color: "#94a3b8", lineHeight: 1.4 }}>
              High-concurrency edge video composition with automated spatial transformations.
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: "#ec4899" }}>
              &lt; 14 ms
            </span>
            <span style={{ fontSize: 20, color: "#64748b", marginLeft: 12 }}>
              Edge Latency
            </span>
          </div>
        </div>

        {/* Card 3: Enterprise Telemetry */}
        <div
          style={{
            width: 580,
            height: 600,
            borderRadius: 32,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "1.5px solid rgba(255, 255, 255, 0.12)",
            padding: "48px 44px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div>
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: 20,
                backgroundColor: "rgba(52, 211, 153, 0.2)",
                border: "1px solid #34d399",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <div style={{ fontSize: 38, fontWeight: 900, color: "#ffffff", marginBottom: 12 }}>
              Autonomous Health
            </div>
            <div style={{ fontSize: 22, color: "#94a3b8", lineHeight: 1.4 }}>
              Deterministic verification with real-time cluster health diagnostics.
            </div>
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
            <span style={{ fontSize: 44, fontWeight: 900, color: "#34d399" }}>
              99.999%
            </span>
            <span style={{ fontSize: 20, color: "#64748b", marginLeft: 12 }}>
              Verified SLA
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAYER 3: FOREGROUND MACRO PLANE (rushing past camera at -880px)
         ========================================================================= */}
      <div
        style={{
          position: "absolute",
          top: 380,
          left: 900,
          transform: `translate3d(${foreTranslateX}px, 0, 0)`,
          zIndex: 40,
          filter: `blur(${foreBlur}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            padding: "24px 44px",
            borderRadius: 28,
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "2px solid rgba(255, 255, 255, 0.35)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 30px 60px rgba(0,0,0,0.9), 0 0 40px rgba(99, 102, 241, 0.5)",
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor: "#a855f7",
              boxShadow: "0 0 16px #a855f7",
            }}
          />
          <span
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            ★ FOREGROUND CAMERA PLANE
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
