import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

interface FlowEdgeProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  appearFrame: number;
  drawDuration?: number;
  color: string;
  dashed?: boolean;
  packetCount?: number;
  packetSpeed?: number; // cycles per 100 frames
  dimmed?: boolean;
  label?: string;
}

const quadPoint = (
  t: number,
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number }
) => {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  };
};

export const FlowEdge: React.FC<FlowEdgeProps> = ({
  x1,
  y1,
  x2,
  y2,
  cx,
  cy,
  appearFrame,
  drawDuration = 22,
  color,
  dashed = false,
  packetCount = 2,
  packetSpeed = 1.6,
  dimmed = false,
  label,
}) => {
  const frame = useCurrentFrame();

  if (frame < appearFrame) {
    return null;
  }

  const drawProgress = interpolate(
    frame,
    [appearFrame, appearFrame + drawDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  // Approximate path length generously for dashoffset draw-in
  const approxLength = Math.hypot(x2 - x1, y2 - y1) * 1.35 + 60;
  const pathD = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

  // Arrowhead tangent at t = 1 points along (x2 - cx, y2 - cy)
  const angleDeg = (Math.atan2(y2 - cy, x2 - cx) * 180) / Math.PI;
  const midPt = quadPoint(0.5, { x: x1, y: y1 }, { x: cx, y: cy }, { x: x2, y: y2 });
  const opacity = dimmed ? 0.25 : 0.92;

  return (
    <g style={{ opacity }}>
      {/* Soft glow path */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeOpacity={0.14}
        strokeDasharray={approxLength}
        strokeDashoffset={approxLength * (1 - drawProgress)}
      />

      {/* Core connector line */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2.6}
        strokeDasharray={dashed ? "8 7" : approxLength}
        strokeDashoffset={
          dashed
            ? -(frame * 0.8)
            : approxLength * (1 - drawProgress)
        }
        strokeOpacity={dashed ? drawProgress * 0.9 : 0.9}
        strokeLinecap="round"
      />

      {/* Arrowhead */}
      {drawProgress > 0.88 && (
        <polygon
          points="-10,-6 2,0 -10,6"
          fill={color}
          transform={`translate(${x2}, ${y2}) rotate(${angleDeg})`}
          opacity={interpolate(drawProgress, [0.88, 1], [0, 1])}
        />
      )}

      {/* Traveling deterministic data packets */}
      {drawProgress >= 1 &&
        Array.from({ length: packetCount }).map((_, idx) => {
          const offset = idx / packetCount;
          const t = ((frame - appearFrame) * (packetSpeed / 100) + offset) % 1;
          const pt = quadPoint(t, { x: x1, y: y1 }, { x: cx, y: cy }, { x: x2, y: y2 });
          return (
            <g key={idx}>
              <circle cx={pt.x} cy={pt.y} r={8} fill={color} fillOpacity={0.28} />
              <circle cx={pt.x} cy={pt.y} r={4.2} fill="#FFFFFF" />
            </g>
          );
        })}

      {/* Optional edge label pill */}
      {label && drawProgress > 0.65 && (
        <g
          transform={`translate(${midPt.x}, ${midPt.y - 18})`}
          opacity={interpolate(drawProgress, [0.65, 1], [0, 1])}
        >
          <rect
            x={-(label.length * 4.2 + 12)}
            y={-13}
            width={label.length * 8.4 + 24}
            height={24}
            rx={999}
            fill="#0F172A"
            stroke={color}
            strokeWidth={1.2}
          />
          <text
            x={0}
            y={3}
            textAnchor="middle"
            fill={color}
            fontSize={12}
            fontWeight={700}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  );
};
