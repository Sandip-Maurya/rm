import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { WaveformEqualizerProps } from "./types";

export const WaveformEqualizer: React.FC<WaveformEqualizerProps> = ({
  trackTitle = "Synthesizer Frequency Analysis",
  artist = "Remotion Neural Audio Engine",
  audioFile = "audio/python315/scene01_hook.wav",
  numberOfBars = 32,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const audioSrc = staticFile(audioFile);
  const audioData = useAudioData(audioSrc);

  // Fallback / Loading guard while audio buffer decodes
  const visualization = audioData
    ? visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: numberOfBars,
      })
    : new Array(numberOfBars).fill(0.05);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#030712",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Audio playback element */}
      <Audio src={audioSrc} volume={0.8} />

      {/* Ambient background reactive glow */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(59, 130, 246, 0.12) 40%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header & Track Metadata */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 70,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            borderRadius: 9999,
            backgroundColor: "rgba(168, 85, 247, 0.16)",
            border: "1px solid rgba(192, 132, 252, 0.4)",
            color: "#d8b4fe",
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#c084fc",
              boxShadow: "0 0 12px #c084fc",
            }}
          />
          Live FFT Spectrum • 32 Band EQ
        </div>

        <h1
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            marginBottom: 12,
            textShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          {trackTitle}
        </h1>

        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            fontWeight: 600,
          }}
        >
          {artist}
        </div>
      </div>

      {/* Equalizer Visualizer Container */}
      <div
        style={{
          width: 1280,
          height: 360,
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 32,
          padding: "40px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 30px 80px -20px rgba(0, 0, 0, 0.9), 0 0 50px rgba(168, 85, 247, 0.15)",
        }}
      >
        {visualization.map((frequency, index) => {
          // Normalize & amplify frequency for visual punch (min height 16px, max height 260px)
          const barHeight = Math.max(
            16,
            Math.min(260, Math.pow(frequency, 0.8) * 320)
          );

          // Dynamic color gradient across frequency bands (Bass cyan -> Mid purple -> Treble magenta)
          const hue = interpolate(index, [0, numberOfBars - 1], [190, 310]);

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {/* Mirrored dual-sided spectrum bar */}
              <div
                style={{
                  width: "100%",
                  height: barHeight,
                  borderRadius: 9999,
                  background: `linear-gradient(180deg, hsl(${hue}, 95%, 65%) 0%, hsl(${hue}, 85%, 45%) 100%)`,
                  boxShadow: `0 0 16px hsla(${hue}, 90%, 60%, 0.65)`,
                  transition: "height 0.05s ease-out",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Telemetry Footer */}
      <div
        style={{
          marginTop: 48,
          display: "flex",
          gap: 40,
          color: "#64748b",
          fontSize: 20,
          fontWeight: 600,
        }}
      >
        <span>Sample Rate: 48.0 kHz</span>
        <span>•</span>
        <span>Bit Depth: 24-bit PCM</span>
        <span>•</span>
        <span>Window: Hamming / FFT 1024</span>
      </div>
    </AbsoluteFill>
  );
};
