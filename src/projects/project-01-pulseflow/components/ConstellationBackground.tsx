import React, { useEffect, useRef } from "react";
import { useCurrentFrame } from "remotion";
import { VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";

interface Particle {
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  radius: number;
}

const seeded = (i: number, salt: number): number => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453123;
  return x - Math.floor(x);
};

const PARTICLES: Particle[] = Array.from({ length: 64 }, (_, i) => ({
  x0: seeded(i, 1) * VIDEO_WIDTH,
  y0: seeded(i, 2) * VIDEO_HEIGHT,
  vx: (seeded(i, 3) - 0.5) * 1.1,
  vy: (seeded(i, 4) - 0.5) * 0.9,
  radius: 1.5 + seeded(i, 5) * 2.2,
}));

const MAX_DIST = 210;

interface ConstellationBackgroundProps {
  opacity?: number;
}

export const ConstellationBackground: React.FC<ConstellationBackgroundProps> = ({
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);

    const positions = PARTICLES.map((p) => {
      const x = ((p.x0 + p.vx * frame) % VIDEO_WIDTH + VIDEO_WIDTH) % VIDEO_WIDTH;
      const y = ((p.y0 + p.vy * frame) % VIDEO_HEIGHT + VIDEO_HEIGHT) % VIDEO_HEIGHT;
      return { x, y, r: p.radius };
    });

    // Draw proximity edges
    ctx.lineWidth = 1.2;
    for (let i = 0; i < positions.length; i++) {
      const a = positions[i];
      if (!a) continue;
      for (let j = i + 1; j < positions.length; j++) {
        const b = positions[j];
        if (!b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.24 * opacity;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    for (const p of positions) {
      ctx.fillStyle = `rgba(34, 211, 238, ${0.42 * opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [frame, opacity]);

  return (
    <canvas
      ref={canvasRef}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    />
  );
};
