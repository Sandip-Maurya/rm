import React, { useMemo } from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { PathMorphingProps } from "./types";

interface Point2D {
  x: number;
  y: number;
}

interface MorphShapeDef {
  name: string;
  tag: string;
  color: string;
  glow: string;
  path: string;
}

// All shapes centered around (300, 300) in a 600x600 SVG coordinate space,
// authored in clockwise perimeter order starting near top-center to eliminate twist.
const SHAPE_DEFS: MorphShapeDef[] = [
  {
    name: "Circle",
    tag: "01 // PRIMITIVE",
    color: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.45)",
    path: "M 300 100 A 200 200 0 1 1 299.9 100 Z",
  },
  {
    name: "Hexagon",
    tag: "02 // POLYGON",
    color: "#818cf8",
    glow: "rgba(129, 140, 248, 0.45)",
    path: "M 300 95 L 478 197 L 478 403 L 300 505 L 122 403 L 122 197 Z",
  },
  {
    name: "Lightning",
    tag: "03 // VECTOR BOLT",
    color: "#fbbf24",
    glow: "rgba(251, 191, 36, 0.48)",
    path: "M 335 80 L 420 80 L 330 265 L 445 265 L 245 520 L 285 320 L 175 320 Z",
  },
  {
    name: "Checkmark",
    tag: "04 // VERIFIED",
    color: "#34d399",
    glow: "rgba(52, 211, 153, 0.48)",
    path: "M 455 155 L 505 205 L 260 465 L 105 315 L 155 265 L 260 365 Z",
  },
];

const SAMPLE_COUNT = 128;

/** Sample N equidistant points along an SVG path using @remotion/paths and align start index to top-most vertex */
function samplePathPoints(d: string, numPoints: number): Point2D[] {
  const totalLen = getLength(d);
  const pts: Point2D[] = [];
  for (let i = 0; i < numPoints; i++) {
    const len = (i / numPoints) * totalLen;
    const pt = getPointAtLength(d, len);
    if (pt) {
      pts.push({ x: pt.x, y: pt.y });
    }
  }
  return pts;
}

function pointsToSvgPath(points: Point2D[]): string {
  if (points.length === 0) return "";
  const first = points[0];
  if (!first) return "";
  const parts: string[] = [`M ${first.x.toFixed(2)} ${first.y.toFixed(2)}`];
  for (let i = 1; i < points.length; i++) {
    const pt = points[i];
    if (pt) {
      parts.push(`L ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`);
    }
  }
  parts.push("Z");
  return parts.join(" ");
}

function lerpPoints(a: Point2D[], b: Point2D[], t: number): Point2D[] {
  return a.map((pa, idx) => {
    const pb = b[idx] ?? pa;
    return {
      x: pa.x + (pb.x - pa.x) * t,
      y: pa.y + (pb.y - pa.y) * t,
    };
  });
}

export const PathMorphing: React.FC<PathMorphingProps> = ({
  title = "Topologic SVG Morphing",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sampledShapes = useMemo(
    () => SHAPE_DEFS.map((s) => samplePathPoints(s.path, SAMPLE_COUNT)),
    []
  );

  // Morph timeline across 120 frames:
  // 0..15: Circle hold
  // 15..42: Circle -> Hexagon
  // 42..52: Hexagon hold
  // 52..78: Hexagon -> Lightning
  // 78..88: Lightning hold
  // 88..112: Lightning -> Checkmark
  // 112..120: Checkmark hold
  const seg1 = interpolate(frame, [15, 42], [0, 1], {
    easing: Easing.bezier(0.22, 1.12, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg2 = interpolate(frame, [52, 78], [0, 1], {
    easing: Easing.bezier(0.22, 1.12, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const seg3 = interpolate(frame, [88, 112], [0, 1], {
    easing: Easing.bezier(0.22, 1.12, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const shape0 = sampledShapes[0] ?? [];
  const shape1 = sampledShapes[1] ?? [];
  const shape2 = sampledShapes[2] ?? [];
  const shape3 = sampledShapes[3] ?? [];

  let activePoints: Point2D[] = shape0;
  let activeColor = SHAPE_DEFS[0]?.color ?? "#38bdf8";
  let activeStageIndex = 0;

  if (frame < 52) {
    activePoints = lerpPoints(shape0, shape1, seg1);
    activeColor = interpolateColors(
      seg1,
      [0, 1],
      [SHAPE_DEFS[0]?.color ?? "#38bdf8", SHAPE_DEFS[1]?.color ?? "#818cf8"]
    );
    activeStageIndex = seg1 > 0.5 ? 1 : 0;
  } else if (frame < 88) {
    activePoints = lerpPoints(shape1, shape2, seg2);
    activeColor = interpolateColors(
      seg2,
      [0, 1],
      [SHAPE_DEFS[1]?.color ?? "#818cf8", SHAPE_DEFS[2]?.color ?? "#fbbf24"]
    );
    activeStageIndex = seg2 > 0.5 ? 2 : 1;
  } else {
    activePoints = lerpPoints(shape2, shape3, seg3);
    activeColor = interpolateColors(
      seg3,
      [0, 1],
      [SHAPE_DEFS[2]?.color ?? "#fbbf24", SHAPE_DEFS[3]?.color ?? "#34d399"]
    );
    activeStageIndex = seg3 > 0.5 ? 3 : 2;
  }

  const morphedPath = pointsToSvgPath(activePoints);
  const currentDef = SHAPE_DEFS[activeStageIndex] ?? SHAPE_DEFS[0];

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0f172a 0%, #050814 62%, #020308 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Dynamic color-matched ambient halo */}
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${activeColor}33 0%, rgba(0,0,0,0) 68%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top Header */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: entrance,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(56, 189, 248, 0.14)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              color: "#7dd3fc",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            CATEGORY I // PRACTICE 45
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
            border: `1px solid ${activeColor}66`,
            color: activeColor,
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.06em",
          }}
        >
          {currentDef?.tag}
        </div>
      </div>

      {/* Central Morphing Vector Stage */}
      <div
        style={{
          width: 560,
          height: 560,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${entrance})`,
        }}
      >
        <svg width="560" height="560" viewBox="0 0 600 600" style={{ overflow: "visible" }}>
          <defs>
            <filter id="morph-glow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="14" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="morph-fill-grad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="45%" stopColor={activeColor} stopOpacity="0.34" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0.14" />
            </radialGradient>
          </defs>

          {/* Subtle blueprint coordinate ring */}
          <circle
            cx="300"
            cy="300"
            r="245"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="2"
            strokeDasharray="8 10"
          />

          {/* Soft translucent fill */}
          <path
            d={morphedPath}
            fill="url(#morph-fill-grad)"
            stroke={activeColor}
            strokeWidth="12"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#morph-glow)"
          />

          {/* Crisp inner white highlight core */}
          <path
            d={morphedPath}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={0.65}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Bottom Shape Stepper Pills */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          display: "flex",
          gap: 16,
          opacity: entrance,
        }}
      >
        {SHAPE_DEFS.map((shape, idx) => {
          const isActive = idx === activeStageIndex;
          return (
            <div
              key={shape.name}
              style={{
                padding: "12px 24px",
                borderRadius: 9999,
                backgroundColor: isActive
                  ? `${shape.color}28`
                  : "rgba(15, 23, 42, 0.72)",
                border: isActive
                  ? `2px solid ${shape.color}`
                  : "1px solid rgba(255, 255, 255, 0.1)",
                color: isActive ? "#ffffff" : "#64748b",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              {shape.name}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
