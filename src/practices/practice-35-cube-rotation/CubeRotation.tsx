import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CubeRotationProps } from "./types";

export const CubeRotation: React.FC<CubeRotationProps> = ({
  face1Title = "FRONT STAGE // INGESTION",
  face1Metric = "1.4M Events / sec",
  face2Title = "RIGHT STAGE // ANALYTICS",
  face2Metric = "99.995% Uptime SLA",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // 3D Cube Rotation Trigger at Frame 45
  // Rotates 90 degrees around Y-axis (0deg -> -90deg)
  const rotateSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 14, mass: 0.85, stiffness: 80 },
  });

  const cubeAngleY = interpolate(rotateSpring, [0, 1], [0, -90]);

  // Subtle isometric tilt on X and Z axis
  const isometricTiltX = 12;

  // Cube dimensions
  const cubeSize = 700;
  const halfSize = cubeSize / 2;

  // Face dynamic shading based on rotateSpring (0 -> 1)
  const face1Brightness = interpolate(rotateSpring, [0, 1], [1.0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const face2Brightness = interpolate(rotateSpring, [0, 1], [0.35, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030611",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.08) 50%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header Info */}
      <div
        style={{
          position: "absolute",
          top: 60,
          textAlign: "center",
          zIndex: 100,
          transform: `scale(${entrance})`,
          opacity: entrance,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            borderRadius: 9999,
            backgroundColor: "rgba(99, 102, 241, 0.16)",
            border: "1px solid rgba(129, 140, 248, 0.4)",
            color: "#a5b4fc",
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#6366f1",
              boxShadow: "0 0 12px #6366f1",
            }}
          />
          3D Perspective Geometry // 90° Isometric Room Turn
        </div>

        <h1
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Stereoscopic Spatial Rotation
        </h1>
      </div>

      {/* 3D Perspective Scene Viewport */}
      <div
        style={{
          width: cubeSize,
          height: cubeSize,
          perspective: 1400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 60,
          transform: `scale(${entrance})`,
          opacity: entrance,
        }}
      >
        {/* The 3D Cube Assembly */}
        <div
          style={{
            width: cubeSize,
            height: cubeSize,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: `rotateX(-${isometricTiltX}deg) rotateY(${cubeAngleY}deg)`,
            transition: "transform 0.05s ease-out",
          }}
        >
          {/* =====================================================================
              FACE 1: FRONT FACE (translateZ = +halfSize)
             ===================================================================== */}
          <div
            style={{
              position: "absolute",
              width: cubeSize,
              height: cubeSize,
              borderRadius: 36,
              backgroundColor: "#0d111d",
              border: "2px solid rgba(56, 189, 248, 0.4)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.9), inset 0 0 60px rgba(56, 189, 248, 0.15)",
              transform: `translate3d(0, 0, ${halfSize}px)`,
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 54,
              filter: `brightness(${face1Brightness})`,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 18px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(56, 189, 248, 0.18)",
                  border: "1px solid rgba(56, 189, 248, 0.4)",
                  color: "#38bdf8",
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                STAGE 01
              </div>

              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                {face1Title}
              </div>

              <div style={{ fontSize: 22, color: "#94a3b8", lineHeight: 1.4 }}>
                Real-time ingestion gateway handling distributed protocol streaming with automatic backpressure.
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "24px 32px",
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 900, color: "#38bdf8" }}>
                {face1Metric}
              </div>
              <div style={{ fontSize: 18, color: "#64748b", marginTop: 4 }}>
                Distributed Throughput
              </div>
            </div>
          </div>

          {/* =====================================================================
              FACE 2: RIGHT FACE (rotateY(90deg) translateZ = +halfSize)
             ===================================================================== */}
          <div
            style={{
              position: "absolute",
              width: cubeSize,
              height: cubeSize,
              borderRadius: 36,
              backgroundColor: "#110e1e",
              border: "2px solid rgba(236, 72, 153, 0.4)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.9), inset 0 0 60px rgba(236, 72, 153, 0.15)",
              transform: `rotateY(90deg) translate3d(0, 0, ${halfSize}px)`,
              backfaceVisibility: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 54,
              filter: `brightness(${face2Brightness})`,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "6px 18px",
                  borderRadius: 9999,
                  backgroundColor: "rgba(236, 72, 153, 0.18)",
                  border: "1px solid rgba(236, 72, 153, 0.4)",
                  color: "#f472b6",
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 20,
                }}
              >
                STAGE 02
              </div>

              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  marginBottom: 16,
                }}
              >
                {face2Title}
              </div>

              <div style={{ fontSize: 22, color: "#c084fc", lineHeight: 1.4 }}>
                Continuous neural analytics engine updating streaming aggregations with sub-millisecond latencies.
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "24px 32px",
              }}
            >
              <div style={{ fontSize: 46, fontWeight: 900, color: "#ec4899" }}>
                {face2Metric}
              </div>
              <div style={{ fontSize: 18, color: "#a855f7", marginTop: 4 }}>
                Availability Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
