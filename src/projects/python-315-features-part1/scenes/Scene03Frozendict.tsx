import React from "react";
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Background } from "../components/Background";
import { CodeCard } from "../components/CodeCard";
import { FeatureBadge } from "../components/FeatureBadge";
import { THEME } from "../constants";
import { FEATURES_DATA } from "../content/copy";

export const Scene03Frozendict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = FEATURES_DATA.frozendict;

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 13, mass: 0.5 },
  });

  const lockPop = spring({
    frame: frame - 25,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 140 },
  });

  // Simplified perks: Removed small description, increased icon and title size for punchy mobile readability
  const perks = [
    { icon: "🔒", title: "100% Immutable" },
    { icon: "🔑", title: "Hashable Key" },
    { icon: "🧵", title: "Thread-Safe" },
  ];

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
      <Background accentGlowColor="#38bdf8" />

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
          Python 3.15 Features • 2 of 3
        </span>

        <FeatureBadge icon={data.icon} index={data.index} tag={data.tag} delay={2} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, Inter, sans-serif",
              fontSize: 82,
              fontWeight: 800,
              color: "#38bdf8",
              letterSpacing: "-0.03em",
            }}
          >
            {data.title}
          </span>
          <div
            style={{
              fontSize: 60,
              transform: `scale(${lockPop}) rotate(${(1 - lockPop) * 20}deg)`,
              opacity: lockPop,
            }}
          >
            🔒
          </div>
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
        <CodeCard snippet={data.snippet} delay={10} glowColor="#38bdf8" />
      </div>

      {/* BOTTOM ZONE: Clean, high-impact perk cards without illegible text */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          width: 870,
        }}
      >
        {perks.map((perk, i) => {
          const perkEntrance = spring({
            frame: frame - 22 - i * 6,
            fps,
            config: { damping: 13, mass: 0.5 },
          });

          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "24px 16px",
                borderRadius: 22,
                backgroundColor: "rgba(15, 23, 42, 0.95)",
                border: "2px solid rgba(56, 189, 248, 0.4)",
                boxShadow: "0 14px 35px rgba(0, 0, 0, 0.5)",
                transform: `scale(${perkEntrance}) translateY(${(1 - perkEntrance) * 20}px)`,
                opacity: perkEntrance,
              }}
            >
              <span style={{ fontSize: 48, lineHeight: 1 }}>{perk.icon}</span>
              <span
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: 26,
                  fontWeight: 700,
                  color: "#f8fafc",
                  textAlign: "center",
                  letterSpacing: "-0.01em",
                }}
              >
                {perk.title}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
