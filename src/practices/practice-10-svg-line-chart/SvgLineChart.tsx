import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SvgLineChartProps } from "./types";

export const SvgLineChart: React.FC<SvgLineChartProps> = ({
  title = "ETH / USD Performance",
  metric = "$3,842.50",
  trendBadge = "+28.4% (30D)",
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

  // Practice 10 Math:
  // SVG stroke-dash draw-in across frames 15 -> 70
  // Total line path length is approx 1350
  const pathLength = 1350;
  const strokeDashoffset = interpolate(frame, [15, 70], [pathLength, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.2, 0.8, 0.2, 1),
  });

  // Soft glowing area fill opacity rises smoothly as line draws (frames 30 -> 75)
  const areaOpacity = interpolate(frame, [30, 75], [0, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Terminal peak glowing dot appears right as line finishes drawing (frames 65 -> 80)
  const dotEntrance = spring({
    frame: frame - 65,
    fps,
    config: { damping: 12, mass: 0.5, stiffness: 140 },
  });
  const dotScale = interpolate(dotEntrance, [0, 1], [0, 1]);
  const dotOpacity = interpolate(dotEntrance, [0, 1], [0, 1]);

  // Vector Path Definitions:
  // Coordinates scaled for 1200x400 viewBox
  const linePath =
    "M 40 330 C 180 320, 260 250, 380 260 C 500 270, 560 170, 680 180 C 800 190, 880 70, 1020 90 C 1090 100, 1130 50, 1160 40";
  const areaPath = `${linePath} L 1160 380 L 40 380 Z`;

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
          padding: "48px 60px",
          width: "100%",
          maxWidth: 1380,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {/* Header Metric Row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                color: "#a1a1aa",
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                marginBottom: 8,
              }}
            >
              {title}
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 76,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {metric}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              fontSize: 26,
              fontWeight: 700,
              padding: "10px 24px",
              borderRadius: 9999,
              boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)",
            }}
          >
            {trendBadge}
          </div>
        </div>

        {/* SVG Vector Line Chart Canvas */}
        <div style={{ position: "relative", width: "100%", height: 380 }}>
          <svg
            viewBox="0 0 1200 400"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              {/* Gradient for area under chart */}
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>

              {/* Stroke glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Grid Lines */}
            <line x1="40" y1="100" x2="1160" y2="100" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" strokeWidth="2" />
            <line x1="40" y1="200" x2="1160" y2="200" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" strokeWidth="2" />
            <line x1="40" y1="300" x2="1160" y2="300" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" strokeWidth="2" />

            {/* Filled Area with Gradient */}
            <path
              d={areaPath}
              fill="url(#areaGradient)"
              opacity={areaOpacity}
            />

            {/* Glowing Accent Line Draw-in */}
            <path
              d={linePath}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              strokeDasharray={pathLength}
              strokeDashoffset={strokeDashoffset}
            />

            {/* Peak Terminal Indicator Dot */}
            <g
              transform={`translate(1160, 40) scale(${dotScale})`}
              opacity={dotOpacity}
            >
              {/* Pulsing radar halo */}
              <circle r="22" fill="#38bdf8" opacity="0.3" />
              {/* Solid white/cyan core */}
              <circle r="10" fill="#ffffff" stroke="#38bdf8" strokeWidth="4" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};
