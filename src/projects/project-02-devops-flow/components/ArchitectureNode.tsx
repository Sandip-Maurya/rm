import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, NODE_HEIGHT, NODE_WIDTH } from "../constants";
import type { NodeKind } from "../types";

interface ArchitectureNodeProps {
  kind: NodeKind;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  appearFrame: number;
  statusLabel: string;
  accentColor: string;
  loadPercent: number;
  dimmed?: boolean;
  focused?: boolean;
}

const NodeIcon: React.FC<{ kind: NodeKind; color: string }> = ({ kind, color }) => {
  switch (kind) {
    case "client":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case "api":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
    case "postgres":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      );
    case "redis":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "kafka":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "workers":
      return (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      );
  }
};

export const ArchitectureNode: React.FC<ArchitectureNodeProps> = ({
  kind,
  x,
  y,
  title,
  subtitle,
  appearFrame,
  statusLabel,
  accentColor,
  loadPercent,
  dimmed = false,
  focused = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < appearFrame) {
    return null;
  }

  const entrance = spring({
    frame: frame - appearFrame,
    fps,
    config: { damping: 13, mass: 0.55, stiffness: 120 },
  });

  const scale = interpolate(entrance, [0, 1], [0.78, 1]);
  const translateY = interpolate(entrance, [0, 1], [24, 0]);
  const targetOpacity = dimmed ? 0.38 : 1;
  const opacity = entrance * targetOpacity;

  return (
    <div
      style={{
        position: "absolute",
        left: x - NODE_WIDTH / 2,
        top: y - NODE_HEIGHT / 2,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        borderRadius: 20,
        backgroundColor: COLORS.cardBg,
        border: `2px solid ${focused ? accentColor : COLORS.cardBorder}`,
        boxShadow: focused
          ? `0 18px 45px rgba(0,0,0,0.55), 0 0 28px ${accentColor}40`
          : "0 14px 32px rgba(0,0,0,0.42)",
        padding: "16px 18px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header Row: Icon + Status Pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: `${accentColor}1A`,
            border: `1.5px solid ${accentColor}55`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NodeIcon kind={kind} color={accentColor} />
        </div>

        <div
          style={{
            padding: "5px 10px",
            borderRadius: 999,
            backgroundColor: `${accentColor}1F`,
            border: `1px solid ${accentColor}66`,
            color: accentColor,
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            letterSpacing: 0.4,
          }}
        >
          {statusLabel}
        </div>
      </div>

      {/* Title & Subtitle */}
      <div>
        <div
          style={{
            color: COLORS.textPrimary,
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
        <div
          style={{
            color: COLORS.textSecondary,
            fontSize: 14,
            fontWeight: 500,
            marginTop: 2,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Mini Utilization Bar */}
      <div
        style={{
          width: "100%",
          height: 5,
          borderRadius: 999,
          backgroundColor: "rgba(148, 163, 184, 0.16)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.max(4, Math.min(100, loadPercent))}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: accentColor,
          }}
        />
      </div>
    </div>
  );
};
