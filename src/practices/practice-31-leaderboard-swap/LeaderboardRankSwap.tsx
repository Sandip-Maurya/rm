import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LeaderboardRankSwapProps } from "./types";

const DEFAULT_ENTRIES = [
  {
    id: "alpha",
    name: "Alpha Corp",
    avatar: "🚀",
    scoreBefore: 9420,
    scoreAfter: 9420,
    badge: "INCUMBENT",
  },
  {
    id: "bravo",
    name: "Bravo Systems",
    avatar: "⚡",
    scoreBefore: 8850,
    scoreAfter: 10450, // Points surge!
    badge: "NEW LEADER",
  },
  {
    id: "charlie",
    name: "Charlie Network",
    avatar: "🛡️",
    scoreBefore: 7890,
    scoreAfter: 7890,
    badge: "STEADY",
  },
  {
    id: "delta",
    name: "Delta Protocol",
    avatar: "💎",
    scoreBefore: 6720,
    scoreAfter: 6720,
    badge: "RISING",
  },
];

export const LeaderboardRankSwap: React.FC<LeaderboardRankSwapProps> = ({
  title = "GLOBAL DEVELOPER LEADERBOARD",
  subtitle = "Dynamic Layout Physics • Coordinate Interpolation & Rank Swap",
  entries = DEFAULT_ENTRIES,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for card container
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // Rank Swap Trigger at Frame 45
  const swapSpring = spring({
    frame: frame - 45,
    fps,
    config: { damping: 13, mass: 0.65, stiffness: 110 },
  });

  const cardHeight = 90;
  const cardGap = 20;
  const slotDistance = cardHeight + cardGap; // 110px

  // Score counter interpolation for Bravo (surge from 8,850 to 10,450)
  const bravoScore = Math.round(
    interpolate(swapSpring, [0, 1], [entries[1].scoreBefore, entries[1].scoreAfter])
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060812",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Leaderboard Card */}
      <div
        style={{
          width: 1100,
          backgroundColor: "#0d111c",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 32,
          padding: "48px 56px",
          boxShadow:
            "0 35px 90px -20px rgba(0,0,0,0.95), 0 0 50px rgba(234, 179, 8, 0.08)",
          transform: `scale(${containerEntrance})`,
          opacity: containerEntrance,
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(234, 179, 8, 0.15)",
              border: "1px solid rgba(251, 191, 36, 0.35)",
              color: "#fbbf24",
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            ★ REAL-TIME POWER RANKINGS
          </div>

          <h1
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              margin: 0,
            }}
          >
            {title}
          </h1>

          <p
            style={{
              fontSize: 22,
              color: "#94a3b8",
              fontWeight: 500,
              margin: "8px 0 0 0",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Leaderboard Stack Canvas (Slot positions: 0, 1, 2, 3) */}
        <div
          style={{
            position: "relative",
            height: slotDistance * 4,
            width: "100%",
          }}
        >
          {entries.map((item, idx) => {
            // Coordinate determination:
            // Item 0 (Alpha): starts at slot 0 (0px), moves to slot 1 (110px)
            // Item 1 (Bravo): starts at slot 1 (110px), surges to slot 0 (0px)
            // Item 2 (Charlie): stays at slot 2 (220px)
            // Item 3 (Delta): stays at slot 3 (330px)
            let currentY = idx * slotDistance;
            let isClimbing = false;
            let currentRank = idx + 1;

            if (idx === 0) {
              currentY = interpolate(swapSpring, [0, 1], [0, slotDistance]);
              currentRank = swapSpring >= 0.5 ? 2 : 1;
            } else if (idx === 1) {
              currentY = interpolate(swapSpring, [0, 1], [slotDistance, 0]);
              isClimbing = true;
              currentRank = swapSpring >= 0.5 ? 1 : 2;
            }

            // High elevation shadow and scaling for climbing item
            const zIndex = isClimbing ? 20 : 10;
            const elevationScale = isClimbing
              ? interpolate(swapSpring, [0, 0.5, 1], [1, 1.03, 1])
              : 1;

            const scoreDisplay = idx === 1 ? bravoScore : item.scoreBefore;
            const isFirstPlace = currentRank === 1;

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: cardHeight,
                  transform: `translate3d(0, ${currentY}px, 0) scale(${elevationScale})`,
                  zIndex,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 36px",
                  borderRadius: 20,
                  backgroundColor: isFirstPlace
                    ? "rgba(234, 179, 8, 0.12)"
                    : "rgba(255, 255, 255, 0.04)",
                  border: isFirstPlace
                    ? "1.5px solid rgba(251, 191, 36, 0.5)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: isClimbing
                    ? `0 20px 40px rgba(0,0,0,0.8), 0 0 ${
                        swapSpring * 30
                      }px rgba(251, 191, 36, 0.4)`
                    : "0 8px 20px rgba(0,0,0,0.4)",
                  transition: "background-color 0.2s ease, border 0.2s ease",
                }}
              >
                {/* Left: Rank Number + Avatar + Name */}
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  {/* Rank badge */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: isFirstPlace ? "#fbbf24" : "#1e293b",
                      color: isFirstPlace ? "#000000" : "#94a3b8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 900,
                    }}
                  >
                    #{currentRank}
                  </div>

                  <span style={{ fontSize: 36 }}>{item.avatar}</span>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: "#f8fafc",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.name}
                    </span>
                    <span
                      style={{
                        fontSize: 16,
                        color: isFirstPlace ? "#fde047" : "#64748b",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                      }}
                    >
                      {idx === 1 && swapSpring >= 0.5
                        ? "★ CURRENT LEADER"
                        : item.badge}
                    </span>
                  </div>
                </div>

                {/* Right: Live Score */}
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  {idx === 1 && swapSpring > 0.1 && (
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 800,
                        color: "#34d399",
                        padding: "4px 10px",
                        borderRadius: 8,
                        backgroundColor: "rgba(52, 211, 153, 0.18)",
                      }}
                    >
                      +1,600 PTS
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 34,
                      fontWeight: 900,
                      color: isFirstPlace ? "#fbbf24" : "#ffffff",
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {scoreDisplay.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
