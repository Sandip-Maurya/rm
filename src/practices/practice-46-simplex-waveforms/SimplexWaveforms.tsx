import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { simplex2D } from "./simplexNoise";
import type { SimplexWaveformsProps } from "./types";

interface RibbonLayer {
  id: string;
  gradId: string;
  colors: [string, string, string];
  baseAmplitude: number;
  freq: number;
  speed: number;
  noiseOffset: number;
  strokeWidth: number;
  thickness: number;
}

const RIBBONS: RibbonLayer[] = [
  {
    id: "cyan-indigo",
    gradId: "grad-ribbon-0",
    colors: ["#22d3ee", "#6366f1", "#38bdf8"],
    baseAmplitude: 210,
    freq: 0.0022,
    speed: 0.022,
    noiseOffset: 3.1,
    strokeWidth: 4,
    thickness: 84,
  },
  {
    id: "magenta-violet",
    gradId: "grad-ribbon-1",
    colors: ["#f472b6", "#a855f7", "#ec4899"],
    baseAmplitude: 185,
    freq: 0.0027,
    speed: 0.028,
    noiseOffset: 14.7,
    strokeWidth: 4,
    thickness: 72,
  },
  {
    id: "emerald-teal",
    gradId: "grad-ribbon-2",
    colors: ["#34d399", "#38bdf8", "#818cf8"],
    baseAmplitude: 155,
    freq: 0.0031,
    speed: 0.019,
    noiseOffset: 27.4,
    strokeWidth: 3.5,
    thickness: 58,
  },
];

interface Point2D {
  x: number;
  y: number;
}

