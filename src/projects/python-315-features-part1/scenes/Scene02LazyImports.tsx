import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { CodeCard } from "../components/CodeCard";
import { FeatureBadge } from "../components/FeatureBadge";
import { MetricBadge } from "../components/MetricBadge";
import { THEME } from "../constants";
import { FEATURES_DATA } from "../content/copy";

export const Scene02LazyImports: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = FEATURES_DATA.lazyImports;

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.5 },
  });

  const takeawaySpring = spring({
    frame: frame - 28,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 160,
        paddingBottom: 380,
        paddingLeft: 60,
        paddingRight: 150,
      }}
    >
      <Background accentGlowColor={THEME.pythonBlue} />

      {/* TOP ZONE */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          textAlign: "center",
          width: "100%",
          transform: `translateY(${(1 - headerSpring) * -30}px)`,
          opacity: headerSpring,
        }}
      >
        {/* Subtle Series Label */}
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 24,
            fontWeight: 600,
            color: THEME.pythonYellow,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Python 3.15 Features • 1 of 3
        </span>

        {/* Badge Pill */}
        <FeatureBadge icon={data.icon} index={data.index} tag={data.tag} delay={2} />

        {/* Big Bold Title */}
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 80,
            fontWeight: 800,
            color: THEME.textPrimary,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {data.title}
        </div>

        {/* High-Contrast Summary */}
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 38,
            fontWeight: 400,
            color: "#cbd5e1",
            maxWidth: 860,
            lineHeight: 1.35,
          }}
        >
          {data.summary}
        </div>
      </div>

      {/* MIDDLE ZONE: Expanded Code Card */}
      <div style={{ margin: "10px 0" }}>
        <CodeCard snippet={data.snippet} delay={10} glowColor={THEME.pythonBlue} />
      </div>

      {/* BOTTOM ZONE: Speed Benchmark Card + Visual takeaway */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          width: "100%",
        }}
      >
        {data.metric && <MetricBadge metric={data.metric} delay={22} />}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 32px",
            borderRadius: 999,
            backgroundColor: "rgba(56, 189, 248, 0.12)",
            border: `1.5px solid rgba(56, 189, 248, 0.4)`,
            color: "#38bdf8",
            fontFamily: "Inter, sans-serif",
            fontSize: 26,
            fontWeight: 600,
            transform: `scale(${takeawaySpring})`,
            opacity: takeawaySpring,
          }}
        >
          <span>🚀</span>
          <span>Zero startup penalty for unused submodules</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
