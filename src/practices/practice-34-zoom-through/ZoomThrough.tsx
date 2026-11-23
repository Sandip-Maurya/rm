import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { ZoomThroughProps } from "./types";

export const ZoomThrough: React.FC<ZoomThroughProps> = ({
  deviceLabel = "MOBILE CLIENT VIEW // STAGE 01",
  destinationLabel = "GLOBAL OPERATIONS COMMAND // STAGE 02",
}) => {
  const frame = useCurrentFrame();

  // Exponential Zoom Dive from Frame 40 to 80
  const diveProgress = interpolate(frame, [40, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.6, 0.0, 0.8, 1.0), // Aggressive exponential launch into the screen!
  });

  // Camera scale: 1.0x -> 16.0x straight into the phone display
  const cameraScale = interpolate(diveProgress, [0, 1], [1, 16]);

  // Scene A (Phone Mockup) alpha fadeout as it expands past lens
  const sceneAOpacity = interpolate(frame, [68, 76], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene B (Full-Screen Control Dashboard) reveals as camera penetrates screen
  const sceneBOpacity = interpolate(frame, [72, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene B counter scale (settles from 1.35x down to 1.0x)
  const sceneBScale = interpolate(frame, [72, 100], [1.35, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
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
          SCENE A: SMARTPHONE MOCKUP (EXPONENTIALLY ZOOMS THROUGH LENS)
         ========================================================================= */}
      {frame < 80 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${cameraScale})`,
            transformOrigin: "50% 50%", // Targets phone display center
            opacity: sceneAOpacity,
          }}
        >
          {/* External Device Label */}
          <div
            style={{
              position: "absolute",
              top: 60,
              fontSize: 22,
              fontWeight: 800,
              color: "#64748b",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {deviceLabel}
          </div>

          {/* Smartphone Hardware Frame */}
          <div
            style={{
              width: 420,
              height: 780,
              backgroundColor: "#161b26",
              borderRadius: 64,
              border: "6px solid #2d3748",
              padding: 16,
              boxShadow:
                "0 40px 100px -20px rgba(0,0,0,0.95), 0 0 50px rgba(56, 189, 248, 0.15)",
              position: "relative",
            }}
          >
            {/* Notch */}
            <div
              style={{
                position: "absolute",
                top: 24,
                left: "50%",
                transform: "translateX(-50%)",
                width: 140,
                height: 28,
                backgroundColor: "#000000",
                borderRadius: 14,
                zIndex: 30,
              }}
            />

            {/* Inner Phone Screen */}
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#090d16",
                borderRadius: 48,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 30,
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 22,
                  background:
                    "linear-gradient(135deg, #38bdf8 0%, #3b82f6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 30px rgba(56, 189, 248, 0.5)",
                  marginBottom: 24,
                }}
              >
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: "#ffffff",
                  textAlign: "center",
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                }}
              >
                Infinite Portal
              </div>

              <div
                style={{
                  fontSize: 18,
                  color: "#94a3b8",
                  textAlign: "center",
                  maxWidth: 260,
                  lineHeight: 1.35,
                }}
              >
                Camera diving into target viewport coordinates
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* =========================================================================
          SCENE B: FULL-SCREEN GLOBAL OPERATIONS DASHBOARD
         ========================================================================= */}
      {frame >= 72 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 100px",
            background:
              "radial-gradient(circle at 50% 50%, #0c1830 0%, #030611 80%)",
            opacity: sceneBOpacity,
            transform: `scale(${sceneBScale})`,
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 24px",
              borderRadius: 9999,
              backgroundColor: "rgba(56, 189, 248, 0.16)",
              border: "1px solid rgba(56, 189, 248, 0.4)",
              color: "#38bdf8",
              fontSize: 22,
              fontWeight: 800,
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
                backgroundColor: "#38bdf8",
                boxShadow: "0 0 14px #38bdf8",
              }}
            />
            {destinationLabel}
          </div>

          <h1
            style={{
              fontSize: 84,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              textAlign: "center",
              margin: "0 0 24px 0",
              textShadow: "0 4px 30px rgba(0,0,0,0.8)",
            }}
          >
            Universal Command Mesh
          </h1>

          <p
            style={{
              fontSize: 30,
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: 1000,
              lineHeight: 1.4,
              margin: "0 0 60px 0",
            }}
          >
            Seamless infinite zoom-through transition completed with zero edge clipping.
          </p>

          {/* 3 Large Telemetry Metrics */}
          <div style={{ display: "flex", gap: 50 }}>
            <div
              style={{
                padding: "36px 60px",
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                borderRadius: 24,
                border: "1.5px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 900, color: "#38bdf8" }}>
                16.0x
              </div>
              <div style={{ fontSize: 20, color: "#64748b", marginTop: 8 }}>
                Optical Dive Depth
              </div>
            </div>

            <div
              style={{
                padding: "36px 60px",
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                borderRadius: 24,
                border: "1.5px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 900, color: "#34d399" }}>
                0ms
              </div>
              <div style={{ fontSize: 20, color: "#64748b", marginTop: 8 }}>
                Cut Latency
              </div>
            </div>

            <div
              style={{
                padding: "36px 60px",
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                borderRadius: 24,
                border: "1.5px solid rgba(255, 255, 255, 0.1)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 64, fontWeight: 900, color: "#ec4899" }}>
                100%
              </div>
              <div style={{ fontSize: 20, color: "#64748b", marginTop: 8 }}>
                Viewport Alignment
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
