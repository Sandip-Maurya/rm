import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { MultiSeriesAreaChartProps } from "./types";

const DEFAULT_DATA = [
  { month: "Jan", revenue: 420, expenses: 310 },
  { month: "Feb", revenue: 580, expenses: 340 },
  { month: "Mar", revenue: 720, expenses: 400 },
  { month: "Apr", revenue: 860, expenses: 450 },
  { month: "May", revenue: 1040, expenses: 510 },
  { month: "Jun", revenue: 1280, expenses: 580 },
];

export const MultiSeriesAreaChart: React.FC<MultiSeriesAreaChartProps> = ({
  title = "Enterprise Cashflow Telemetry",
  subtitle = "Comparative Multi-Series Area Curves • Real-Time Scanning Crosshair",
  dataPoints = DEFAULT_DATA,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for dashboard card
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.7 },
  });

  // SVG Chart Geometry
  const width = 1240;
  const height = 400;
  const paddingX = 80;
  const paddingY = 40;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  // Max value scale (1400k max)
  const maxVal = 1400;

  const pointsRev = dataPoints.map((d, i) => ({
    x: paddingX + (i / (dataPoints.length - 1)) * chartW,
    y: height - paddingY - (d.revenue / maxVal) * chartH,
    rev: d.revenue,
    exp: d.expenses,
    month: d.month,
  }));

  const pointsExp = dataPoints.map((d, i) => ({
    x: paddingX + (i / (dataPoints.length - 1)) * chartW,
    y: height - paddingY - (d.expenses / maxVal) * chartH,
  }));

  // Build smooth cubic bezier SVG path string
  const createSmoothPath = (pts: { x: number; y: number }[]) => {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePathRev = createSmoothPath(pointsRev);
  const linePathExp = createSmoothPath(pointsExp);

  const areaPathRev = `${linePathRev} L ${pointsRev[pointsRev.length - 1].x} ${
    height - paddingY
  } L ${pointsRev[0].x} ${height - paddingY} Z`;
  const areaPathExp = `${linePathExp} L ${pointsExp[pointsExp.length - 1].x} ${
    height - paddingY
  } L ${pointsExp[0].x} ${height - paddingY} Z`;

  // Draw-in animation (frames 10 -> 50)
  const pathLength = 1600;
  const drawProgress = interpolate(frame, [10, 52], [pathLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const areaOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Crosshair sweeping across chart from frame 55 to 140
  const crosshairProgress = interpolate(frame, [55, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const crosshairX = interpolate(
    crosshairProgress,
    [0, 1],
    [pointsRev[0].x, pointsRev[pointsRev.length - 1].x]
  );

  // Active interpolated values along crosshair
  const activeIdxFloat = crosshairProgress * (dataPoints.length - 1);
  const activeIdx = Math.min(
    dataPoints.length - 1,
    Math.round(activeIdxFloat)
  );
  const activePoint = pointsRev[activeIdx];

  // Tooltip pop-in spring after lines finish drawing
  const tooltipEntrance = spring({
    frame: frame - 58,
    fps,
    config: { damping: 12 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05070e",
        display: "flex",
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
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Dashboard Card */}
      <div
        style={{
          width: 1460,
          backgroundColor: "#0d111a",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 32,
          padding: "48px 54px",
          boxShadow:
            "0 35px 90px -20px rgba(0,0,0,0.95), 0 0 50px rgba(56, 189, 248, 0.1)",
          transform: `scale(${cardEntrance})`,
          opacity: cardEntrance,
        }}
      >
        {/* Header with Title & Legend */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 36,
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
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.35)",
                color: "#7dd3fc",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              FINANCIAL PERFORMANCE
            </div>

            <h1
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: "#f8fafc",
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

          {/* Series Legend */}
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: "#38bdf8",
                  boxShadow: "0 0 10px #38bdf8",
                }}
              />
              <span
                style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}
              >
                Revenue
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 4,
                  backgroundColor: "#ec4899",
                  boxShadow: "0 0 10px #ec4899",
                }}
              />
              <span
                style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}
              >
                Expenses
              </span>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div style={{ position: "relative", width, height }}>
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            style={{ overflow: "visible" }}
          >
            <defs>
              {/* Gradient for Revenue Area */}
              <linearGradient id="revAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>

              {/* Gradient for Expenses Area */}
              <linearGradient id="expAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.33, 0.66, 1].map((ratio, i) => {
              const y = paddingY + ratio * chartH;
              return (
                <line
                  key={i}
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeDasharray="6 6"
                />
              );
            })}

            {/* Area Fills */}
            <path
              d={areaPathRev}
              fill="url(#revAreaGrad)"
              opacity={areaOpacity}
            />
            <path
              d={areaPathExp}
              fill="url(#expAreaGrad)"
              opacity={areaOpacity}
            />

            {/* Revenue Stroke Line */}
            <path
              d={linePathRev}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={drawProgress}
              filter="drop-shadow(0 0 10px rgba(56, 189, 248, 0.6))"
            />

            {/* Expenses Stroke Line */}
            <path
              d={linePathExp}
              fill="none"
              stroke="#ec4899"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={pathLength}
              strokeDashoffset={drawProgress}
              filter="drop-shadow(0 0 10px rgba(236, 72, 153, 0.6))"
            />

            {/* X-Axis Month Labels */}
            {pointsRev.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={height - 8}
                fill="#64748b"
                fontSize="22"
                fontWeight="700"
                textAnchor="middle"
              >
                {p.month}
              </text>
            ))}

            {/* Scanning Vertical Crosshair Bar (Visible from frame 55 onwards) */}
            {frame >= 55 && (
              <>
                <line
                  x1={crosshairX}
                  y1={paddingY}
                  x2={crosshairX}
                  y2={height - paddingY}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                  filter="drop-shadow(0 0 8px #38bdf8)"
                />
                {/* Intersecting Dots */}
                <circle
                  cx={crosshairX}
                  cy={activePoint.y}
                  r="7"
                  fill="#38bdf8"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 0 12px #38bdf8)"
                />
                <circle
                  cx={crosshairX}
                  cy={pointsExp[activeIdx].y}
                  r="7"
                  fill="#ec4899"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="drop-shadow(0 0 12px #ec4899)"
                />
              </>
            )}
          </svg>

          {/* Interactive Floating Tooltip */}
          {frame >= 55 && (
            <div
              style={{
                position: "absolute",
                left: crosshairX - 110,
                top: Math.max(10, activePoint.y - 120),
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "1.5px solid rgba(56, 189, 248, 0.4)",
                borderRadius: 16,
                padding: "12px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                boxShadow: "0 15px 35px rgba(0,0,0,0.8)",
                pointerEvents: "none",
                transform: `scale(${tooltipEntrance})`,
                opacity: tooltipEntrance,
                zIndex: 20,
              }}
            >
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {activePoint.month} 2026
              </span>
              <div
                style={{
                  display: "flex",
                  gap: 16,
                  fontSize: 22,
                  fontWeight: 900,
                }}
              >
                <span style={{ color: "#38bdf8" }}>
                  ${activePoint.rev}K
                </span>
                <span style={{ color: "#ec4899" }}>
                  ${activePoint.exp}K
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
