import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { THEME } from "../constants";

interface CodeToken {
  text: string;
  color: string;
}

const renderTokens = (tokens: CodeToken[]) =>
  tokens.map((t, i) => (
    <span key={i} style={{ color: t.color }}>
      {t.text}
    </span>
  ));

const BEFORE_LINES: CodeToken[][] = [
  [
    { text: "async function ", color: THEME.purple },
    { text: "loadDashboard", color: THEME.sky },
    { text: "(id: ", color: THEME.text },
    { text: "string", color: THEME.amber },
    { text: ") {", color: THEME.text },
  ],
  [
    { text: "  const ", color: THEME.purple },
    { text: "results", color: THEME.text },
    { text: " = [];", color: THEME.text },
  ],
  [
    { text: "  for ", color: THEME.coral },
    { text: "(", color: THEME.text },
    { text: "const ", color: THEME.purple },
    { text: "task ", color: THEME.text },
    { text: "of ", color: THEME.coral },
    { text: "tasks) {", color: THEME.text },
  ],
  [
    { text: "    results.push(", color: THEME.text },
    { text: "await ", color: THEME.coral },
    { text: "task(id));", color: THEME.sky },
  ],
  [{ text: "  }", color: THEME.text }],
  [
    { text: "  return ", color: THEME.purple },
    { text: "results;", color: THEME.text },
  ],
  [{ text: "}", color: THEME.text }],
];

const AFTER_LINES: CodeToken[][] = [
  [
    { text: "async function ", color: THEME.purple },
    { text: "loadDashboard", color: THEME.sky },
    { text: "(id: ", color: THEME.text },
    { text: "string", color: THEME.amber },
    { text: ") {", color: THEME.text },
  ],
  [
    { text: "  // Fire all independent calls together", color: THEME.muted },
  ],
  [
    { text: "  const ", color: THEME.purple },
    { text: "results ", color: THEME.text },
    { text: "= ", color: THEME.text },
    { text: "await ", color: THEME.emerald },
    { text: "Promise.all(", color: THEME.emerald },
  ],
  [
    { text: "    tasks.", color: THEME.text },
    { text: "map", color: THEME.sky },
    { text: "((task) => task(id))", color: THEME.text },
  ],
  [{ text: "  );", color: THEME.emerald }],
  [
    { text: "  return ", color: THEME.purple },
    { text: "results;", color: THEME.text },
  ],
  [{ text: "}", color: THEME.text }],
];

const LINE_HEIGHT = 64;

export const Scene02CodeFix: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const windowSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 130 },
  });

  // Swap from blocking loop to Promise.all around frame 88 (right as narrator says "Swap it for Promise.all")
  const swapProgress = interpolate(frame, [86, 102], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const isFixed = swapProgress > 0.5;
  const activeColor = isFixed ? THEME.emerald : THEME.coral;
  const activeTop = 2 * LINE_HEIGHT; // Highlight rows 3-5
  const activeHeight = 3 * LINE_HEIGHT;
  const lines = isFixed ? AFTER_LINES : BEFORE_LINES;

  const badgeText = isFixed
    ? "✓ PARALLEL // 640ms"
    : "⚠ BLOCKING LOOP // 2,400ms";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Subtle radial accent */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isFixed
            ? "radial-gradient(circle at 50% 45%, rgba(16, 185, 129, 0.14) 0%, rgba(13, 17, 23, 0) 65%)"
            : "radial-gradient(circle at 50% 45%, rgba(244, 63, 94, 0.14) 0%, rgba(13, 17, 23, 0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* VS Code Window */}
      <div
        style={{
          width: 1440,
          borderRadius: 24,
          backgroundColor: THEME.surface,
          border: `1.5px solid ${THEME.border}`,
          boxShadow: "0 36px 90px rgba(0, 0, 0, 0.65)",
          overflow: "hidden",
          transform: `scale(${interpolate(windowSpring, [0, 1], [0.92, 1])})`,
          opacity: windowSpring,
        }}
      >
        {/* Editor Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 30px",
            backgroundColor: "#0D1117",
            borderBottom: `1px solid ${THEME.border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#EF4444" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
            <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#10B981" }} />
            <span
              style={{
                marginLeft: 18,
                fontSize: 22,
                color: THEME.text,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontWeight: 600,
              }}
            >
              dashboard.ts
            </span>
          </div>

          <div
            style={{
              padding: "8px 18px",
              borderRadius: 999,
              backgroundColor: `${activeColor}1F`,
              border: `1.5px solid ${activeColor}`,
              color: activeColor,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            {badgeText}
          </div>
        </div>

        {/* Code Body */}
        <div
          style={{
            position: "relative",
            padding: "36px 40px",
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 32,
          }}
        >
          {/* Active Line Highlight Box */}
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: 36 + activeTop,
              height: activeHeight,
              borderRadius: 12,
              backgroundColor: `${activeColor}16`,
              borderLeft: `5px solid ${activeColor}`,
              opacity: interpolate(frame, [22, 36], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              pointerEvents: "none",
            }}
          />

          {lines.map((tokens, idx) => {
            const lineSpring = spring({
              frame: frame - idx * 4,
              fps,
              config: { damping: 14, mass: 0.45, stiffness: 140 },
            });
            // Subtle crossfade pulse on lines 2-4 during swap
            const swapOpacity =
              idx >= 1 && idx <= 4
                ? Math.abs(swapProgress - 0.5) * 2
                : 1;

            return (
              <div
                key={idx}
                style={{
                  height: LINE_HEIGHT,
                  display: "flex",
                  alignItems: "center",
                  opacity: lineSpring * (0.25 + 0.75 * swapOpacity),
                  transform: `translateX(${interpolate(lineSpring, [0, 1], [-18, 0])}px)`,
                  whiteSpace: "pre",
                }}
              >
                <span
                  style={{
                    width: 56,
                    color: THEME.muted,
                    fontSize: 22,
                    userSelect: "none",
                  }}
                >
                  {idx + 1}
                </span>
                <span>{renderTokens(tokens)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
