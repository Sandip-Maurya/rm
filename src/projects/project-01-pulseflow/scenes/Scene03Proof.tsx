import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE } from "../constants";
import { ConstellationBackground } from "../components/ConstellationBackground";

const PULSEFLOW_PATH =
  "M 40 70 C 180 75, 240 240, 380 280 C 520 320, 640 345, 840 355";
const PULSEFLOW_AREA = `${PULSEFLOW_PATH} L 840 400 L 40 400 Z`;
const LEGACY_PATH =
  "M 40 95 C 200 88, 360 105, 520 78 C 680 54, 760 72, 840 64";

const SAMPLE_Y_AT_T = (t: number) => {
  // Smooth monotonic drop matching PULSEFLOW_PATH visually
  return interpolate(t, [0, 0.35, 0.7, 1], [70, 265, 330, 355]);
};

export const Scene03Proof: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = interpolate(frame, [0, 208], [1.0, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });

  const panelSpring = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.6, stiffness: 110 },
  });

  // 10.4x rolling counter
  const multiplier = interpolate(frame, [10, 68], [1.0, 10.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Chart line draw-in
  const pathLen = 1100;
  const drawProg = interpolate(frame, [16, 78], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const areaOpacity = interpolate(frame, [45, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scanning crosshair
  const scanT = interpolate(frame, [84, 178], [0.08, 0.94], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const scanX = 40 + scanT * 800;
  const scanY = SAMPLE_Y_AT_T(scanT);
  const scanOpacity = interpolate(frame, [80, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const buildTimeMin = interpolate(scanT, [0, 1], [14.2, 1.2]).toFixed(1);

  const badge1Spring = spring({
    frame: frame - 68,
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });
  const badge2Spring = spring({
    frame: frame - 118,
    fps,
    config: { damping: 13, mass: 0.5, stiffness: 130 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bg,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ConstellationBackground opacity={0.45} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: 1640,
          display: "flex",
          gap: 48,
          alignItems: "stretch",
          transform: `scale(${zoom})`,
          opacity: panelSpring,
        }}
      >
        {/* Left Column: Hero 10.4x Metric + Feature Pills */}
        <div
          style={{
            flex: "0 0 560px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* Main Metric Card */}
          <div
            style={{
              borderRadius: 28,
              padding: "40px 42px",
              backgroundColor: PALETTE.surface,
              border: `1.5px solid ${PALETTE.surfaceBorder}`,
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: PALETTE.cyan,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                letterSpacing: 1.2,
                marginBottom: 14,
              }}
            >
              BUILD SPEEDUP
            </div>
            <div
              style={{
                fontSize: 126,
                fontWeight: 900,
                letterSpacing: -4,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                background: `linear-gradient(135deg, #FFFFFF 20%, ${PALETTE.cyan} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {multiplier.toFixed(1)}x
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: PALETTE.textSecondary,
                marginTop: 14,
              }}
            >
              Faster from commit to global edge
            </div>
          </div>

          {/* Staggered Feature Pills */}
          <div
            style={{
              borderRadius: 22,
              padding: "24px 28px",
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              border: "1.5px solid rgba(99, 102, 241, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: badge1Spring,
              transform: `translateX(${interpolate(badge1Spring, [0, 1], [-30, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: PALETTE.indigo,
                boxShadow: `0 0 14px ${PALETTE.indigo}`,
              }}
            />
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: PALETTE.textPrimary }}>
                Real-Time Observability
              </div>
              <div style={{ fontSize: 18, color: PALETTE.textSecondary }}>
                Live build logs & frame-level traces
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 22,
              padding: "24px 28px",
              backgroundColor: "rgba(34, 211, 238, 0.1)",
              border: "1.5px solid rgba(34, 211, 238, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: 18,
              opacity: badge2Spring,
              transform: `translateX(${interpolate(badge2Spring, [0, 1], [-30, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: PALETTE.cyan,
                boxShadow: `0 0 14px ${PALETTE.cyan}`,
              }}
            />
            <div>
              <div style={{ fontSize: 26, fontWeight: 700, color: PALETTE.textPrimary }}>
                Instant Edge Previews
              </div>
              <div style={{ fontSize: 18, color: PALETTE.textSecondary }}>
                Every pull request gets a live URL
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dual-Series Area Chart */}
        <div
          style={{
            flex: 1,
            borderRadius: 28,
            padding: "36px 42px",
            backgroundColor: PALETTE.surface,
            border: `1.5px solid ${PALETTE.surfaceBorder}`,
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 32, fontWeight: 700, color: PALETTE.textPrimary }}>
                Build Duration (Minutes)
              </div>
              <div style={{ fontSize: 20, color: PALETTE.textSecondary, marginTop: 4 }}>
                PulseFlow vs. Legacy CI Pipeline
              </div>
            </div>

            <div style={{ display: "flex", gap: 22, fontSize: 18, fontWeight: 600 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: PALETTE.cyan }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: PALETTE.cyan }} />
                PulseFlow
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: PALETTE.coral }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, backgroundColor: PALETTE.coral }} />
                Legacy CI
              </div>
            </div>
          </div>

          <svg viewBox="0 0 880 420" style={{ width: "100%", height: 430, overflow: "visible" }}>
            <defs>
              <linearGradient id="pfArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={PALETTE.cyan} stopOpacity="0.35" />
                <stop offset="100%" stopColor={PALETTE.cyan} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[80, 160, 240, 320, 400].map((y) => (
              <line
                key={y}
                x1={40}
                y1={y}
                x2={840}
                y2={y}
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1.5}
              />
            ))}

            {/* Legacy CI Dashed Line */}
            <path
              d={LEGACY_PATH}
              fill="none"
              stroke={PALETTE.coral}
              strokeWidth={4}
              strokeDasharray="10 8"
              strokeOpacity={0.78 * drawProg}
              strokeLinecap="round"
            />

            {/* PulseFlow Area Fill */}
            <path d={PULSEFLOW_AREA} fill="url(#pfArea)" opacity={areaOpacity} />

            {/* PulseFlow Hero Curve */}
            <path
              d={PULSEFLOW_PATH}
              fill="none"
              stroke={PALETTE.cyan}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={pathLen}
              strokeDashoffset={pathLen * (1 - drawProg)}
              style={{
                filter: `drop-shadow(0 0 12px ${PALETTE.cyanGlow})`,
              }}
            />

            {/* Scanning Crosshair & Live Tooltip */}
            {scanOpacity > 0 && (
              <g opacity={scanOpacity}>
                <line
                  x1={scanX}
                  y1={40}
                  x2={scanX}
                  y2={400}
                  stroke="rgba(255,255,255,0.38)"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                />
                <circle
                  cx={scanX}
                  cy={scanY}
                  r={10}
                  fill={PALETTE.cyan}
                  stroke="#FFFFFF"
                  strokeWidth={3}
                />
                <g transform={`translate(${Math.min(640, scanX + 16)}, ${Math.max(40, scanY - 62)})`}>
                  <rect
                    x={0}
                    y={0}
                    width={196}
                    height={54}
                    rx={12}
                    fill="#18181B"
                    stroke={PALETTE.cyan}
                    strokeWidth={1.6}
                  />
                  <text
                    x={16}
                    y={34}
                    fill="#FFFFFF"
                    fontSize={22}
                    fontWeight={700}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  >
                    Build: {buildTimeMin}m
                  </text>
                </g>
              </g>
            )}
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
