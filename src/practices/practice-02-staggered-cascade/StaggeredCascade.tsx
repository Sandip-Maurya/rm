import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { StaggeredCascadeProps, KpiPillItem } from "./types";

const defaultItems: KpiPillItem[] = [
  { label: "Users", value: "+18%", isPositive: true },
  { label: "Churn", value: "1.2%", isPositive: false },
  { label: "NPS", value: "74", isPositive: true },
  { label: "LTV", value: "$480", isPositive: true },
];

export const StaggeredCascade: React.FC<StaggeredCascadeProps> = ({
  title = "Performance Indicators",
  items = defaultItems,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header entrance spring
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const headerOpacity = interpolate(headerEntrance, [0, 1], [0, 1]);
  const headerTranslateY = interpolate(headerEntrance, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        gap: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerTranslateY}px)`,
          color: "#a1a1aa",
          fontSize: 36,
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>

      {/* 4 KPI Pill Badges with Staggered Cascading Animation */}
      <div
        style={{
          display: "flex",
          gap: 24,
          alignItems: "center",
        }}
      >
        {items.map((item, index) => {
          // Practice 02 Math:
          // Time-offset indexing: frame - (index * delay)
          const delay = index * 6; // 6-frame delay between each pill
          const currentPillFrame = frame - delay;

          // Guard: negative frames must evaluate to 0 before delay starts
          const progress = spring({
            frame: currentPillFrame,
            fps,
            config: { damping: 14, mass: 0.6 },
          });

          const scale = interpolate(progress, [0, 1], [0.75, 1]);
          const translateY = interpolate(progress, [0, 1], [50, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <div
              key={item.label}
              style={{
                opacity,
                transform: `translateY(${translateY}px) scale(${scale})`,
                background:
                  "linear-gradient(145deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.03) 100%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                boxShadow:
                  "0 20px 45px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.18)",
                borderRadius: 24,
                padding: "24px 36px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                minWidth: 200,
              }}
            >
              <span
                style={{
                  color: "#94a3b8",
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  color: item.isPositive ? "#4ade80" : "#f87171",
                  fontSize: 52,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
