import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { TerminalTypewriterProps } from "./types";

export const TerminalTypewriter: React.FC<TerminalTypewriterProps> = ({
  command = "bun add remotion @remotion/core",
  userPrompt = "developer@macbook ~ %",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Window pop-in entrance spring (frames 0 -> 25)
  const windowEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });
  const windowScale = interpolate(windowEntrance, [0, 1], [0.85, 1]);
  const windowTranslateY = interpolate(windowEntrance, [0, 1], [40, 0]);
  const windowOpacity = interpolate(windowEntrance, [0, 1], [0, 1]);

  // Practice 07 Math:
  // Delay typing by 20 frames until window finishes settling
  const startTypingFrame = 20;
  const typingFrame = Math.max(0, frame - startTypingFrame);

  // Velocity: ~16 characters per second
  const charsPerSecond = 16;
  const charsCount = Math.min(
    command.length,
    Math.floor(typingFrame * (charsPerSecond / fps))
  );

  const typedCommand = command.slice(0, charsCount);

  // Blinking cursor: toggles every 10 frames (~3 blinks per second)
  const isCursorVisible = Math.floor(frame / 10) % 2 === 0;

  // Status message showing "installed successfully" after typing finishes + small pause
  const typingFinishedFrame = startTypingFrame + Math.ceil((command.length / charsPerSecond) * fps);
  const successOpacity = interpolate(
    frame,
    [typingFinishedFrame + 15, typingFinishedFrame + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        padding: "80px",
      }}
    >
      {/* macOS Terminal Window Frame */}
      <div
        style={{
          transform: `translateY(${windowTranslateY}px) scale(${windowScale})`,
          opacity: windowOpacity,
          width: "100%",
          maxWidth: 1300,
          backgroundColor: "#18181b",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 35px 80px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.2)",
          overflow: "hidden",
        }}
      >
        {/* Terminal Titlebar with macOS Traffic Light Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "20px 28px",
            backgroundColor: "#27272a",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Traffic light dots */}
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "#ef4444",
              }}
            />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
              }}
            />
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                backgroundColor: "#10b981",
              }}
            />
          </div>

          {/* Title centered */}
          <div
            style={{
              flex: 1,
              textAlign: "center",
              color: "#a1a1aa",
              fontSize: 22,
              fontWeight: 500,
              fontFamily:
                '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              marginRight: 60, // counterbalance dots width
            }}
          >
            zsh — 1920×1080
          </div>
        </div>

        {/* Terminal Body */}
        <div
          style={{
            padding: "48px 56px",
            fontFamily:
              '"JetBrains Mono", "Fira Code", "SF Mono", Menlo, Monaco, Consolas, monospace',
            minHeight: 320,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* Active Command Line */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
              fontSize: 44,
              lineHeight: 1.3,
            }}
          >
            <span style={{ color: "#38bdf8", fontWeight: 700 }}>
              {userPrompt}
            </span>
            <span style={{ color: "#f4f4f5", fontWeight: 500 }}>
              {typedCommand}
            </span>
            {/* Blinking green block cursor */}
            <span
              style={{
                display: "inline-block",
                width: 24,
                height: 48,
                backgroundColor: isCursorVisible ? "#22c55e" : "transparent",
                boxShadow: isCursorVisible
                  ? "0 0 14px rgba(34, 197, 94, 0.7)"
                  : "none",
                borderRadius: 4,
              }}
            />
          </div>

          {/* Simulated Success Output */}
          <div
            style={{
              opacity: successOpacity,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              fontSize: 32,
              color: "#a1a1aa",
              marginTop: 16,
            }}
          >
            <div style={{ color: "#4ade80" }}>
              ✓ + remotion@4.0.545 installed in 0.42s
            </div>
            <div style={{ color: "#71717a" }}>
              Ready for high-fps motion rendering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
