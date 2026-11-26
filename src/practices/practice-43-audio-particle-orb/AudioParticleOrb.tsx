import React, { useLayoutEffect, useMemo, useRef } from "react";
import { useWindowedAudioData, visualizeAudio } from "@remotion/media-utils";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AudioParticleOrbProps } from "./types";

interface OrbParticle {
  angle: number;
  ringLayer: number; // 0 to 1 radial layer
  bandIndex: number; // 0 to 31 FFT band
  size: number;
  speedOffset: number;
  phase: number;
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

/** Deterministic fallback sine-wave spectrum when no audio file is supplied or still decoding */
function computeFallbackSpectrum(frame: number, fps: number, numBands: number): number[] {
  const t = frame / fps;
  // Beat pulse at ~120 BPM (2 beats/sec)
  const beatPhase = (t * 2) % 1;
  const beatEnv = Math.pow(Math.max(0, 1 - beatPhase * 1.45), 2.2);

  return Array.from({ length: numBands }, (_, idx) => {
    const norm = idx / (numBands - 1);
    const bassWeight = Math.exp(-norm * 3.8);
    const midWave = 0.5 + 0.5 * Math.sin(t * 5.2 + idx * 0.45);
    const trebleWave = 0.5 + 0.5 * Math.cos(t * 9.5 - idx * 0.7);
    const raw =
      bassWeight * (0.25 + 0.72 * beatEnv) +
      (1 - bassWeight) * (0.14 + 0.36 * midWave * trebleWave);
    return Math.min(1, Math.max(0.04, raw));
  });
}

const AudioFrequencyLoader: React.FC<{
  audioFile: string;
  frame: number;
  fps: number;
  numberOfSamples: number;
  children: (frequencies: number[]) => React.ReactNode;
}> = ({ audioFile, frame, fps, numberOfSamples, children }) => {
  const audioSrc = staticFile(audioFile);
  const { audioData, dataOffsetInSeconds } = useWindowedAudioData({
    src: audioSrc,
    frame,
    fps,
    windowInSeconds: 10,
  });

  const frequencies = audioData
    ? visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples,
        optimizeFor: "speed",
        dataOffsetInSeconds,
      })
    : computeFallbackSpectrum(frame, fps, numberOfSamples);

  return (
    <>
      <Audio src={audioSrc} volume={0.75} />
      {children(frequencies)}
    </>
  );
};

