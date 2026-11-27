import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { SCENE_DURATIONS, THEME } from "./constants";
import { Scene01CrtCrash } from "./scenes/Scene01CrtCrash";
import { Scene02CodeFix } from "./scenes/Scene02CodeFix";
import { Scene03ParallelDive } from "./scenes/Scene03ParallelDive";
import { Scene04ThroughputGauge } from "./scenes/Scene04ThroughputGauge";
import { AudioTrack } from "./audio/AudioTrack";
import type { AsyncFixProps } from "./types";

export const AsyncFix: React.FC<AsyncFixProps> = ({ enableAudio = true }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg }}>
      <Series>
        <Series.Sequence durationInFrames={SCENE_DURATIONS.crtCrash}>
          <Scene01CrtCrash />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.codeFix}>
          <Scene02CodeFix />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.parallelDive}>
          <Scene03ParallelDive />
        </Series.Sequence>

        <Series.Sequence durationInFrames={SCENE_DURATIONS.gauge}>
          <Scene04ThroughputGauge />
        </Series.Sequence>
      </Series>

      {enableAudio && <AudioTrack />}
    </AbsoluteFill>
  );
};
