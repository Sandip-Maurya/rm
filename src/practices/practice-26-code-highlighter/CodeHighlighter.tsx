import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { CodeHighlighterProps } from "./types";

interface Token {
  text: string;
  color: string;
}

const DEFAULT_LINES: { tokens: Token[] }[] = [
  {
    tokens: [
      { text: "import", color: "#f43f5e" },
      { text: " { interpolate, spring } ", color: "#f8fafc" },
      { text: "from", color: "#f43f5e" },
      { text: ' "remotion";', color: "#38bdf8" },
    ],
  },
  {
    tokens: [
      { text: "export", color: "#f43f5e" },
      { text: " const ", color: "#38bdf8" },
      { text: "MotionEngine", color: "#34d399" },
      { text: " = ({ frame, fps }) => {", color: "#f8fafc" },
    ],
  },
  {
    tokens: [
      { text: "  const", color: "#38bdf8" },
      { text: " scale = ", color: "#f8fafc" },
      { text: "spring", color: "#fbbf24" },
      { text: "({ frame, fps, config: { damping: ", color: "#f8fafc" },
      { text: "12", color: "#c084fc" },
      { text: " } });", color: "#f8fafc" },
    ],
  },
  {
    tokens: [
      { text: "  const", color: "#38bdf8" },
      { text: " opacity = ", color: "#f8fafc" },
      { text: "interpolate", color: "#fbbf24" },
      { text: "(frame, [", color: "#f8fafc" },
      { text: "0", color: "#c084fc" },
      { text: ", ", color: "#f8fafc" },
      { text: "25", color: "#c084fc" },
      { text: "], [", color: "#f8fafc" },
      { text: "0", color: "#c084fc" },
      { text: ", ", color: "#f8fafc" },
      { text: "1", color: "#c084fc" },
      { text: "]);", color: "#f8fafc" },
    ],
  },
  {
    tokens: [
      { text: "  return", color: "#f43f5e" },
      { text: " <", color: "#f8fafc" },
      { text: "div", color: "#34d399" },
      { text: " style={{ transform: `scale(${scale})`, opacity }} />;", color: "#f8fafc" },
    ],
  },
  {
    tokens: [
      { text: "};", color: "#f8fafc" },
    ],
  },
];

