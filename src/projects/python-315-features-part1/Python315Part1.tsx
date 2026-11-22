import React from "react";
import { AbsoluteFill, Series } from "remotion";
import { SCENE_DURATIONS } from "./constants";
import {
  Scene01Hook,
  Scene02LazyImports,
  Scene03Frozendict,
  Scene04Unpacking,
  Scene05Outro,
} from "./scenes";
import { AudioTrack } from "./audio/AudioTrack";
import type { Python315ShortProps } from "./types";

export const Python315Part1: React.FC<Python315ShortProps> = ({
  enableAudio = false,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#090d16" }}>
      {/* Visual Sequence */}
      <Series>
        {/* Scene 1: Hook */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
          <Scene01Hook />
        </Series.Sequence>

        {/* Scene 2: ⚡ Feature 1 - Lazy Imports */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.lazyImports}>
          <Scene02LazyImports />
        </Series.Sequence>

        {/* Scene 3: 🧊 Feature 2 - frozendict */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.frozendict}>
          <Scene03Frozendict />
        </Series.Sequence>

        {/* Scene 4: 📦 Feature 3 - Unpacking */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.unpacking}>
          <Scene04Unpacking />
        </Series.Sequence>

        {/* Scene 5: Outro / CTA */}
        <Series.Sequence durationInFrames={SCENE_DURATIONS.outro}>
          <Scene05Outro />
        </Series.Sequence>
      </Series>

      {/* Zero-friction audio layer (disabled for now) */}
      {enableAudio && <AudioTrack />}
    </AbsoluteFill>
  );
};
