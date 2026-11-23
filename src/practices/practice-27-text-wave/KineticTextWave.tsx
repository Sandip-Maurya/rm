import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { KineticTextWaveProps } from "./types";

export const KineticTextWave: React.FC<KineticTextWaveProps> = ({
  headline = "SUPERCHARGED",
  badgeText = "PHYSICS ENGINE V2",
  subtext = "Continuous Sine Waveform Carrier • Per-Character Damped Springs",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = headline.split("");

  // Subtitle & Badge fade-in
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050711",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Background ambient gradient flare */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.16) 0%, rgba(59, 130, 246, 0.1) 40%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Pill Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "10px 24px",
          borderRadius: 9999,
          backgroundColor: "rgba(139, 92, 246, 0.16)",
          border: "1px solid rgba(167, 139, 250, 0.35)",
          color: "#c4b5fd",
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: 36,
          transform: `scale(${headerEntrance})`,
          opacity: headerEntrance,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: "#8b5cf6",
            boxShadow: "0 0 12px #8b5cf6",
          }}
        />
        {badgeText}
      </div>

      {/* Kinetic Text Wave Character Row */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
          marginBottom: 36,
        }}
      >
        {chars.map((char, index) => {
          // Staggered character entrance delay (3 frames per character)
          const charDelay = index * 3;

          // Initial pop-in spring
          const entrance = spring({
            frame: frame - charDelay,
            fps,
            config: { damping: 11, mass: 0.45, stiffness: 140 },
          });

          // Continuous ambient sine wave (smoothly blended in as character settles)
          // Frequency and phase shift across index create an organic traveling wave
          const waveSpeed = 0.14;
          const waveAmplitude = 18; // 18px vertical oscillation for punchy 1080p visibility
          const wavePhase = index * 0.45;
          const sineY = Math.sin(frame * waveSpeed - wavePhase) * waveAmplitude;

          // Smooth blending factor: 0 before entrance, ramping to 1.0 as spring settles
          const blendFactor = interpolate(entrance, [0.8, 1.0], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const entranceY = interpolate(entrance, [0, 1], [80, 0]);
          const totalY = entranceY + sineY * blendFactor;

          // Dynamic rainbow/spectral hue shift along the wave
          const baseHue = 220 + index * 10;
          const dynamicLightness = 65 + Math.sin(frame * waveSpeed - wavePhase) * 12;

          return (
            <span
              key={index}
              style={{
                fontSize: 120,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                display: "inline-block",
                color: `hsl(${baseHue}, 90%, ${dynamicLightness}%)`,
                textShadow: `0 10px 30px hsla(${baseHue}, 80%, 50%, 0.45)`,
                transform: `translateY(${totalY}px) scale(${entrance})`,
                opacity: entrance,
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      {/* Explainer Subtext */}
      <p
        style={{
          fontSize: 26,
          color: "#94a3b8",
          fontWeight: 600,
          textAlign: "center",
          maxWidth: 900,
          lineHeight: 1.4,
          transform: `scale(${headerEntrance})`,
          opacity: headerEntrance,
        }}
      >
        {subtext}
      </p>
    </AbsoluteFill>
  );
};