/** Convert sampled points to a smooth Catmull-Rom cubic bezier SVG path */
function pointsToSmoothBezierPath(points: Point2D[], closed = false): string {
  if (points.length < 2) return "";
  const first = points[0];
  if (!first) return "";

  let d = `M ${first.x.toFixed(1)} ${first.y.toFixed(1)}`;
  const n = points.length;

  for (let i = 0; i < n - 1; i++) {
    const p0 = points[Math.max(0, i - 1)] ?? first;
    const p1 = points[i] ?? first;
    const p2 = points[i + 1] ?? p1;
    const p3 = points[Math.min(n - 1, i + 2)] ?? p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  if (closed) {
    d += " Z";
  }
  return d;
}

function buildRibbonPaths(
  width: number,
  centerY: number,
  frame: number,
  layer: RibbonLayer
): { centerPath: string; filledRibbonPath: string } {
  const step = 32;
  const topPoints: Point2D[] = [];
  const bottomPoints: Point2D[] = [];
  const centerPoints: Point2D[] = [];

  for (let x = 0; x <= width; x += step) {
    const u = x / width;
    // Smooth edge envelope guarantees zero hard clipping or abrupt jump at x=0 and x=width
    const edgeEnvelope = Math.pow(Math.sin(u * Math.PI), 1.35);

    const n1 = simplex2D(x * layer.freq + frame * layer.speed, layer.noiseOffset);
    const n2 = simplex2D(
      x * layer.freq * 1.9 - frame * layer.speed * 0.7,
      layer.noiseOffset + 40
    );

    const displacement = (n1 * 0.72 + n2 * 0.28) * layer.baseAmplitude * edgeEnvelope;
    const y = centerY + displacement;

    const halfThick =
      layer.thickness *
      edgeEnvelope *
      (0.45 + 0.55 * Math.abs(n2 * 0.6 + 0.4));

    centerPoints.push({ x, y });
    topPoints.push({ x, y: y - halfThick });
    bottomPoints.push({ x, y: y + halfThick });
  }

  const centerPath = pointsToSmoothBezierPath(centerPoints);

  // Build closed filled ribbon outline from top edge left->right and bottom edge right->left
  const topD = pointsToSmoothBezierPath(topPoints);
  const reversedBottom = [...bottomPoints].reverse();
  const bottomLast = reversedBottom[0];
  let filledRibbonPath = topD;
  if (bottomLast) {
    filledRibbonPath += ` L ${bottomLast.x.toFixed(1)} ${bottomLast.y.toFixed(1)}`;
    for (let i = 0; i < reversedBottom.length - 1; i++) {
      const p0 = reversedBottom[Math.max(0, i - 1)] ?? bottomLast;
      const p1 = reversedBottom[i] ?? bottomLast;
      const p2 = reversedBottom[i + 1] ?? p1;
      const p3 = reversedBottom[Math.min(reversedBottom.length - 1, i + 2)] ?? p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      filledRibbonPath += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    filledRibbonPath += " Z";
  }

  return { centerPath, filledRibbonPath };
}

export const SimplexWaveforms: React.FC<SimplexWaveformsProps> = ({
  title = "Organic Simplex Noise Ribbons",
  subtitle = "Multi-Octave 2D Procedural Noise • Smooth Edge-Tapered Bezier Splines",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  const waveAlpha = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const centerY = height * 0.56;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 55%, #0c1328 0%, #030612 65%, #010207 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Subtle central horizon line */}
      <div
        style={{
          position: "absolute",
          top: centerY,
          left: 0,
          right: 0,
          height: 1,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(148,163,184,0.22) 50%, rgba(255,255,255,0) 100%)",
        }}
      />

      {/* Overlapping Glowing SVG Simplex Ribbons */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{
          position: "absolute",
          inset: 0,
          opacity: waveAlpha,
          mixBlendMode: "screen",
        }}
      >
        <defs>
          {RIBBONS.map((r) => (
            <linearGradient
              key={r.gradId}
              id={r.gradId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={r.colors[0]} stopOpacity="0.1" />
              <stop offset="28%" stopColor={r.colors[0]} stopOpacity="0.92" />
              <stop offset="50%" stopColor={r.colors[1]} stopOpacity="0.98" />
              <stop offset="72%" stopColor={r.colors[2]} stopOpacity="0.92" />
              <stop offset="100%" stopColor={r.colors[2]} stopOpacity="0.1" />
            </linearGradient>
          ))}

          <filter id="ribbon-glow" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="16" result="softGlow" />
            <feMerge>
              <feMergeNode in="softGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {RIBBONS.map((layer) => {
          const { centerPath, filledRibbonPath } = buildRibbonPaths(
            width,
            centerY,
            frame,
            layer
          );

          return (
            <g key={layer.id}>
              {/* Translucent glowing volume ribbon */}
              <path
                d={filledRibbonPath}
                fill={`url(#${layer.gradId})`}
                fillOpacity={0.28}
                filter="url(#ribbon-glow)"
              />
              {/* Crisp glowing spline crest */}
              <path
                d={centerPath}
                fill="none"
                stroke={`url(#${layer.gradId})`}
                strokeWidth={layer.strokeWidth}
                filter="url(#ribbon-glow)"
              />
              {/* Fine luminous filament */}
              <path
                d={centerPath}
                fill="none"
                stroke="#ffffff"
                strokeOpacity={0.55}
                strokeWidth={1.25}
              />
            </g>
          );
        })}
      </svg>

      {/* Header Overlay */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          opacity: entrance,
          transform: `translateY(${interpolate(entrance, [0, 1], [16, 0])}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(99, 102, 241, 0.16)",
            border: "1px solid rgba(129, 140, 248, 0.4)",
            color: "#a5b4fc",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 14,
          }}
        >
          CATEGORY I // PRACTICE 46
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 6 }}>
          {subtitle}
        </div>
      </div>

      {/* Layer Legend Pills */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          right: 80,
          display: "flex",
          gap: 16,
          opacity: entrance,
        }}
      >
        {RIBBONS.map((r, idx) => (
          <div
            key={r.id}
            style={{
              padding: "10px 20px",
              borderRadius: 14,
              backgroundColor: "rgba(15, 23, 42, 0.72)",
              border: `1px solid ${r.colors[0]}55`,
              color: "#e2e8f0",
              fontSize: 18,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: r.colors[0],
                boxShadow: `0 0 10px ${r.colors[0]}`,
              }}
            />
            Band 0{idx + 1}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