const OrbCanvasRenderer: React.FC<{
  title: string;
  particleCount: number;
  frequencies: number[];
  isFallbackMode: boolean;
}> = ({ title, particleCount, frequencies, isFallbackMode }) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const particles = useMemo<OrbParticle[]>(() => {
    const rng = mulberry32(430430);
    const list: OrbParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      list.push({
        angle: (i / particleCount) * Math.PI * 2 + (rng() - 0.5) * 0.15,
        ringLayer: 0.42 + rng() * 0.65,
        bandIndex: i % 32,
        size: 2.2 + rng() * 4.2,
        speedOffset: (rng() - 0.5) * 0.35,
        phase: rng() * Math.PI * 2,
      });
    }
    return list;
  }, [particleCount]);

  // Extract normalized bass & treble energy
  const lowBand = frequencies.slice(0, 6);
  const highBand = frequencies.slice(18, 32);
  const rawBass =
    lowBand.reduce((acc, v) => acc + v, 0) / Math.max(1, lowBand.length);
  const rawTreble =
    highBand.reduce((acc, v) => acc + v, 0) / Math.max(1, highBand.length);

  // Boost perceptual range so real voice/music and synthetic waves both punch strongly
  const bassEnergy = Math.min(1, Math.pow(rawBass, 0.58) * 1.45);
  const trebleEnergy = Math.min(1, Math.pow(rawTreble, 0.55) * 2.1);

  const orbRadius = interpolate(bassEnergy, [0, 1], [150, 310], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Treble shifts hue smoothly across purple (272) -> hot magenta (322) -> electric cyan (192)
  const baseHue = interpolate(trebleEnergy, [0, 0.45, 1], [272, 322, 192], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 20;
    const t = frame / fps;

    // Outer resonant bass shockwave rings
    for (let r = 0; r < 3; r++) {
      const rippleRadius = orbRadius + 24 + r * 38 + bassEnergy * 42;
      const rippleAlpha = Math.max(0.05, 0.34 - r * 0.1) * (0.4 + bassEnergy * 0.8);
      ctx.beginPath();
      ctx.arc(cx, cy, rippleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${baseHue + r * 18}, 95%, 65%, ${rippleAlpha})`;
      ctx.lineWidth = 2.5 - r * 0.5;
      ctx.stroke();
    }

    // Core luminous aura
    const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, orbRadius * 1.35);
    coreGrad.addColorStop(0, `hsla(${baseHue}, 98%, 74%, ${0.42 + bassEnergy * 0.25})`);
    coreGrad.addColorStop(0.5, `hsla(${baseHue + 28}, 90%, 54%, 0.16)`);
    coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, orbRadius * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // Frequency-modulated radial spectrum ring + particle dispersion
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (!p) continue;

      const bandVal = frequencies[p.bandIndex] ?? 0.1;
      const bandBoost = Math.min(1, Math.pow(bandVal, 0.62) * 1.65);

      const spinAngle = p.angle + t * (0.28 + p.speedOffset);
      const waveRipple = Math.sin(spinAngle * 6 - t * 4.5 + p.phase) * (10 + bassEnergy * 28);
      const radialDist =
        orbRadius * p.ringLayer + bandBoost * 115 + waveRipple;

      const px = cx + Math.cos(spinAngle) * radialDist;
      const py = cy + Math.sin(spinAngle) * radialDist;

      const particleHue = (baseHue + (p.bandIndex / 32) * 65) % 360;
      const alpha = Math.min(0.95, 0.35 + bandBoost * 0.65);
      const radius = p.size * (0.85 + bandBoost * 0.9);

      const pGrad = ctx.createRadialGradient(px, py, 0, px, py, radius * 2.6);
      pGrad.addColorStop(0, `hsla(${particleHue}, 100%, 75%, ${alpha})`);
      pGrad.addColorStop(0.45, `hsla(${particleHue}, 95%, 58%, ${alpha * 0.45})`);
      pGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(px, py, radius * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Inner bright harmonic ring polygon connecting 32 spectrum bands
    ctx.beginPath();
    for (let b = 0; b < 32; b++) {
      const bandVal = Math.min(1, Math.pow(frequencies[b] ?? 0.08, 0.62) * 1.6);
      const theta = (b / 32) * Math.PI * 2 + t * 0.3;
      const r = orbRadius * 0.56 + bandVal * 90;
      const vx = cx + Math.cos(theta) * r;
      const vy = cy + Math.sin(theta) * r;
      if (b === 0) ctx.moveTo(vx, vy);
      else ctx.lineTo(vx, vy);
    }
    ctx.closePath();
    ctx.strokeStyle = `hsla(${baseHue + 15}, 98%, 74%, 0.78)`;
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }, [frame, fps, width, height, particles, frequencies, orbRadius, bassEnergy, baseHue]);

  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 52%, #130b26 0%, #050712 62%, #020308 100%)",
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

      {/* Top Square Composition Header */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: entrance,
          pointerEvents: "none",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(217, 70, 239, 0.16)",
              border: "1px solid rgba(232, 121, 249, 0.4)",
              color: "#f0abfc",
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            CATEGORY H // PRACTICE 43
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 42,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            {title}
          </h1>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 14,
            backgroundColor: "rgba(15, 23, 42, 0.72)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            color: "#cbd5e1",
            fontSize: 16,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isFallbackMode ? "MODE: SYNTHETIC SINE" : "MODE: LIVE FFT"}
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 26px",
          borderRadius: 18,
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(14px)",
          color: "#cbd5e1",
          fontSize: 18,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          opacity: entrance,
        }}
      >
        <span>
          BASS RADIUS:{" "}
          <strong style={{ color: "#38bdf8" }}>{Math.round(orbRadius)}px</strong>
        </span>
        <span>
          TREBLE HUE:{" "}
          <strong style={{ color: `hsl(${baseHue}, 95%, 68%)` }}>
            {Math.round(baseHue)}°
          </strong>
        </span>
        <span>
          PARTICLES: <strong style={{ color: "#f472b6" }}>{particleCount}</strong>
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const AudioParticleOrb: React.FC<AudioParticleOrbProps> = ({
  title = "Audio Reactive Particle Orb",
  audioFile = "audio/samples/sample-energy-blend-120.wav",
  particleCount = 380,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (audioFile && audioFile.trim().length > 0) {
    return (
      <AudioFrequencyLoader
        audioFile={audioFile}
        frame={frame}
        fps={fps}
        numberOfSamples={32}
      >
        {(frequencies) => (
          <OrbCanvasRenderer
            title={title}
            particleCount={particleCount}
            frequencies={frequencies}
            isFallbackMode={false}
          />
        )}
      </AudioFrequencyLoader>
    );
  }

  const fallbackFrequencies = computeFallbackSpectrum(frame, fps, 32);

  return (
    <OrbCanvasRenderer
      title={title}
      particleCount={particleCount}
      frequencies={fallbackFrequencies}
      isFallbackMode
    />
  );
};
