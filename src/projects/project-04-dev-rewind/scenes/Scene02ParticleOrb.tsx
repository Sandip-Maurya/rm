import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { SCENE_STARTS, VIDEO_HEIGHT, VIDEO_WIDTH, WRAPPED } from "../constants";

const NUM_PARTICLES = 120;

export const Scene02ParticleOrb: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioData = useAudioData(staticFile("audio/dev-rewind/voiceover.wav"));

  // Compute live audio energy from Dylan's voiceover
  let bassEnergy = 0.25 + Math.abs(Math.sin(frame * 0.18)) * 0.35;
  if (audioData) {
    const spectrum = visualizeAudio({
      fps,
      frame: SCENE_STARTS.orb + frame,
      audioData,
      numberOfSamples: 32,
    });
    const low = ((spectrum[1] ?? 0) + (spectrum[2] ?? 0) + (spectrum[3] ?? 0)) / 3;
    bassEnergy = Math.min(1, low * 2.8);
  }

  const daysCount = Math.round(
    interpolate(frame, [10, 62], [0, 312], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    })
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

    const cx = VIDEO_WIDTH / 2;
    const cy = VIDEO_HEIGHT / 2 - 40;
    const baseRadius = 290 + bassEnergy * 115;

    // Outer glow ring
    const grad = ctx.createRadialGradient(cx, cy, 80, cx, cy, baseRadius + 90);
    grad.addColorStop(0, "rgba(168, 85, 247, 0.28)");
    grad.addColorStop(0.6, "rgba(236, 72, 153, 0.14)");
    grad.addColorStop(1, "rgba(15, 7, 32, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, baseRadius + 90, 0, Math.PI * 2);
    ctx.fill();

    // Orbiting audio-reactive particles
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const angle = (i / NUM_PARTICLES) * Math.PI * 2 + frame * 0.015;
      const ringOffset = Math.sin(i * 3.7 + frame * 0.08) * (24 + bassEnergy * 55);
      const r = baseRadius + ringOffset;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      const size = 3 + (i % 4) + bassEnergy * 4;

      ctx.fillStyle =
        i % 3 === 0
          ? WRAPPED.gold
          : i % 2 === 0
            ? WRAPPED.magenta
            : WRAPPED.cyan;
      ctx.globalAlpha = 0.65 + bassEnergy * 0.35;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }, [frame, bassEnergy]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: WRAPPED.bg,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      <canvas
        ref={canvasRef}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginTop: -60,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: WRAPPED.cyan,
            letterSpacing: 3,
            marginBottom: 16,
          }}
        >
          CONSISTENCY STREAK
        </div>

        <div
          style={{
            fontSize: 196,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -6,
            fontVariantNumeric: "tabular-nums",
            background: `linear-gradient(135deg, #FFFFFF 15%, ${WRAPPED.gold} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {daysCount}
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: WRAPPED.text,
            marginTop: 14,
          }}
        >
          DAYS SHIPPED CODE
        </div>
      </div>
    </AbsoluteFill>
  );
};
