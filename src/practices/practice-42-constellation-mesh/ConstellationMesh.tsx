import React, { useLayoutEffect, useMemo, useRef } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { ConstellationMeshProps } from "./types";

interface MeshNodeSeed {
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  hueOffset: number;
}

function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic triangle-wave boundary reflection so nodes bounce cleanly without teleporting. */
function reflectCoord(pos: number, min: number, max: number): number {
  const span = max - min;
  if (span <= 0) return min;
  const shifted = pos - min;
  const period = 2 * span;
  const mod = ((shifted % period) + period) % period;
  return min + (mod <= span ? mod : period - mod);
}

export const ConstellationMesh: React.FC<ConstellationMeshProps> = ({
  title = "PROXIMITY CONSTELLATION MESH",
  nodeCount = 80,
  maxDistance = 160,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const nodeSeeds = useMemo<MeshNodeSeed[]>(() => {
    const rng = mulberry32(420099);
    const margin = 70;
    const nodes: MeshNodeSeed[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const angle = rng() * Math.PI * 2;
      const speed = 45 + rng() * 90; // px/sec
      nodes.push({
        startX: margin + rng() * (width - margin * 2),
        startY: margin + rng() * (height - margin * 2),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 3.2 + rng() * 3.4,
        phase: rng() * Math.PI * 2,
        hueOffset: (rng() - 0.5) * 26,
      });
    }
    return nodes;
  }, [nodeCount, width, height]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const t = frame / fps;
    const margin = 56;
    const entranceAlpha = interpolate(frame, [0, 18], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Compute deterministic positions for all nodes at frame t
    const positions = nodeSeeds.map((n) => {
      const x =
        reflectCoord(n.startX + n.vx * t, margin, width - margin) +
        Math.sin(t * 1.4 + n.phase) * 10;
      const y =
        reflectCoord(n.startY + n.vy * t, margin, height - margin) +
        Math.cos(t * 1.2 + n.phase) * 10;
      return { x, y, radius: n.radius, hue: 196 + n.hueOffset };
    });

    const degreeCounts = new Array<number>(positions.length).fill(0);

    // Draw proximity edges
    ctx.lineWidth = 1.6;
    for (let i = 0; i < positions.length; i++) {
      const a = positions[i];
      if (!a) continue;
      for (let j = i + 1; j < positions.length; j++) {
        const b = positions[j];
        if (!b) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          const proximity = 1 - dist / maxDistance;
          const alpha = proximity * 0.8 * entranceAlpha;
          degreeCounts[i] = (degreeCounts[i] ?? 0) + 1;
          degreeCounts[j] = (degreeCounts[j] ?? 0) + 1;

          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.8 + proximity * 1.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Draw glowing nodes on top of edges
    for (let i = 0; i < positions.length; i++) {
      const p = positions[i];
      if (!p) continue;
      const degree = degreeCounts[i] ?? 0;
      const glowRadius = p.radius * (2.6 + Math.min(4, degree) * 0.45);

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius * 2.2);
      grad.addColorStop(0, `hsla(${p.hue}, 96%, 72%, ${0.95 * entranceAlpha})`);
      grad.addColorStop(0.35, `hsla(${p.hue}, 95%, 60%, ${0.42 * entranceAlpha})`);
      grad.addColorStop(1, "rgba(56, 189, 248, 0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, glowRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(224, 242, 254, ${entranceAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [frame, fps, width, height, nodeSeeds, maxDistance]);

  const hudSpring = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0a1428 0%, #030712 65%, #010308 100%)",
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

      {/* Editorial HUD Overlay */}
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
            backgroundColor: "rgba(56, 189, 248, 0.14)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#7dd3fc",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          CATEGORY H // PRACTICE 42
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 48,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            textShadow: "0 4px 20px rgba(0,0,0,0.85)",
          }}
        >
          {title}
        </h1>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 72,
          padding: "12px 24px",
          borderRadius: 16,
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          border: "1px solid rgba(56, 189, 248, 0.25)",
          color: "#94a3b8",
          fontSize: 20,
          fontWeight: 700,
          backdropFilter: "blur(12px)",
          pointerEvents: "none",
        }}
      >
        {nodeCount} Nodes • Edge Threshold:{" "}
        <span style={{ color: "#38bdf8" }}>{maxDistance}px</span>
      </div>
    </AbsoluteFill>
  );
};
