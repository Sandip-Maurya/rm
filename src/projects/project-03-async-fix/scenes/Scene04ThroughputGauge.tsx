import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../constants";

const CX = 280;
const CY = 280;
const RADIUS = 210;
const START_DEG = -125;
const END_DEG = 125;

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
};

export const Scene04ThroughputGauge: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badge1 = spring({
    frame: frame - 8,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 130 },
  });
  const badge2 = spring({
    frame: frame - 42,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 130 },
  });
  const latencyCard = spring({
    frame: frame - 64,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

  // Gauge needle sweeps from 24% -> 99% right as narrator says "throughput jumps straight to 99%"
  const needleSpring = spring({
    frame: frame - 78,
    fps,
    config: { damping: 8, mass: 0.65, stiffness: 88 },
  });

  const scoreValue = Math.min(
    99,
    Math.round(interpolate(needleSpring, [0, 1], [24, 99]))
  );
  const needleAngle = interpolate(needleSpring, [0, 1], [
    START_DEG + (END_DEG - START_DEG) * 0.24,
    START_DEG + (END_DEG - START_DEG) * 0.99,
  ]);
  const arcEndAngle = Math.min(END_DEG, Math.max(START_DEG + 1, needleAngle));

  const ticks = Array.from({ length: 21 }, (_, i) => {
    const pct = i / 20;
    const deg = START_DEG + pct * (END_DEG - START_DEG);
    const isMajor = i % 5 === 0;
    const outer = polarToCartesian(CX, CY, RADIUS + 24, deg);
    const inner = polarToCartesian(CX, CY, RADIUS + (isMajor ? 4 : 12), deg);
    return { outer, inner, isMajor, active: deg <= arcEndAngle };
  });

  const needleTip = polarToCartesian(CX, CY, RADIUS - 26, needleAngle);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Ambient emerald glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 66% 50%, rgba(16, 185, 129, 0.16) 0%, rgba(13, 17, 23, 0) 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          width: 1580,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 72,
        }}
      >
        {/* Left Column: Takeaways */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: THEME.emerald,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: 1.4,
            }}
          >
            // PRODUCTION IMPACT
          </div>

          <div
            style={{
              padding: "28px 34px",
              borderRadius: 22,
              backgroundColor: THEME.surface,
              border: `1.5px solid ${THEME.border}`,
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: badge1,
              transform: `translateX(${interpolate(badge1, [0, 1], [-28, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: "rgba(16, 185, 129, 0.16)",
                color: THEME.emerald,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: THEME.text }}>
                Same Exact Data
              </div>
              <div style={{ fontSize: 20, color: THEME.muted }}>
                Zero breaking changes to your response shape
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "28px 34px",
              borderRadius: 22,
              backgroundColor: THEME.surface,
              border: `1.5px solid ${THEME.border}`,
              display: "flex",
              alignItems: "center",
              gap: 20,
              opacity: badge2,
              transform: `translateX(${interpolate(badge2, [0, 1], [-28, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: "rgba(56, 189, 248, 0.16)",
                color: THEME.sky,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: THEME.text }}>
                Zero Extra Infrastructure
              </div>
              <div style={{ fontSize: 20, color: THEME.muted }}>
                No new servers, queues, or caches required
              </div>
            </div>
          </div>

          <div
            style={{
              padding: "26px 34px",
              borderRadius: 22,
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              border: "1.5px solid rgba(16, 185, 129, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: latencyCard,
              transform: `translateY(${interpolate(latencyCard, [0, 1], [20, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 700, color: THEME.text }}>
              Response Latency
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
              <span style={{ fontSize: 26, color: THEME.coral, textDecoration: "line-through" }}>
                2,400ms
              </span>
              <span style={{ fontSize: 26, color: THEME.muted }}>→</span>
              <span style={{ fontSize: 34, fontWeight: 900, color: THEME.emerald }}>
                640ms
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Radial Throughput Gauge */}
        <div
          style={{
            flex: "0 0 640px",
            borderRadius: 32,
            padding: "42px 40px",
            backgroundColor: THEME.surface,
            border: `1.5px solid ${THEME.border}`,
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: THEME.muted,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: 1.2,
              marginBottom: 10,
            }}
          >
            ENDPOINT THROUGHPUT SCORE
          </div>

          <svg width="560" height="460" viewBox="0 0 560 460">
            <defs>
              <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={THEME.sky} />
                <stop offset="100%" stopColor={THEME.emerald} />
              </linearGradient>
            </defs>

            {/* Background Track Arc */}
            <path
              d={describeArc(CX, CY, RADIUS, START_DEG, END_DEG)}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={24}
              strokeLinecap="round"
            />

            {/* Active Progress Arc */}
            <path
              d={describeArc(CX, CY, RADIUS, START_DEG, arcEndAngle)}
              fill="none"
              stroke="url(#gaugeGrad)"
              strokeWidth={24}
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0 0 14px rgba(16, 185, 129, 0.45))",
              }}
            />

            {/* Radial Ticks */}
            {ticks.map((t, idx) => (
              <line
                key={idx}
                x1={t.inner.x}
                y1={t.inner.y}
                x2={t.outer.x}
                y2={t.outer.y}
                stroke={t.active ? THEME.emerald : "rgba(255,255,255,0.22)"}
                strokeWidth={t.isMajor ? 3.5 : 2}
                strokeLinecap="round"
              />
            ))}

            {/* Inertial Needle */}
            <line
              x1={CX}
              y1={CY}
              x2={needleTip.x}
              y2={needleTip.y}
              stroke="#FFFFFF"
              strokeWidth={6}
              strokeLinecap="round"
            />
            <circle cx={CX} cy={CY} r={16} fill={THEME.emerald} stroke="#FFFFFF" strokeWidth={4} />

            {/* Digital Percentage Readout */}
            <text
              x={CX}
              y={CY + 108}
              textAnchor="middle"
              fill={THEME.emerald}
              fontSize={86}
              fontWeight={900}
              fontFamily="Inter, system-ui, sans-serif"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {scoreValue}%
            </text>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
