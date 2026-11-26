import React, { useLayoutEffect, useRef } from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { SmokeTrailProps } from "./types";

function hashFloat(seed: number): number {
  const s = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

/** Infinity (lemniscate) emitter path at continuous frame time tFrame */
function getEmitterPos(tFrame: number, width: number, height: number): [number, number] {
  const t = (tFrame / 120) * Math.PI * 2;
  const rx = width * 0.31;
  const ry = height * 0.25;
  const denom = 1 + Math.sin(t) * Math.sin(t);
  const x = width / 2 + (rx * Math.cos(t)) / denom;
  const y = height / 2 + 24 + (ry * Math.sin(t) * Math.cos(t)) / denom;
  return [x, y];
}

export const SmokeTrail: React.FC<SmokeTrailProps> = ({
  title = "FLUID INK & SMOKE TRAIL",
  subtitle = "Lemniscate Emitter • Deterministic Curl Deflection & Life Culling",
  maxLife = 42,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Draw subtle ghost guide of the infinity curve
    ctx.save();
    ctx.beginPath();
    for (let step = 0; step <= 180; step++) {
      const [gx, gy] = getEmitterPos((step / 180) * 120, width, height);
      if (step === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Cull particles older than maxLife by only evaluating spawn windows [frame - maxLife, frame]
    const oldestSpawnFrame = Math.max(0, Math.floor(frame - maxLife));
    const subStepsPerFrame = 3;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    let activeCount = 0;

    for (let spawnFrame = oldestSpawnFrame; spawnFrame <= frame; spawnFrame++) {
      for (let sub = 0; sub < subStepsPerFrame; sub++) {
        const exactSpawn = spawnFrame + sub / subStepsPerFrame;
        const age = frame - exactSpawn;

        if (age < 0 || age >= maxLife) {
          continue;
        }

        const particleId = spawnFrame * 13 + sub * 7;
        const pMaxLife = maxLife * (0.65 + hashFloat(particleId + 1) * 0.35);

        if (age >= pMaxLife) {
          continue;
        }

        activeCount++;

        const life = Math.max(0, 1 - age / pMaxLife);
        const [sx, sy] = getEmitterPos(exactSpawn, width, height);
        const [nx, ny] = getEmitterPos(exactSpawn + 0.25, width, height);
        const tx = nx - sx;
        const ty = ny - sy;
        const tLen = Math.hypot(tx, ty) || 1;
        const dirX = tx / tLen;
        const dirY = ty / tLen;

        // Deterministic pseudo-noise curl deflection & upward thermal buoyancy
        const randAngle = hashFloat(particleId + 2) * Math.PI * 2;
        const driftSpeed = 0.8 + hashFloat(particleId + 3) * 2.2;
        const curlAngle =
          randAngle +
          Math.sin(age * 0.14 + exactSpawn * 0.2) * 1.4 +
          Math.cos(sx * 0.01 + sy * 0.01) * 0.9;

        const px =
          sx -
          dirX * age * 1.2 +
          Math.cos(curlAngle) * age * driftSpeed;
        const py =
          sy -
          dirY * age * 1.2 +
          Math.sin(curlAngle) * age * driftSpeed -
          age * 1.35;

        const initialSize = 14 + hashFloat(particleId + 4) * 18;
        const size = initialSize * (1 + (1 - life) * 2.6);
        const opacity = Math.pow(life, 1.35) * 0.34;

        // Color transitions along trail: cyan/electric blue -> violet -> magenta
        const hue = 195 + (1 - life) * 125 + (hashFloat(particleId + 5) - 0.5) * 20;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, size);
        grad.addColorStop(0, `hsla(${hue}, 95%, 68%, ${opacity})`);
        grad.addColorStop(0.5, `hsla(${hue + 15}, 90%, 52%, ${opacity * 0.55})`);
        grad.addColorStop(1, `hsla(${hue + 25}, 90%, 40%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Luminous Emitter Core Orb at current frame
    const [headX, headY] = getEmitterPos(frame, width, height);
    const coreGlow = ctx.createRadialGradient(headX, headY, 0, headX, headY, 64);
    coreGlow.addColorStop(0, "rgba(255, 255, 255, 1)");
    coreGlow.addColorStop(0.22, "rgba(103, 232, 249, 0.95)");
    coreGlow.addColorStop(0.55, "rgba(168, 85, 247, 0.45)");
    coreGlow.addColorStop(1, "rgba(168, 85, 247, 0)");

    ctx.fillStyle = coreGlow;
    ctx.beginPath();
    ctx.arc(headX, headY, 64, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(headX, headY, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Subtle telemetry readout directly synced in DOM below; avoid unused var lint
    void activeCount;
  }, [frame, width, height, maxLife]);

  const hudSpring = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0b1124 0%, #030612 62%, #010206 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      {/* Header Overlay */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 72,
          opacity: hudSpring,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(168, 85, 247, 0.16)",
            border: "1px solid rgba(192, 132, 252, 0.4)",
            color: "#d8b4fe",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          CATEGORY H // PRACTICE 44
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 48,
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

      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 72,
          padding: "12px 24px",
          borderRadius: 16,
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          border: "1px solid rgba(192, 132, 252, 0.25)",
          color: "#cbd5e1",
          fontSize: 20,
          fontWeight: 700,
          pointerEvents: "none",
        }}
      >
        Max Lifespan Window: <span style={{ color: "#e879f9" }}>{maxLife} frames</span>
      </div>
    </AbsoluteFill>
  );
};
