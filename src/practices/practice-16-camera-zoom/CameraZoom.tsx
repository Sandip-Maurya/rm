import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { CameraZoomProps } from "./types";

export const CameraZoom: React.FC<CameraZoomProps> = ({
  dashboardTitle = "Mission Operations Center",
  focusWidgetTitle = "Active GPU Cluster Load",
  focusWidgetValue = "98.4%",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Initial dashboard entry (frames 0 -> 25)
  const entry = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const entryOpacity = interpolate(entry, [0, 1], [0, 1]);

  // Practice 16 Math:
  // Dynamic camera zoom (Scale & Pan):
  // Frames 0 -> 40: Overview at scale 1.0x (full 4-panel dashboard)
  // Frames 40 -> 78: Smooth cinematic camera zoom into top-right panel (scale 1.0 -> 1.55)
  // transformOrigin: '98% 30%' pulls the camera completely into the right edge,
  // leaving ~160px of margin to the right edge of the screen so nothing clips.
  const zoom = interpolate(frame, [40, 78], [1.0, 1.55], {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Spotlight ring border glow intensifies on the targeted panel as camera approaches
  const focusGlow = interpolate(frame, [40, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        overflow: "hidden", // Prevents overflow during scale transformation
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Root Canvas Camera Stage */}
      <div
        style={{
          width: 1720,
          height: 940,
          transform: `scale(${zoom})`,
          transformOrigin: "98% 30%", // Centers the top-right card with safe screen padding on the right
          opacity: entryOpacity,
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Top Navigation Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 8px",
          }}
        >
          <div>
            <div style={{ color: "#38bdf8", fontSize: 24, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              ✦ TELEMETRY DASHBOARD
            </div>
            <div style={{ color: "#ffffff", fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {dashboardTitle}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#a1a1aa", fontSize: 22 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
            4 Active Nodes Online
          </div>
        </div>

        {/* 4-Panel Grid Layout */}
        <div
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: 28,
          }}
        >
          {/* Panel 1: Top-Left (Network Throughput) */}
          <div
            style={{
              background: "rgba(24, 24, 27, 0.9)",
              borderRadius: 32,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "44px 52px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ color: "#a1a1aa", fontSize: 28, fontWeight: 600 }}>Network Throughput</div>
            <div style={{ color: "#ffffff", fontSize: 72, fontWeight: 800, letterSpacing: "-0.03em" }}>48.2 GB/s</div>
            <div style={{ color: "#22c55e", fontSize: 22, fontWeight: 600 }}>▲ +12.4% vs baseline</div>
          </div>

          {/* Panel 2: TOP-RIGHT FOCUS TARGET (Active GPU Cluster Load) */}
          <div
            style={{
              background: "linear-gradient(145deg, rgba(30, 58, 138, 0.35) 0%, rgba(24, 24, 27, 0.95) 100%)",
              borderRadius: 32,
              border: `2px solid rgba(56, 189, 248, ${0.2 + focusGlow * 0.6})`,
              boxShadow: `0 25px 70px rgba(0, 0, 0, 0.8), 0 0 ${40 * focusGlow}px rgba(56, 189, 248, ${0.4 * focusGlow})`,
              padding: "44px 52px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative",
            }}
          >
            {/* Top Tag inside card */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#38bdf8", fontSize: 24, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                CAMERA TARGET ◉
              </div>
              <div style={{ backgroundColor: "rgba(56, 189, 248, 0.2)", color: "#38bdf8", padding: "6px 16px", borderRadius: 9999, fontSize: 18, fontWeight: 700 }}>
                H100 TENSOR CORE
              </div>
            </div>

            <div>
              <div style={{ color: "#a1a1aa", fontSize: 28, fontWeight: 600, marginBottom: 8 }}>
                {focusWidgetTitle}
              </div>
              <div style={{ color: "#ffffff", fontSize: 88, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {focusWidgetValue}
              </div>
            </div>

            <div style={{ color: "#38bdf8", fontSize: 22, fontWeight: 600 }}>
              Peak saturation reached • 0 dropped frames
            </div>
          </div>

          {/* Panel 3: Bottom-Left (Memory Allocation) */}
          <div
            style={{
              background: "rgba(24, 24, 27, 0.9)",
              borderRadius: 32,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "44px 52px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ color: "#a1a1aa", fontSize: 28, fontWeight: 600 }}>Memory Allocation</div>
            <div style={{ color: "#ffffff", fontSize: 72, fontWeight: 800, letterSpacing: "-0.03em" }}>1.2 TB / 1.5 TB</div>
            <div style={{ color: "#71717a", fontSize: 22, fontWeight: 500 }}>High memory pool reserve</div>
          </div>

          {/* Panel 4: Bottom-Right (Active Compute Instances) */}
          <div
            style={{
              background: "rgba(24, 24, 27, 0.9)",
              borderRadius: 32,
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "44px 52px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ color: "#a1a1aa", fontSize: 28, fontWeight: 600 }}>Active Compute Instances</div>
            <div style={{ color: "#ffffff", fontSize: 72, fontWeight: 800, letterSpacing: "-0.03em" }}>128 Nodes</div>
            <div style={{ color: "#22c55e", fontSize: 22, fontWeight: 600 }}>All healthchecks passing</div>
          </div>
        </div>
      </div>
    </div>
  );
};
