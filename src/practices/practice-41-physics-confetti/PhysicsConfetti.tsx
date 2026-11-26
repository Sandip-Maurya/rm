import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { PhysicsConfettiProps } from "./types";

interface ConfettiParticle {
  startX: number;
  startY: number;
  initialVx: number;
  initialVy: number;
  dragRate: number;
  initialAngle: number;
  angularVelocity: number;
  flipSpeed: number;
  flutterFreq: number;
  flutterAmp: number;
  phase: number;
  width: number;
  height: number;
  color: string;
  shape: "rect" | "ribbon" | "circle";
}

const CONFETTI_COLORS = [
  "#38bdf8",
  "#f472b6",
  "#a855f7",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#818cf8",
  "#22d3ee",
] as const;

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PhysicsConfetti: React.FC<PhysicsConfettiProps> = ({
  title = "DETERMINISTIC CONFETTI ENGINE",
  subtitle = "360 Particles • Analytical Drag, Gravity & 2D Tumble Physics",
  particleCount = 360,
  burstFrame = 15,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particles = useMemo<ConfettiParticle[]>(() => {
    const rng = mulberry32(20261126);
    const list: ConfettiParticle[] = [];
    const shapes: ConfettiParticle["shape"][] = ["rect", "ribbon", "circle"];

    for (let i = 0; i < particleCount; i++) {
      // Fan upward in a celebratory cone (-150deg to -30deg) with some radial scatter
      const angle = -Math.PI / 2 + (rng() - 0.5) * (Math.PI * 0.92);
      const speed = 620 + rng() * 1450;
      const massFactor = 0.75 + rng() * 0.65;

      list.push({
        startX: width / 2 + (rng() - 0.5) * 28,
        startY: height / 2 + (rng() - 0.5) * 28,
        initialVx: Math.cos(angle) * speed,
        initialVy: Math.sin(angle) * speed - 180 * rng(),
        dragRate: (1.5 + rng() * 1.4) / massFactor,
        initialAngle: rng() * Math.PI * 2,
        angularVelocity: (rng() - 0.5) * 14,
        flipSpeed: 4 + rng() * 10,
        flutterFreq: 3 + rng() * 5,
        flutterAmp: 12 + rng() * 28,
        phase: rng() * Math.PI * 2,
        width: 10 + rng() * 12,
        height: 6 + rng() * 9,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? "#38bdf8",
        shape: shapes[i % shapes.length] ?? "rect",
      });
    }
    return list;
  }, [particleCount, width, height]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const t = Math.max(0, (frame - burstFrame) / fps);
    if (t <= 0) {
      return;
    }

    const GRAVITY = 1280; // px / s^2 downward

    // Shockwave burst ring at burstFrame
    if (t < 0.7) {
      const ringProgress = t / 0.7;
      const ringRadius = interpolate(ringProgress, [0, 1], [18, 420]);
      const ringAlpha = interpolate(ringProgress, [0, 0.2, 1], [0.9, 0.5, 0]);
      ctx.save();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
      ctx.lineWidth = Math.max(1, 8 * (1 - ringProgress));
      ctx.stroke();
      ctx.restore();
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p) continue;

      const lambda = p.dragRate;
      const expFactor = Math.exp(-lambda * t);
      const decayIntegral = (1 - expFactor) / lambda;

      // Exact analytical integration of air drag + gravity:
      // dvx/dt = -lambda * vx
      // dvy/dt = g - lambda * vy
      const flutterX = Math.sin(t * p.flutterFreq + p.phase) * p.flutterAmp * (1 - expFactor);
      const x = p.startX + p.initialVx * decayIntegral + flutterX;
      const y =
        p.startY +
        (GRAVITY / lambda) * t +
        (p.initialVy - GRAVITY / lambda) * decayIntegral;

      if (y > height + 80 || x < -80 || x > width + 80) {
        continue;
      }

      const rotation = p.initialAngle + p.angularVelocity * t;
      const flipScale = Math.cos(t * p.flipSpeed + p.phase);
      const fadeOut = interpolate(frame, [72, 89], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.scale(1, Math.abs(flipScale) < 0.14 ? 0.14 : flipScale);
      ctx.globalAlpha = fadeOut * (flipScale >= 0 ? 0.96 : 0.72);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
      } else if (p.shape === "ribbon") {
        ctx.beginPath();
        ctx.roundRect(-p.width * 0.75, -p.height * 0.35, p.width * 1.5, p.height * 0.7, 3);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.height * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }, [frame, fps, width, height, burstFrame, particles]);

  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  const centerScale =
    frame < burstFrame
      ? interpolate(frame, [0, burstFrame - 2, burstFrame], [0.85, 1.15, 0.4], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : spring({
          frame: frame - burstFrame,
          fps,
          config: { damping: 10, mass: 0.5, stiffness: 150 },
        });

  const centerOpacity =
    frame < burstFrame
      ? badgeSpring
      : interpolate(frame, [burstFrame, burstFrame + 18], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0f172a 0%, #050814 60%, #020308 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Header HUD */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          zIndex: 10,
          opacity: badgeSpring,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(244, 114, 182, 0.14)",
            border: "1px solid rgba(244, 114, 182, 0.4)",
            color: "#f9a8d4",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 14,
          }}
        >
          CATEGORY H // PRACTICE 41
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 50,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 6 }}>
          {subtitle}
        </div>
      </div>

      {/* Center Emitter Anticipation Pill */}
      {centerOpacity > 0.01 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${centerScale})`,
            opacity: centerOpacity,
            padding: "18px 40px",
            borderRadius: 9999,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: "2px solid rgba(56, 189, 248, 0.6)",
            boxShadow: "0 0 50px rgba(56, 189, 248, 0.35)",
            color: "#ffffff",
            fontSize: 32,
            fontWeight: 900,
            letterSpacing: "0.06em",
            zIndex: 5,
          }}
        >
          {frame < burstFrame ? "IGNITION READY..." : "BURST!"}
        </div>
      )}

      {/* Full-Resolution Deterministic HTML5 2D Canvas */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 8,
          pointerEvents: "none",
        }}
      />

      {/* Bottom Telemetry Readout */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 80,
          zIndex: 10,
          padding: "12px 24px",
          borderRadius: 16,
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          color: "#cbd5e1",
          fontSize: 20,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {frame < burstFrame
          ? `T-${burstFrame - frame}f TO LAUNCH`
          : `t = ${((frame - burstFrame) / fps).toFixed(2)}s • ${particleCount} ACTIVE`}
      </div>
    </AbsoluteFill>
  );
};
