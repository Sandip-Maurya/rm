import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { SCENE_DURATIONS, TRANSITION_FRAMES, WRAPPED } from "./constants";
import { Scene01KineticHook } from "./scenes/Scene01KineticHook";
import { Scene02ParticleOrb } from "./scenes/Scene02ParticleOrb";
import { Scene03RankSwap } from "./scenes/Scene03RankSwap";
import { Scene04HeatmapMatrix } from "./scenes/Scene04HeatmapMatrix";
import { AudioTrack } from "./audio/AudioTrack";
import type { DevRewindProps } from "./types";

export const DevRewind: React.FC<DevRewindProps> = ({ enableAudio = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: WRAPPED.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene01KineticHook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.orb}>
          <Scene02ParticleOrb />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.rankSwap}>
          <Scene03RankSwap />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.heatmap}>
          <Scene04HeatmapMatrix />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {enableAudio && <AudioTrack />}
    </AbsoluteFill>
  );
};
