import React, { useEffect, useRef } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE, VIDEO_HEIGHT, VIDEO_WIDTH } from "../constants";
import { ConstellationBackground } from "../components/ConstellationBackground";

interface ConfettiPiece {
  vx: number;
  vy: number;
  size: number;
  color: string;
  rot0: number;
  rotSpeed: number;
  drag: number;
}

const seeded = (i: number, salt: number): number => {
  const x = Math.sin(i * 91.7 + salt * 213.3) * 43758.5453;
  return x - Math.floor(x);
};

const CONFETTI_COLORS = [
  PALETTE.cyan,
  PALETTE.indigo,
  PALETTE.emerald,
  "#FACC15",
  "#F472B6",
  "#FFFFFF",
];

const CONFETTI: ConfettiPiece[] = Array.from({ length: 160 }, (_, i) => {
  const angle = -Math.PI + seeded(i, 1) * Math.PI * 2;
  const speed = 360 + seeded(i, 2) * 840;
  return {
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed - 360,
    size: 8 + seeded(i, 3) * 10,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? PALETTE.cyan,
    rot0: seeded(i, 4) * Math.PI * 2,
    rotSpeed: (seeded(i, 5) - 0.5) * 14,
    drag: 0.972,
  };
});

const CLICK_FRAME = 46;
const BURST_FRAME = 48;
const ORIGIN_X = 960;
const ORIGIN_Y = 635;

export const Scene04Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.55, stiffness: 120 },
  });

  // Cursor glide from bottom-right to the Deploy button
  const cursorX = interpolate(frame, [8, 42], [1420, ORIGIN_X + 18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cursorY = interpolate(frame, [8, 42], [890, ORIGIN_Y + 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const cursorOpacity = interpolate(frame, [6, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Button anticipation press at CLICK_FRAME
  const pressScale = interpolate(
    frame,
    [CLICK_FRAME - 3, CLICK_FRAME, CLICK_FRAME + 6, CLICK_FRAME + 14],
    [1, 0.92, 1.05, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const isDeployed = frame >= BURST_FRAME;

  // Deterministic physics confetti on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
    if (frame < BURST_FRAME) return;

    const elapsedFrames = frame - BURST_FRAME;
    const t = elapsedFrames / fps;
    const gravity = 1280;

    for (const p of CONFETTI) {
      const dragFactor = (1 - Math.pow(p.drag, elapsedFrames)) / (1 - p.drag) / fps;
      const x = ORIGIN_X + p.vx * dragFactor;
      const y = ORIGIN_Y + p.vy * dragFactor + 0.5 * gravity * t * t;
      const alpha = interpolate(elapsedFrames, [38, 62], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      if (alpha <= 0.01) continue;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(p.rot0 + p.rotSpeed * t);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size * 0.32, p.size, p.size * 0.64);
      ctx.restore();
    }
  }, [frame, fps]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bg,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ConstellationBackground opacity={0.65} />

      {/* Radial spotlight */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 600,
          borderRadius: "50%",
          background: isDeployed
            ? "radial-gradient(circle, rgba(16,185,129,0.24) 0%, rgba(9,9,11,0) 70%)"
            : "radial-gradient(circle, rgba(99,102,241,0.24) 0%, rgba(9,9,11,0) 70%)",
          filter: "blur(32px)",
          pointerEvents: "none",
        }}
      />

      {/* Center CTA Stack */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          opacity: cardSpring,
          transform: `scale(${interpolate(cardSpring, [0, 1], [0.9, 1])})`,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            color: PALETTE.textPrimary,
            letterSpacing: -2.8,
            lineHeight: 1.06,
          }}
        >
          Ship your next release
        </div>
        <div
          style={{
            fontSize: 88,
            fontWeight: 900,
            letterSpacing: -2.8,
            lineHeight: 1.08,
            background: `linear-gradient(90deg, ${PALETTE.indigo}, ${PALETTE.cyan})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 56,
          }}
        >
          in one click.
        </div>

        {/* Interactive Deploy Pill Button */}
        <div
          style={{
            padding: "26px 58px",
            borderRadius: 999,
            background: isDeployed
              ? `linear-gradient(135deg, ${PALETTE.emerald}, #059669)`
              : `linear-gradient(135deg, ${PALETTE.indigo}, ${PALETTE.cyan})`,
            boxShadow: isDeployed
              ? "0 18px 48px rgba(16, 185, 129, 0.45)"
              : "0 18px 48px rgba(99, 102, 241, 0.45)",
            color: "#FFFFFF",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -0.5,
            transform: `scale(${pressScale})`,
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span>{isDeployed ? "✓ Deployed to Edge" : "Deploy Now →"}</span>
        </div>

        <div
          style={{
            marginTop: 28,
            fontSize: 22,
            color: PALETTE.textSecondary,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
        >
          pulseflow.dev
        </div>
      </div>

      {/* Deterministic Physics Confetti Canvas */}
      <canvas
        ref={canvasRef}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
        }}
      />

      {/* Animated Mouse Cursor */}
      <svg
        width="44"
        height="44"
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          zIndex: 5,
          opacity: cursorOpacity,
          transform: `scale(${pressScale})`,
          filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))",
          pointerEvents: "none",
        }}
      >
        <path
          d="M4 2 L19 13 L12 14.5 L15.5 21 L12.8 22.3 L9.3 15.8 L4.5 19.5 Z"
          fill="#FFFFFF"
          stroke="#09090B"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    </AbsoluteFill>
  );
};
