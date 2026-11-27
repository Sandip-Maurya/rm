import React from "react";
import { AbsoluteFill } from "remotion";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { PALETTE, SCENE_DURATIONS, TRANSITION_FRAMES } from "./constants";
import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Product } from "./scenes/Scene02Product";
import { Scene03Proof } from "./scenes/Scene03Proof";
import { Scene04Cta } from "./scenes/Scene04Cta";
import { AudioTrack } from "./audio/AudioTrack";
import type { PulseFlowProps } from "./types";

export const PulseFlow: React.FC<PulseFlowProps> = ({ enableAudio = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene01Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.product}>
          <Scene02Product />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.proof}>
          <Scene03Proof />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta}>
          <Scene04Cta />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {enableAudio && <AudioTrack />}
    </AbsoluteFill>
  );
};