export const CodeHighlighter: React.FC<CodeHighlighterProps> = ({
  filename = "MotionEngine.tsx",
  lines = DEFAULT_LINES,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Window Entrance spring
  const windowEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const lineHeight = 54; // Sized for 1080p canvas

  // Calculate cumulative character timings for each line
  // We type at ~1.2 characters per frame (smooth typing cadence) with a pause between lines
  const framesPerChar = 0.8; // typing speed
  const pauseBetweenLines = 10; // realistic breath/pause before newline
  const typingStartFrame = 15;

  let currentStart = typingStartFrame;
  const lineSchedules = lines.map((line) => {
    const totalChars = line.tokens.reduce((acc, t) => acc + t.text.length, 0);
    const duration = Math.ceil(totalChars * framesPerChar);
    const start = currentStart;
    const end = start + duration;
    currentStart = end + pauseBetweenLines;
    return { start, end, totalChars };
  });

  // Determine current active line index for scanner/cursor
  let activeLineIdx = 0;
  for (let i = 0; i < lineSchedules.length; i++) {
    if (frame >= lineSchedules[i].start) {
      activeLineIdx = i;
    }
  }

  // Active line indicator tracks activeLineIdx with smooth spring/interpolation
  const indicatorY = interpolate(
    activeLineIdx,
    [0, lines.length - 1],
    [0, (lines.length - 1) * lineHeight],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070b14",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Code Editor Window */}
      <div
        style={{
          width: 1360,
          borderRadius: 24,
          backgroundColor: "#0d1117",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow:
            "0 35px 80px -20px rgba(0, 0, 0, 0.95), 0 0 45px rgba(56, 189, 248, 0.1)",
          overflow: "hidden",
          transform: `scale(${windowEntrance})`,
          opacity: windowEntrance,
        }}
      >
        {/* Editor Title Bar with Mac traffic lights */}
        <div
          style={{
            height: 64,
            backgroundColor: "#161b22",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 24px",
            position: "relative",
          }}
        >
          {/* Traffic lights */}
          <div style={{ display: "flex", gap: 10 }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#ff5f56",
              }}
            />
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#ffbd2e",
              }}
            />
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                backgroundColor: "#27c93f",
              }}
            />
          </div>

          {/* Active File Tab */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#e6edf3",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>{filename}</span>
          </div>
        </div>

        {/* Editor Body */}
        <div
          style={{
            padding: "44px 48px",
            position: "relative",
          }}
        >
          {/* Active Line Scanner Bar */}
          {frame >= typingStartFrame && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 44 + indicatorY,
                width: "100%",
                height: lineHeight,
                backgroundColor: "rgba(56, 189, 248, 0.08)",
                borderLeft: "5px solid #38bdf8",
                pointerEvents: "none",
                transition: "top 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          )}

          {/* Code Lines with Character-by-Character Typewriter Effect */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {lines.map((line, idx) => {
              const sched = lineSchedules[idx];
              const isLineStarted = frame >= sched.start;

              // If line hasn't started yet, render empty placeholder line
              if (!isLineStarted) {
                return (
                  <div
                    key={idx}
                    style={{
                      height: lineHeight,
                      display: "flex",
                      alignItems: "center",
                      gap: 32,
                      opacity: 0.25,
                    }}
                  >
                    <span
                      style={{
                        width: 40,
                        textAlign: "right",
                        color: "#30363d",
                        fontSize: 26,
                        userSelect: "none",
                      }}
                    >
                      {idx + 1}
                    </span>
                  </div>
                );
              }

              // How many characters of this line have been typed so far
              const charsTyped = Math.min(
                sched.totalChars,
                Math.floor((frame - sched.start) / framesPerChar)
              );

              const isCurrentlyTypingThisLine =
                frame >= sched.start && frame <= sched.end;

              // Slice syntax-highlighted tokens up to charsTyped
              let runningCount = 0;
              const renderedTokens: { text: string; color: string }[] = [];

              for (const token of line.tokens) {
                if (runningCount >= charsTyped) break;

                const tokenRemaining = charsTyped - runningCount;
                if (tokenRemaining >= token.text.length) {
                  renderedTokens.push(token);
                  runningCount += token.text.length;
                } else {
                  renderedTokens.push({
                    text: token.text.slice(0, tokenRemaining),
                    color: token.color,
                  });
                  runningCount += tokenRemaining;
                  break;
                }
              }

              // Cursor blink rate (~8 frames on, 8 frames off)
              const showCursor =
                isCurrentlyTypingThisLine && Math.floor(frame / 8) % 2 === 0;

              return (
                <div
                  key={idx}
                  style={{
                    height: lineHeight,
                    display: "flex",
                    alignItems: "center",
                    gap: 32,
                  }}
                >
                  {/* Line Number */}
                  <span
                    style={{
                      width: 40,
                      textAlign: "right",
                      color: isCurrentlyTypingThisLine ? "#38bdf8" : "#8b949e",
                      fontSize: 26,
                      fontWeight: isCurrentlyTypingThisLine ? 800 : 500,
                      userSelect: "none",
                    }}
                  >
                    {idx + 1}
                  </span>

                  {/* Rendered Syntax Tokens */}
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      whiteSpace: "pre",
                      display: "inline-flex",
                      alignItems: "center",
                    }}
                  >
                    {renderedTokens.map((t, tIdx) => (
                      <span key={tIdx} style={{ color: t.color }}>
                        {t.text}
                      </span>
                    ))}

                    {/* Blinking typing block cursor */}
                    {showCursor && (
                      <span
                        style={{
                          display: "inline-block",
                          width: 14,
                          height: 32,
                          backgroundColor: "#38bdf8",
                          marginLeft: 3,
                          borderRadius: 2,
                          boxShadow: "0 0 10px #38bdf8",
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
