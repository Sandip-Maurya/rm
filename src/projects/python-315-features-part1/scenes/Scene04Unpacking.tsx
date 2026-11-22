import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { CodeCard } from "../components/CodeCard";
import { FeatureBadge } from "../components/FeatureBadge";
import { THEME } from "../constants";
import { FEATURES_DATA } from "../content/copy";

export const Scene04Unpacking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = FEATURES_DATA.unpacking;

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.5 },
  });

  const row1Spring = spring({
    frame: frame - 22,
    fps,
    config: { damping: 13, mass: 0.5 },
  });

  const row2Spring = spring({
    frame: frame - 30,
    fps,
    config: { damping: 13, mass: 0.5 },
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
      <Background accentGlowColor={THEME.pythonYellow} />

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
          Python 3.15 Features • 3 of 3
        </span>

        <FeatureBadge icon={data.icon} index={data.index} tag={data.tag} delay={2} />

        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 76,
            fontWeight: 800,
            color: THEME.textPrimary,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          {data.title}
        </div>

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

      {/* MIDDLE ZONE */}
      <div style={{ margin: "10px 0" }}>
        <CodeCard snippet={data.snippet} delay={10} glowColor={THEME.pythonYellow} />
      </div>

      {/* BOTTOM ZONE: 2-Row Stacked Before vs Now Comparison Card */}
      <div
        style={{
          width: 870,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          padding: "20px 24px",
          borderRadius: 22,
          backgroundColor: "rgba(15, 23, 42, 0.96)",
          border: `2px solid rgba(250, 204, 21, 0.35)`,
          boxShadow: "0 18px 45px rgba(0, 0, 0, 0.55)",
        }}
      >
        {/* Row 1: Old Syntax */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderRadius: 14,
            backgroundColor: "rgba(239, 68, 68, 0.08)",
            border: "1.5px solid rgba(239, 68, 68, 0.25)",
            transform: `translateX(${(1 - row1Spring) * -30}px)`,
            opacity: row1Spring,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: THEME.accentRed,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              minWidth: 160,
            }}
          >
            ❌ Before
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 28,
              fontWeight: 500,
              color: "#cbd5e1",
              letterSpacing: "-0.01em",
            }}
          >
            list(itertools.chain.from_iterable(matrix))
          </span>
        </div>

        {/* Row 2: Python 3.15 Syntax */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderRadius: 14,
            backgroundColor: "rgba(74, 222, 128, 0.12)",
            border: "1.5px solid rgba(74, 222, 128, 0.4)",
            boxShadow: "0 0 25px rgba(74, 222, 128, 0.15)",
            transform: `translateX(${(1 - row2Spring) * 30}px)`,
            opacity: row2Spring,
          }}
        >
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: THEME.pythonGreen,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              minWidth: 160,
            }}
          >
            ✅ Python 3.15
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 28,
              fontWeight: 600,
              color: THEME.pythonYellow,
            }}
          >
            [x for *row in matrix for x in row]
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
