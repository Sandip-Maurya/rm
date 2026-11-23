import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { GlitchCutProps } from "./types";

export const GlitchCut: React.FC<GlitchCutProps> = ({
  scene1Headline = "SYSTEM STATUS // NOMINAL",
  scene2Headline = "CYBERNETIC BREACH OVERRIDE",
  glitchStart = 40,
  glitchDuration = 8,
}) => {
  const frame = useCurrentFrame();

  const glitchEnd = glitchStart + glitchDuration;
  const isGlitchFrame = frame >= glitchStart && frame < glitchEnd;
  const isScene2 = frame >= glitchEnd;

  // Deterministic pseudo-random seed based on frame number
  const seed = Math.sin(frame * 9876.5432);
  const seed2 = Math.cos(frame * 4321.1234);

  // High-frequency RGB split displacement (pixels)
  const redShiftX = isGlitchFrame ? seed * 28 : 0;
  const redShiftY = isGlitchFrame ? seed2 * 8 : 0;
  const cyanShiftX = isGlitchFrame ? -seed * 28 : 0;
  const cyanShiftY = isGlitchFrame ? -seed2 * 8 : 0;

  // Horizontal scanline slice tear offset
  const sliceY = Math.abs(seed) * 800 + 100;
  const sliceHeight = 80 + Math.abs(seed2) * 120;
  const sliceOffset = seed * 45;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#02040a",
        overflow: "hidden",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
      }}
    >
      {/* SVG Filters for pure RGB Channel Splitting */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="red-channel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="cyan-channel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      {/* RENDER THE CONTENT SCENE (Scene 1 before breach, Scene 2 after breach) */}
      {(() => {
        const renderSceneContent = () => (
          <AbsoluteFill
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 80,
              background: isScene2
                ? "radial-gradient(circle at 50% 50%, #450a0a 0%, #030712 80%)"
                : "radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 80%)",
            }}
          >
            {/* Stage Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 24px",
                borderRadius: 9999,
                backgroundColor: isScene2
                  ? "rgba(239, 68, 68, 0.2)"
                  : "rgba(56, 189, 248, 0.16)",
                border: isScene2
                  ? "1.5px solid rgba(248, 113, 113, 0.5)"
                  : "1.5px solid rgba(56, 189, 248, 0.4)",
                color: isScene2 ? "#fca5a5" : "#7dd3fc",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: isScene2 ? "#ef4444" : "#38bdf8",
                  boxShadow: `0 0 14px ${isScene2 ? "#ef4444" : "#38bdf8"}`,
                }}
              />
              {isScene2 ? "CRITICAL PROTOCOL // ACTIVE" : "DEFENSE FIREWALL // ONLINE"}
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 88,
                fontWeight: 900,
                color: isScene2 ? "#f87171" : "#ffffff",
                textAlign: "center",
                maxWidth: 1400,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                margin: "0 0 24px 0",
                textShadow: isScene2
                  ? "0 0 40px rgba(239, 68, 68, 0.6)"
                  : "0 4px 30px rgba(0,0,0,0.8)",
              }}
            >
              {isScene2 ? scene2Headline : scene1Headline}
            </h1>

            <p
              style={{
                fontSize: 28,
                color: isScene2 ? "#fecaca" : "#94a3b8",
                textAlign: "center",
                maxWidth: 1000,
                lineHeight: 1.4,
                margin: "0 0 48px 0",
              }}
            >
              {isScene2
                ? "Sub-system failover initiated. Quantum cryptographic handshake rerouted to secondary air-gapped node."
                : "Multi-cluster packet telemetry streaming cleanly with zero packet anomalies detected across active zones."}
            </p>

            {/* Metrics Row */}
            <div style={{ display: "flex", gap: 40 }}>
              <div
                style={{
                  padding: "24px 44px",
                  borderRadius: 20,
                  backgroundColor: isScene2
                    ? "rgba(239, 68, 68, 0.12)"
                    : "rgba(255, 255, 255, 0.04)",
                  border: isScene2
                    ? "1px solid rgba(248, 113, 113, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: isScene2 ? "#f87171" : "#38bdf8",
                  }}
                >
                  {isScene2 ? "ERR 0x9F4" : "0.00% LOSS"}
                </div>
                <div style={{ fontSize: 18, color: "#64748b", marginTop: 4 }}>
                  Integrity Code
                </div>
              </div>

              <div
                style={{
                  padding: "24px 44px",
                  borderRadius: 20,
                  backgroundColor: isScene2
                    ? "rgba(239, 68, 68, 0.12)"
                    : "rgba(255, 255, 255, 0.04)",
                  border: isScene2
                    ? "1px solid rgba(248, 113, 113, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 48,
                    fontWeight: 900,
                    color: isScene2 ? "#fbbf24" : "#34d399",
                  }}
                >
                  {isScene2 ? "IMMEDIATE" : "ALL GREEN"}
                </div>
                <div style={{ fontSize: 18, color: "#64748b", marginTop: 4 }}>
                  Action Mandate
                </div>
              </div>
            </div>
          </AbsoluteFill>
        );

        // If not in glitch transition frames, render clean scene
        if (!isGlitchFrame) {
          return renderSceneContent();
        }

        // GLITCH ACTIVATION (Frames 40 -> 48):
        // Layer Red channel shifted left + Cyan channel shifted right with Screen blend
        return (
          <AbsoluteFill style={{ overflow: "hidden" }}>
            {/* Red Channel Shift */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: `translate3d(${redShiftX}px, ${redShiftY}px, 0)`,
                filter: "url(#red-channel)",
                mixBlendMode: "screen",
              }}
            >
              {renderSceneContent()}
            </div>

            {/* Cyan Channel Shift */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                transform: `translate3d(${cyanShiftX}px, ${cyanShiftY}px, 0)`,
                filter: "url(#cyan-channel)",
                mixBlendMode: "screen",
              }}
            >
              {renderSceneContent()}
            </div>

            {/* Displaced Horizontal Tear Band */}
            <div
              style={{
                position: "absolute",
                top: sliceY,
                left: 0,
                width: "100%",
                height: sliceHeight,
                transform: `translateX(${sliceOffset}px)`,
                overflow: "hidden",
                zIndex: 30,
                borderTop: "2px solid rgba(255, 255, 255, 0.8)",
                borderBottom: "2px solid rgba(255, 255, 255, 0.8)",
                boxShadow: "0 0 30px rgba(255,255,255,0.4)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -sliceY,
                  left: 0,
                  width: 1920,
                  height: 1080,
                }}
              >
                {renderSceneContent()}
              </div>
            </div>

            {/* CRT TV Scanline Overlay */}
            <div
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 2px, transparent 2px, transparent 4px)",
                pointerEvents: "none",
                zIndex: 40,
              }}
            />
          </AbsoluteFill>
        );
      })()}
    </AbsoluteFill>
  );
};
