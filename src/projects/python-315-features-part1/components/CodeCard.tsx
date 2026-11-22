import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME } from "../constants";
import type { PythonSnippet } from "../types";

interface CodeCardProps {
  snippet: PythonSnippet;
  delay?: number;
  glowColor?: string;
}

export const CodeCard: React.FC<CodeCardProps> = ({
  snippet,
  delay = 10,
  glowColor = THEME.pythonBlue,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Anticipation & Snap Motion
  const animFrame = frame - delay;
  const isStarted = animFrame >= 0;

  const cardEntrance = spring({
    frame: animFrame,
    fps,
    config: {
      damping: 14,
      mass: 0.6,
      stiffness: 110,
    },
  });

  const translateY = interpolate(
    animFrame,
    [0, 6, 22],
    [50, -10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const lines = snippet.code.split("\n");

  const renderSyntaxLine = (line: string) => {
    if (line.trim().startsWith("#")) {
      return (
        <span
          style={{
            color: "#94a3b8",
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          {line}
        </span>
      );
    }

    const words = line.split(" ");
    return words.map((token, idx) => {
      let color = "#ffffff";
      let fontWeight = 600;

      const cleanWord = token.replace(/[^a-zA-Z]/g, "");
      if (
        [
          "import",
          "from",
          "def",
          "return",
          "for",
          "in",
          "frozendict",
        ].includes(cleanWord)
      ) {
        color = "#c084fc"; // Vibrant purple keyword
        fontWeight = 800;
      } else if (token.includes("(") || token.includes(")")) {
        color = "#fde047"; // Vibrant yellow function
        fontWeight = 700;
      } else if (token.startsWith('"') || token.endsWith('"') || token.startsWith("'")) {
        color = "#4ade80"; // Crisp green string
      } else if (token.includes("*")) {
        color = "#facc15"; // Yellow star unpacking
        fontWeight = 900;
      } else if (token.includes("TypeError") || token.includes("💥")) {
        color = "#f87171"; // Red error token
        fontWeight = 800;
      }

      return (
        <span key={idx} style={{ color, fontWeight }}>
          {token}{idx < words.length - 1 ? " " : ""}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        width: 1000,
        borderRadius: 28,
        backgroundColor: "rgba(13, 17, 23, 0.95)",
        border: `2px solid ${THEME.cardBorder}`,
        boxShadow: `0 30px 80px rgba(0, 0, 0, 0.7), 0 0 50px ${glowColor}30`,
        overflow: "hidden",
        backdropFilter: "blur(20px)",
        opacity: isStarted ? cardEntrance : 0,
        transform: `translateY(${translateY}px) scale(${0.94 + cardEntrance * 0.06})`,
      }}
    >
      {/* Window Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 30px",
          borderBottom: `2px solid rgba(255, 255, 255, 0.1)`,
          backgroundColor: "rgba(22, 27, 34, 0.98)",
        }}
      >
        {/* macOS Dots */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#ef4444" }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#eab308" }} />
          <div style={{ width: 18, height: 18, borderRadius: "50%", backgroundColor: "#22c55e" }} />
        </div>

        {/* Filename */}
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: 22,
            color: "#e2e8f0",
            fontWeight: 700,
            letterSpacing: "0.03em",
          }}
        >
          {snippet.filename || "main.py"}
        </span>

        {/* Badge Pill */}
        {snippet.badgeText ? (
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 18,
              fontWeight: 800,
              padding: "6px 16px",
              borderRadius: 8,
              backgroundColor: "rgba(56, 189, 248, 0.2)",
              color: "#38bdf8",
              border: `1.5px solid rgba(56, 189, 248, 0.5)`,
              letterSpacing: "0.04em",
            }}
          >
            {snippet.badgeText}
          </span>
        ) : (
          <div style={{ width: 60 }} />
        )}
      </div>

      {/* Code Area: Bumped to 35px font with 1.7 line height for high-res vertical clarity */}
      <div
        style={{
          padding: "36px 32px",
          fontFamily: "JetBrains Mono, 'Fira Code', monospace",
          fontSize: 34,
          lineHeight: 1.7,
          backgroundColor: "#0b0f17",
        }}
      >
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const isHighlighted = snippet.highlightLines?.includes(lineNumber);

          // Line stagger reveal
          const lineEntrance = spring({
            frame: animFrame - 8 - index * 3,
            fps,
            config: { damping: 14, mass: 0.4 },
          });

          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                padding: "6px 16px",
                borderRadius: 10,
                backgroundColor: isHighlighted ? "rgba(56, 189, 248, 0.16)" : "transparent",
                borderLeft: isHighlighted ? `6px solid #38bdf8` : "6px solid transparent",
                boxShadow: isHighlighted ? "0 0 25px rgba(56, 189, 248, 0.2)" : "none",
                opacity: lineEntrance,
                transform: `translateX(${(1 - lineEntrance) * 20}px)`,
              }}
            >
              <span
                style={{
                  width: 50,
                  fontSize: 22,
                  color: isHighlighted ? "#38bdf8" : "#475569",
                  userSelect: "none",
                  textAlign: "right",
                  marginRight: 24,
                  fontWeight: 700,
                  opacity: 0.8,
                }}
              >
                {lineNumber}
              </span>
              <div style={{ flex: 1, whiteSpace: "pre" }}>{renderSyntaxLine(line)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
