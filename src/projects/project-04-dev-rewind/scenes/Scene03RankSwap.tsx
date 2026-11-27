import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { WRAPPED } from "../constants";

interface StackItem {
  id: string;
  name: string;
  color: string;
  baseCommits: number;
  finalCommits: number;
  startSlot: number;
  endSlot: number;
}

const ITEMS: StackItem[] = [
  {
    id: "ts",
    name: "TypeScript",
    color: WRAPPED.cyan,
    baseCommits: 1390,
    finalCommits: 1840,
    startSlot: 1,
    endSlot: 0,
  },
  {
    id: "react",
    name: "React",
    color: WRAPPED.violet,
    baseCommits: 1420,
    finalCommits: 1420,
    startSlot: 0,
    endSlot: 1,
  },
  {
    id: "python",
    name: "Python",
    color: WRAPPED.gold,
    baseCommits: 940,
    finalCommits: 940,
    startSlot: 2,
    endSlot: 2,
  },
  {
    id: "rust",
    name: "Rust",
    color: WRAPPED.magenta,
    baseCommits: 610,
    finalCommits: 610,
    startSlot: 3,
    endSlot: 3,
  },
];

const CARD_HEIGHT = 166;
const CARD_GAP = 28;
const SLOT_STEP = CARD_HEIGHT + CARD_GAP;
const SWAP_FRAME = 42;

export const Scene03RankSwap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const swapSpring = spring({
    frame: frame - SWAP_FRAME,
    fps,
    config: { damping: 13, mass: 0.65, stiffness: 110 },
  });

  const swapped = frame >= SWAP_FRAME + 12;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WRAPPED.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        padding: "200px 72px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 38%, rgba(56, 189, 248, 0.18) 0%, rgba(15, 7, 32, 0) 68%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: WRAPPED.cyan,
              letterSpacing: 2.5,
              marginBottom: 14,
            }}
          >
            TOP STACK 2026
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: WRAPPED.text,
              letterSpacing: -2,
              lineHeight: 1.05,
            }}
          >
            {swapped ? "New #1 Crowned" : "Your Top Tools"}
          </div>
        </div>

        {/* Leaderboard Container */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: SLOT_STEP * 4,
          }}
        >
          {ITEMS.map((item, idx) => {
            const enter = spring({
              frame: frame - idx * 5,
              fps,
              config: { damping: 14, mass: 0.5, stiffness: 120 },
            });

            const slot = interpolate(
              swapSpring,
              [0, 1],
              [item.startSlot, item.endSlot]
            );
            const yPos = slot * SLOT_STEP;
            const commits = Math.round(
              interpolate(
                swapSpring,
                [0, 1],
                [item.baseCommits, item.finalCommits]
              )
            );
            const rankNum =
              item.id === "ts"
                ? swapped
                  ? 1
                  : 2
                : item.id === "react"
                  ? swapped
                    ? 2
                    : 1
                  : item.startSlot + 1;

            const isMovingUp = item.id === "ts" && swapSpring > 0.02 && swapSpring < 0.98;
            const isWinner = item.id === "ts" && swapped;
            const cardScale = isMovingUp ? 1.04 : 1;

            return (
              <div
                key={item.id}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: CARD_HEIGHT,
                  transform: `translateY(${yPos}px) scale(${enter * cardScale})`,
                  opacity: enter,
                  zIndex: item.id === "ts" ? 10 : 1,
                  borderRadius: 28,
                  padding: "0 36px",
                  backgroundColor: isWinner
                    ? "rgba(56, 189, 248, 0.14)"
                    : WRAPPED.surface,
                  border: `2px solid ${
                    isWinner ? WRAPPED.cyan : WRAPPED.border
                  }`,
                  boxShadow: isMovingUp
                    ? "0 24px 60px rgba(56, 189, 248, 0.35)"
                    : "0 14px 36px rgba(0, 0, 0, 0.45)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 20,
                      backgroundColor: `${item.color}22`,
                      border: `2px solid ${item.color}`,
                      color: item.color,
                      fontSize: 34,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    #{rankNum}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 42,
                        fontWeight: 800,
                        color: WRAPPED.text,
                      }}
                    >
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: 22,
                        color: isWinner ? WRAPPED.gold : WRAPPED.muted,
                        fontWeight: 600,
                      }}
                    >
                      {isWinner ? "★ #1 Most Used Tool" : "Active Repository Stack"}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: 40,
                      fontWeight: 900,
                      color: item.color,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {commits.toLocaleString()}
                  </div>
                  <div style={{ fontSize: 18, color: WRAPPED.muted, fontWeight: 600 }}>
                    commits
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
