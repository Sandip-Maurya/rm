import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../constants";

const LANES = [
  { name: "fetchUser(id)", ms: 610, endFrame: 46 },
  { name: "fetchOrders(id)", ms: 640, endFrame: 48 },
  { name: "fetchMetrics(id)", ms: 590, endFrame: 44 },
  { name: "fetchAlerts(id)", ms: 560, endFrame: 42 },
];

export const Scene03ParallelDive: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Exponential zoom-through from Promise.all(...) into parallel lanes
  const diveT = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.exp),
  });
  const diveScale = interpolate(diveT, [0, 1], [1, 14]);
  const diveOpacity = interpolate(frame, [14, 22], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lanesOpacity = interpolate(frame, [14, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lanesSpring = spring({
    frame: frame - 14,
    fps,
    config: { damping: 14, mass: 0.55, stiffness: 120 },
  });

  const totalMs = Math.round(
    interpolate(frame, [20, 48], [0, 640], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Parallel Execution Lanes (revealed after dive) */}
      <div
        style={{
          width: 1460,
          borderRadius: 26,
          padding: "44px 52px",
          backgroundColor: THEME.surface,
          border: `1.5px solid rgba(16, 185, 129, 0.45)`,
          boxShadow: "0 30px 90px rgba(0, 0, 0, 0.7), 0 0 50px rgba(16, 185, 129, 0.14)",
          opacity: lanesOpacity,
          transform: `scale(${interpolate(lanesSpring, [0, 1], [0.9, 1])})`,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 24,
            borderBottom: `1px solid ${THEME.border}`,
            marginBottom: 34,
          }}
        >
          <span style={{ fontSize: 26, fontWeight: 700, color: THEME.emerald }}>
            PROMISE.ALL // PARALLEL EXECUTION
          </span>
          <span
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              backgroundColor: "rgba(16, 185, 129, 0.16)",
              border: `1.5px solid ${THEME.emerald}`,
              color: THEME.emerald,
              fontSize: 24,
              fontWeight: 800,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {totalMs}ms TOTAL
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {LANES.map((lane) => {
            const barProg = interpolate(frame, [20, lane.endFrame], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.out(Easing.cubic),
            });
            const isDone = frame >= lane.endFrame;
            const widthPct = (lane.ms / 640) * 82 * barProg;

            return (
              <div key={lane.name} style={{ display: "flex", alignItems: "center", gap: 24 }}>
                <div
                  style={{
                    width: 340,
                    fontSize: 24,
                    color: THEME.text,
                    fontWeight: 600,
                  }}
                >
                  {lane.name}
                </div>

                <div
                  style={{
                    flex: 1,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      width: `${widthPct}%`,
                      top: 0,
                      bottom: 0,
                      borderRadius: 8,
                      background: `linear-gradient(90deg, ${THEME.emerald}, ${THEME.sky})`,
                      boxShadow: "0 0 18px rgba(16, 185, 129, 0.55)",
                    }}
                  />
                </div>

                <div
                  style={{
                    width: 115,
                    textAlign: "right",
                    fontSize: 22,
                    color: isDone ? THEME.emerald : THEME.muted,
                    fontWeight: 700,
                  }}
                >
                  {isDone ? `✓ ${lane.ms}ms` : "..."}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exponential Zoom-Through Overlay */}
      {diveOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: diveOpacity,
            transform: `scale(${diveScale})`,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "36px 64px",
              borderRadius: 24,
              backgroundColor: THEME.surface,
              border: `2px solid ${THEME.emerald}`,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 54,
              fontWeight: 800,
              color: THEME.emerald,
              boxShadow: "0 0 60px rgba(16, 185, 129, 0.35)",
            }}
          >
            Promise.all([ ... ])
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
