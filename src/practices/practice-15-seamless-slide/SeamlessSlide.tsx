import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import type { SeamlessSlideProps } from "./types";

// Scene 1: Performance Benchmark Overview
const SceneOne: React.FC<{ title: string; stat: string }> = ({ title, stat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const scale = interpolate(entrance, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          width: 900,
          background:
            "linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)",
          borderRadius: 36,
          border: "1px solid rgba(59, 130, 246, 0.3)",
          boxShadow: "0 35px 90px rgba(0, 0, 0, 0.8), 0 0 50px rgba(59, 130, 246, 0.15)",
          padding: "64px 72px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ color: "#60a5fa", fontSize: 26, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          ✦ SCENE 01 • OVERVIEW
        </div>
        <div style={{ color: "#ffffff", fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        <div style={{ color: "#38bdf8", fontSize: 104, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {stat}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 24, fontWeight: 500, marginTop: 10 }}>
          Global render throughput per cluster
        </div>
      </div>
    </div>
  );
};

// Scene 2: Efficiency Multiplier Deep Dive
const SceneTwo: React.FC<{ title: string; stat: string }> = ({ title, stat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });
  const scale = interpolate(entrance, [0, 1], [0.85, 1]);
  const opacity = interpolate(entrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          width: 900,
          background:
            "linear-gradient(135deg, rgba(6, 78, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)",
          borderRadius: 36,
          border: "1px solid rgba(74, 222, 128, 0.3)",
          boxShadow: "0 35px 90px rgba(0, 0, 0, 0.8), 0 0 50px rgba(74, 222, 128, 0.15)",
          padding: "64px 72px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ color: "#4ade80", fontSize: 26, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          ✦ SCENE 02 • MULTIPLIER
        </div>
        <div style={{ color: "#ffffff", fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em" }}>
          {title}
        </div>
        <div style={{ color: "#4ade80", fontSize: 104, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1 }}>
          {stat}
        </div>
        <div style={{ color: "#94a3b8", fontSize: 24, fontWeight: 500, marginTop: 10 }}>
          Resource utilization optimization index
        </div>
      </div>
    </div>
  );
};

export const SeamlessSlide: React.FC<SeamlessSlideProps> = ({
  scene1Title = "Active Engine Performance",
  scene1Stat = "120 FPS",
  scene2Title = "Resource Efficiency Gains",
  scene2Stat = "+340%",
}) => {
  // Practice 15 Architecture:
  // TransitionSeries with linearTiming and slide presentation.
  // Scene 1 duration: 65 frames
  // Transition duration: 18 frames (slides from right, pushing Scene 1 off to left without black seams)
  // Scene 2 duration: 73 frames
  // Total duration: 65 + 73 - 18 = 120 frames (4 seconds @ 30fps)
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={65}>
        <SceneOne title={scene1Title} stat={scene1Stat} />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={linearTiming({ durationInFrames: 18 })}
      />

      <TransitionSeries.Sequence durationInFrames={73}>
        <SceneTwo title={scene2Title} stat={scene2Stat} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
