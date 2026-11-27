import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BEATS,
  COLORS,
  NODE_HEIGHT,
  NODE_POSITIONS,
  NODE_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../constants";

interface FocusRect {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  label: string;
}

const PAD = 24;

const POSTGRES_RECT: FocusRect = {
  x: NODE_POSITIONS.postgres.x - NODE_WIDTH / 2 - PAD,
  y: NODE_POSITIONS.postgres.y - NODE_HEIGHT / 2 - PAD,
  w: NODE_WIDTH + PAD * 2,
  h: NODE_HEIGHT + PAD * 2,
  color: COLORS.coral,
  label: "BOTTLENECK // HIGH READ LOAD",
};

const REDIS_RECT: FocusRect = {
  x: NODE_POSITIONS.redis.x - NODE_WIDTH / 2 - PAD,
  y: NODE_POSITIONS.redis.y - NODE_HEIGHT / 2 - PAD,
  w: NODE_WIDTH + PAD * 2,
  h: NODE_HEIGHT + PAD * 2,
  color: COLORS.sky,
  label: "CACHE LAYER // ABSORBING READS",
};

const QUEUE_CLUSTER_RECT: FocusRect = {
  x: NODE_POSITIONS.kafka.x - NODE_WIDTH / 2 - PAD,
  y: NODE_POSITIONS.kafka.y - NODE_HEIGHT / 2 - PAD,
  w:
    NODE_POSITIONS.workers.x -
    NODE_POSITIONS.kafka.x +
    NODE_WIDTH +
    PAD * 2,
  h: NODE_HEIGHT + PAD * 2,
  color: COLORS.violet,
  label: "ASYNC PIPELINE // OFF-LOADING JOBS",
};

const lerpRect = (a: FocusRect, b: FocusRect, t: number): FocusRect => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  w: a.w + (b.w - a.w) * t,
  h: a.h + (b.h - a.h) * t,
  color: t < 0.5 ? a.color : b.color,
  label: t < 0.5 ? a.label : b.label,
});

export const FocusBox: React.FC = () => {
  const frame = useCurrentFrame();

  let rect = POSTGRES_RECT;
  let opacity = 0;

  if (frame >= BEATS.bottleneck.start && frame < BEATS.cache.start) {
    rect = POSTGRES_RECT;
    opacity = interpolate(
      frame,
      [BEATS.bottleneck.start + 5, BEATS.bottleneck.start + 22],
      [0, 1],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  } else if (frame >= BEATS.cache.start && frame < BEATS.queue.start) {
    const t = interpolate(
      frame,
      [BEATS.cache.start, BEATS.cache.start + 26],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );
    rect = lerpRect(POSTGRES_RECT, REDIS_RECT, t);
    opacity = 1;
  } else if (frame >= BEATS.queue.start && frame < BEATS.resolution.start) {
    const t = interpolate(
      frame,
      [BEATS.queue.start, BEATS.queue.start + 28],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      }
    );
    rect = lerpRect(REDIS_RECT, QUEUE_CLUSTER_RECT, t);
    opacity = 1;
  } else if (frame >= BEATS.resolution.start) {
    rect = QUEUE_CLUSTER_RECT;
    opacity = interpolate(
      frame,
      [BEATS.resolution.start, BEATS.resolution.start + 18],
      [1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
  }

  if (opacity <= 0.01) {
    return null;
  }

  const dashOffset = -(frame * 1.6);
  const pulse = 0.85 + Math.sin(frame * 0.16) * 0.15;

  return (
    <svg
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* Subtle tint fill */}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        rx={26}
        fill={rect.color}
        fillOpacity={0.06 * pulse}
      />

      {/* Marching-ants dashed border */}
      <rect
        x={rect.x}
        y={rect.y}
        width={rect.w}
        height={rect.h}
        rx={26}
        fill="none"
        stroke={rect.color}
        strokeWidth={3}
        strokeDasharray="14 10"
        strokeDashoffset={dashOffset}
        strokeOpacity={0.95}
      />

      {/* Floating focus tag pill */}
      <g transform={`translate(${rect.x + 14}, ${rect.y - 16})`}>
        <rect
          x={0}
          y={-18}
          width={rect.label.length * 9.5 + 28}
          height={32}
          rx={10}
          fill="#0F172A"
          stroke={rect.color}
          strokeWidth={1.8}
        />
        <text
          x={14}
          y={3}
          fill={rect.color}
          fontSize={14}
          fontWeight={700}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          letterSpacing={0.8}
        >
          {rect.label}
        </text>
      </g>
    </svg>
  );
};
