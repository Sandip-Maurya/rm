import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { LissajousPlotterProps } from "./types";

export const LissajousPlotter: React.FC<LissajousPlotterProps> = ({
  title = "Harmonic Lissajous Attractor",
  freqA = 3,
  freqB = 4,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2 + 20;
  const radius = 320;

  // Continuous harmonic phase shift delta
  const delta = (frame / fps) * Math.PI * 0.5;

  // Curve draws progressively over frames 0..45, then sweeps continuously along the harmonic manifold
  const drawSpan = interpolate(frame, [0, 48], [Math.PI * 0.3, Math.PI * 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const headParameter = Math.PI * 2 * (frame / 90);

  const sampleCount = 260;
  const startParam = headParameter - drawSpan;

  const points: Array<{ x: number; y: number; progress: number }> = [];
  for (let i = 0; i <= sampleCount; i++) {
    const progress = i / sampleCount;
    const t = startParam + progress * drawSpan;
    const x = cx + radius * Math.sin(freqA * t + delta);
    const y = cy + radius * Math.sin(freqB * t);
    points.push({ x, y, progress });
  }

  // Group consecutive segments into opacity buckets for silky fading electric neon trail
  const bucketCount = 26;
  const segmentsPerBucket = Math.floor(sampleCount / bucketCount);
  const buckets: Array<{ pointsAttr: string; opacity: number; strokeWidth: number; hue: number }> = [];

  for (let b = 0; b < bucketCount; b++) {
    const startIdx = b * segmentsPerBucket;
    const endIdx = b === bucketCount - 1 ? sampleCount : (b + 1) * segmentsPerBucket;
    const slice = points.slice(startIdx, endIdx + 1);
    const tNorm = (b + 1) / bucketCount;

    buckets.push({
      pointsAttr: slice.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" "),
      opacity: Math.pow(tNorm, 1.8) * 0.95,
      strokeWidth: 2 + tNorm * 6,
      hue: 190 + tNorm * 130, // cyan -> electric violet -> hot pink at leading head
    });
  }

  const headPoint = points[points.length - 1] ?? { x: cx, y: cy };

  const hudSpring = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 52%, #0e162e 0%, #040713 62%, #010207 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="lissajous-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="head-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="30%" stopColor="#f472b6" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Precision Coordinate Axes & Bounding Frame */}
        <rect
          x={cx - radius}
          y={cy - radius}
          width={radius * 2}
          height={radius * 2}
          rx={24}
          fill="rgba(15, 23, 42, 0.25)"
          stroke="rgba(148, 163, 184, 0.14)"
          strokeWidth={1.5}
        />
        <line
          x1={cx - radius}
          y1={cy}
          x2={cx + radius}
          y2={cy}
          stroke="rgba(148, 163, 184, 0.14)"
          strokeDasharray="6 8"
        />
        <line
          x1={cx}
          y1={cy - radius}
          x2={cx}
          y2={cy + radius}
          stroke="rgba(148, 163, 184, 0.14)"
          strokeDasharray="6 8"
        />

        {/* Fading Electric Neon Polyline Trail */}
        {buckets.map((bucket, idx) => (
          <polyline
            key={idx}
            points={bucket.pointsAttr}
            fill="none"
            stroke={`hsl(${bucket.hue}, 96%, 64%)`}
            strokeOpacity={bucket.opacity}
            strokeWidth={bucket.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={idx > bucketCount * 0.55 ? "url(#lissajous-glow)" : undefined}
          />
        ))}

        {/* Luminous Leading Particle Head */}
        <circle cx={headPoint.x} cy={headPoint.y} r={44} fill="url(#head-halo)" />
        <circle
          cx={headPoint.x}
          cy={headPoint.y}
          r={9}
          fill="#ffffff"
          filter="url(#lissajous-glow)"
        />
      </svg>

      {/* Top Square HUD */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: hudSpring,
          pointerEvents: "none",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(244, 114, 182, 0.16)",
              border: "1px solid rgba(244, 114, 182, 0.4)",
              color: "#f9a8d4",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            CATEGORY I // PRACTICE 48
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 42,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            padding: "10px 20px",
            borderRadius: 14,
            backgroundColor: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#7dd3fc",
            fontSize: 18,
            fontWeight: 700,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        >
          {freqA}:{freqB} RATIO
        </div>
      </div>

      {/* Bottom Formula Readout */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 26px",
          borderRadius: 18,
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(14px)",
          color: "#cbd5e1",
          fontSize: 19,
          fontWeight: 700,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          opacity: hudSpring,
        }}
      >
        <span>
          x = R·sin({freqA}t + δ) &nbsp;|&nbsp; y = R·sin({freqB}t)
        </span>
        <span style={{ color: "#f472b6" }}>
          δ = {delta.toFixed(2)} rad
        </span>
      </div>
    </AbsoluteFill>
  );
};
