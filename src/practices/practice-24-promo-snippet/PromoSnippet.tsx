import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { PromoSnippetProps } from "./types";

export const PromoSnippet: React.FC<PromoSnippetProps> = ({
  problemStatement = "Legacy data stacks are slowing down engineering velocity.",
  solutionMetric = "+340% Real-Time ARR",
  metricLabel = "Automated Data Ingestion & Live AI Pipelines",
  brandName = "REMOTION LABS",
  tagline = "Ship Production-Grade Video Apps at Web Speed",
  enableAudio = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // MUSIC DUCKING LOGIC:
  // Frames 0-60 (Sec 0-2): Voiceover / Problem statement -> volume dipped to 0.25
  // Frames 60-150 (Sec 2-5): Data graph & Ticker -> volume 0.35
  // Frames 150-180 (Sec 5-6): Outro logo card -> volume swells up to 0.75
  const musicVolume = interpolate(
    frame,
    [0, 50, 60, 140, 155, 180],
    [0.25, 0.25, 0.35, 0.35, 0.75, 0.7],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // SCENE 1: Kinetic Word-by-Word Problem Statement (Frames 0 - 60)
  const words = problemStatement.split(" ");
  const scene1Exit = interpolate(frame, [50, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // SCENE 2: Line Graph & Rolling ARR Metric (Frames 60 - 150)
  const scene2Frame = frame - 60;
  const scene2Entrance = spring({
    frame: scene2Frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // SVG Line Graph Draw-in (frames 65 - 110)
  const pathLength = 1200;
  const lineProgress = interpolate(scene2Frame, [5, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const strokeDashoffset = pathLength * (1 - lineProgress);

  // Metric Ticker (frames 70 - 120)
  const counterVal = Math.round(
    interpolate(scene2Frame, [10, 55], [0, 340], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

  const scene2Exit = interpolate(frame, [140, 150], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SCENE 3: Outro Logo Swell & Call to Action (Frames 150 - 180)
  const scene3Frame = frame - 150;
  const logoScale = spring({
    frame: scene3Frame,
    fps,
    config: { damping: 10, mass: 0.7, stiffness: 140 },
  });
  const logoGlow = interpolate(scene3Frame, [0, 15, 30], [0, 1, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030712",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Background ambient music with automated dynamic ducking */}
      {enableAudio && (
        <>
          <Audio
            src={staticFile("audio/samples/sample-energy-blend.wav")}
            volume={musicVolume}
          />
          {/* Pop SFX trigger synchronized to scene 2 metric breakout */}
          <Sequence from={75}>
            <Audio
              src={staticFile("audio/samples/sample-locked-verify.wav")}
              volume={0.8}
            />
          </Sequence>
          {/* Swell impact SFX on scene 3 logo drop */}
          <Sequence from={150}>
            <Audio
              src={staticFile("audio/samples/sample-am-channel-short.wav")}
              volume={0.9}
            />
          </Sequence>
        </>
      )}

      {/* =========================================================================
          SCENE 1: KINETIC TYPOGRAPHY (FRAMES 0 - 60)
         ========================================================================= */}
      {frame < 60 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 140px",
            opacity: scene1Exit,
            transform: `scale(${interpolate(scene1Exit, [0, 1], [0.94, 1])})`,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 24px",
              borderRadius: 9999,
              backgroundColor: "rgba(239, 68, 68, 0.16)",
              border: "1px solid rgba(248, 113, 113, 0.35)",
              color: "#fca5a5",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 36,
            }}
          >
            THE BOTTLENECK
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "18px 24px",
              maxWidth: 1400,
            }}
          >
            {words.map((word, i) => {
              const wordSpring = spring({
                frame: frame - i * 4,
                fps,
                config: { damping: 12, mass: 0.5 },
              });
              const isHighlight =
                word.toLowerCase().includes("slowing") ||
                word.toLowerCase().includes("velocity");

              return (
                <span
                  key={i}
                  style={{
                    fontSize: 78,
                    fontWeight: 900,
                    color: isHighlight ? "#f87171" : "#ffffff",
                    letterSpacing: "-0.03em",
                    display: "inline-block",
                    transform: `translateY(${interpolate(
                      wordSpring,
                      [0, 1],
                      [40, 0]
                    )}px) scale(${wordSpring})`,
                    opacity: wordSpring,
                    textShadow: isHighlight
                      ? "0 0 35px rgba(239, 68, 68, 0.5)"
                      : "0 4px 20px rgba(0,0,0,0.5)",
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        </AbsoluteFill>
      )}

      {/* =========================================================================
          SCENE 2: ANIMATED LINE CHART & ARR TICKER (FRAMES 60 - 150)
         ========================================================================= */}
      {frame >= 60 && frame < 150 && (
        <AbsoluteFill
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: scene2Exit,
            padding: "60px 100px",
          }}
        >
          <div
            style={{
              width: 1300,
              display: "flex",
              flexDirection: "column",
              gap: 36,
              transform: `scale(${scene2Entrance})`,
            }}
          >
            {/* Header with live counter */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "6px 18px",
                    borderRadius: 9999,
                    backgroundColor: "rgba(16, 185, 129, 0.16)",
                    border: "1px solid rgba(52, 211, 153, 0.4)",
                    color: "#6ee7b7",
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  ENGINEERED SPEEDUP
                </div>
                <div
                  style={{
                    fontSize: 32,
                    color: "#94a3b8",
                    fontWeight: 600,
                  }}
                >
                  {metricLabel}
                </div>
              </div>

              <div
                style={{
                  fontSize: 88,
                  fontWeight: 900,
                  color: "#34d399",
                  letterSpacing: "-0.03em",
                  textShadow: "0 0 40px rgba(52, 211, 153, 0.5)",
                }}
              >
                +{counterVal}% ARR
              </div>
            </div>

            {/* SVG Line Chart Box */}
            <div
              style={{
                width: "100%",
                height: 380,
                backgroundColor: "rgba(15, 23, 42, 0.8)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: 28,
                padding: "30px 40px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 30px 60px rgba(0,0,0,0.7)",
              }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 1200 320"
                style={{ overflow: "visible" }}
              >
                {/* Grid guidelines */}
                <line
                  x1="0"
                  y1="80"
                  x2="1200"
                  y2="80"
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="6 6"
                />
                <line
                  x1="0"
                  y1="180"
                  x2="1200"
                  y2="180"
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="6 6"
                />
                <line
                  x1="0"
                  y1="280"
                  x2="1200"
                  y2="280"
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="6 6"
                />

                {/* Animated Gradient Line Path */}
                <defs>
                  <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="60%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>

                <path
                  d="M 50 280 C 250 270, 400 240, 600 180 C 800 120, 950 60, 1150 40"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={pathLength}
                  strokeDashoffset={strokeDashoffset}
                />

                {/* Pulsing Target Point at head of line */}
                {lineProgress > 0.9 && (
                  <circle
                    cx="1150"
                    cy="40"
                    r="14"
                    fill="#34d399"
                    stroke="#ffffff"
                    strokeWidth="4"
                    filter="drop-shadow(0 0 16px #34d399)"
                  />
                )}
              </svg>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* =========================================================================
          SCENE 3: OUTRO BRAND CARD & CALL TO ACTION (FRAMES 150 - 180)
         ========================================================================= */}
      {frame >= 150 && (
        <AbsoluteFill
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 80,
            background:
              "radial-gradient(circle at 50% 50%, #1e1b4b 0%, #030712 80%)",
          }}
        >
          {/* Glowing Aura */}
          <div
            style={{
              position: "absolute",
              width: 900,
              height: 900,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0,0,0,0) 75%)",
              opacity: logoGlow,
              transform: `scale(${logoScale})`,
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              transform: `scale(${logoScale})`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 28,
            }}
          >
            {/* Brand Logo Symbol */}
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 34,
                background:
                  "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 50px rgba(99, 102, 241, 0.6)",
              }}
            >
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: 92,
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.04em",
                textShadow: "0 10px 40px rgba(0,0,0,0.8)",
              }}
            >
              {brandName}
            </h1>

            <p
              style={{
                fontSize: 32,
                color: "#c7d2fe",
                maxWidth: 900,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              {tagline}
            </p>

            <div
              style={{
                marginTop: 12,
                padding: "16px 36px",
                borderRadius: 9999,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.25)",
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              remotion.dev/enterprise →
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
