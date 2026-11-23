import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { HeatmapMatrixProps } from "./types";

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  title = "CONTINUOUS DEPLOYMENT DENSITY MATRIX",
  subtitle = "Manhattan Distance Diagonal Wave • Numeric Intensity Scale (112 Cells)",
  rows = 7,
  cols = 16,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container entrance
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.6 },
  });

  // Deterministic density matrix (7 rows x 16 cols = 112 cells)
  // Intensity ranges from 0 (quiet) to 4 (maximum velocity)
  const matrixData = useMemo(() => {
    const data: number[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: number[] = [];
      for (let c = 0; c < cols; c++) {
        // Deterministic pseudo-random pattern based on coordinates
        const val = Math.floor(
          (Math.sin(r * 3.7 + c * 1.9) * 0.5 + 0.5) * 5
        );
        row.push(Math.min(4, Math.max(0, val)));
      }
      data.push(row);
    }
    return data;
  }, [rows, cols]);

  // Color map: 0 (dark navy) to 4 (bright emerald)
  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "rgba(255, 255, 255, 0.05)";
      case 1:
        return "rgba(16, 185, 129, 0.25)";
      case 2:
        return "rgba(16, 185, 129, 0.50)";
      case 3:
        return "rgba(16, 185, 129, 0.75)";
      case 4:
        return "#10b981";
      default:
        return "rgba(255, 255, 255, 0.05)";
    }
  };

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050711",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 45%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Heatmap Card */}
      <div
        style={{
          width: 1440,
          backgroundColor: "#0d111a",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 32,
          padding: "48px 60px",
          boxShadow:
            "0 35px 90px -20px rgba(0,0,0,0.95), 0 0 50px rgba(16, 185, 129, 0.1)",
          transform: `scale(${containerEntrance})`,
          opacity: containerEntrance,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 44,
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
                backgroundColor: "rgba(16, 185, 129, 0.16)",
                border: "1px solid rgba(52, 211, 153, 0.35)",
                color: "#6ee7b7",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              ACTIVITY DENSITY
            </div>

            <h1
              style={{
                fontSize: 44,
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              {title}
            </h1>

            <p
              style={{
                fontSize: 22,
                color: "#94a3b8",
                fontWeight: 500,
                margin: "8px 0 0 0",
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#64748b" }}>
              Less
            </span>
            {[0, 1, 2, 3, 4].map((lvl) => (
              <div
                key={lvl}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  backgroundColor: getColor(lvl),
                  border:
                    lvl === 4
                      ? "1px solid #34d399"
                      : "1px solid rgba(255,255,255,0.1)",
                  boxShadow:
                    lvl === 4 ? "0 0 10px rgba(16, 185, 129, 0.6)" : "none",
                }}
              />
            ))}
            <span style={{ fontSize: 18, fontWeight: 700, color: "#64748b" }}>
              More
            </span>
          </div>
        </div>

        {/* 7x16 Matrix Grid Canvas */}
        <div style={{ display: "flex", gap: 20 }}>
          {/* Day of Week Labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: rows * 44 + (rows - 1) * 10,
              padding: "4px 0",
            }}
          >
            {dayLabels.map((day, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#64748b",
                  lineHeight: "44px",
                }}
              >
                {day}
              </span>
            ))}
          </div>

          {/* Matrix Columns */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flex: 1,
            }}
          >
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  flex: 1,
                }}
              >
                {Array.from({ length: rows }).map((_, rIdx) => {
                  const intensity = matrixData[rIdx][cIdx];

                  // Manhattan distance diagonal delay:
                  // Sweeps diagonally from top-left (0, 0) to bottom-right (6, 15)
                  const manhattanDist = rIdx + cIdx;
                  const delay = 15 + manhattanDist * 2.2;

                  const cellSpring = spring({
                    frame: frame - delay,
                    fps,
                    config: { damping: 11, mass: 0.35, stiffness: 140 },
                  });

                  const cellScale = cellSpring;
                  const glow =
                    intensity === 4 && cellSpring > 0.8
                      ? "0 0 14px rgba(16, 185, 129, 0.7)"
                      : "none";

                  return (
                    <div
                      key={rIdx}
                      style={{
                        height: 44,
                        borderRadius: 8,
                        backgroundColor: getColor(intensity),
                        border:
                          intensity > 0
                            ? "1px solid rgba(52, 211, 153, 0.3)"
                            : "1px solid rgba(255, 255, 255, 0.05)",
                        transform: `scale(${cellScale})`,
                        opacity: cellSpring,
                        boxShadow: glow,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Statistics */}
        <div
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 24,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            color: "#94a3b8",
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <span>1,842 Production Deploys Across 16 Sprint Cycles</span>
          <span style={{ color: "#34d399", fontWeight: 800 }}>
            99.98% Pipeline Success Rate
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
