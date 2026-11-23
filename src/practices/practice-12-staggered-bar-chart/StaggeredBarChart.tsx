import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StaggeredBarChartProps, BarItem } from "./types";

const defaultBars: BarItem[] = [
  { year: "2023", value: 38, displayValue: "+38%" },
  { year: "2024", value: 58, displayValue: "+58%" },
  { year: "2025", value: 78, displayValue: "+78%" },
  { year: "2026", value: 100, displayValue: "+100%", isHighlight: true },
];

export const StaggeredBarChart: React.FC<StaggeredBarChartProps> = ({
  title = "Annual Growth Trajectory",
  subtitle = "Comparative Revenue Multipliers (2023 - 2026)",
  bars = defaultBars,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Container pop-in spring (frames 0 -> 24)
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });
  const containerScale = interpolate(containerEntrance, [0, 1], [0.9, 1]);
  const containerOpacity = interpolate(containerEntrance, [0, 1], [0, 1]);
  const containerTranslateY = interpolate(containerEntrance, [0, 1], [40, 0]);

  // Maximum physical pixel height for 100% value
  const maxBarHeight = 360;

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
      {/* Chart Chassis Card */}
      <div
        style={{
          transform: `translateY(${containerTranslateY}px) scale(${containerScale})`,
          opacity: containerOpacity,
          background:
            "linear-gradient(145deg, rgba(24, 24, 27, 0.95) 0%, rgba(9, 9, 11, 0.95) 100%)",
          backdropFilter: "blur(24px)",
          borderRadius: 36,
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 35px 90px rgba(0, 0, 0, 0.8)",
          padding: "54px 72px",
          width: "100%",
          maxWidth: 1380,
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div
              style={{
                color: "#38bdf8",
                fontSize: 26,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              ✦ FINANCIAL BENCHMARK
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 52,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ color: "#a1a1aa", fontSize: 24, fontWeight: 500 }}>
            {subtitle}
          </div>
        </div>

        {/* 4 Vertical Comparison Bars with Synchronized Labels */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 480,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-around",
            padding: "0 40px",
          }}
        >
          {/* Subtle horizontal grid lines */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, height: 1, backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 200, height: 1, backgroundColor: "rgba(255, 255, 255, 0.05)", borderStyle: "dashed" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 320, height: 1, backgroundColor: "rgba(255, 255, 255, 0.05)", borderStyle: "dashed" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 440, height: 1, backgroundColor: "rgba(255, 255, 255, 0.05)", borderStyle: "dashed" }} />

          {bars.map((bar, index) => {
            // Practice 12 Math:
            // Bounded spring heights with overshootClamping: true
            // Prevents bars from temporarily growing taller than their real data values!
            const delay = index * 7; // 7-frame stagger delay
            const currentBarFrame = frame - delay;

            const growth = spring({
              frame: currentBarFrame,
              fps,
              config: { damping: 14, mass: 0.6, overshootClamping: true },
            });

            const targetHeightPx = (bar.value / 100) * maxBarHeight;
            const currentHeightPx = targetHeightPx * growth;

            // Synchronized label opacity and slight float
            const labelOpacity = interpolate(growth, [0, 0.2, 1], [0, 1, 1]);

            return (
              <div
                key={bar.year}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  width: 160,
                  height: "100%",
                  position: "relative",
                  zIndex: 2,
                }}
              >
                {/* Animated Metric Value Tracking Bar Peak */}
                <div
                  style={{
                    opacity: labelOpacity,
                    marginBottom: 14,
                    color: bar.isHighlight ? "#38bdf8" : "#ffffff",
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    textShadow: bar.isHighlight ? "0 0 20px rgba(56, 189, 248, 0.6)" : "none",
                  }}
                >
                  {bar.displayValue}
                </div>

                {/* Vertical Bar Cylinder with Gradient */}
                <div
                  style={{
                    width: "100%",
                    height: currentHeightPx,
                    background: bar.isHighlight
                      ? "linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)"
                      : "linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 100%)",
                    borderRadius: "18px 18px 4px 4px",
                    boxShadow: bar.isHighlight
                      ? "0 15px 40px rgba(56, 189, 248, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)"
                      : "0 10px 25px rgba(0, 0, 0, 0.4)",
                    border: bar.isHighlight
                      ? "1px solid rgba(255, 255, 255, 0.4)"
                      : "1px solid rgba(255, 255, 255, 0.12)",
                  }}
                />

                {/* Year Label Beneath the Baseline */}
                <div
                  style={{
                    marginTop: 20,
                    color: bar.isHighlight ? "#ffffff" : "#a1a1aa",
                    fontSize: 28,
                    fontWeight: bar.isHighlight ? 700 : 500,
                    letterSpacing: "0.02em",
                  }}
                >
                  {bar.year}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
