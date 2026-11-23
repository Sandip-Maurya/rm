import React from "react";
import { Audio, Series, staticFile } from "remotion";
import { SCENE_DURATIONS } from "../constants";

export const AudioTrack: React.FC = () => {
  return (
    <Series>
      {/* Scene 1: Hook */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.hook}>
        <Audio src={staticFile("audio/python315/scene01_hook.wav")} volume={1} />
      </Series.Sequence>

      {/* Scene 2: Lazy Imports */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.lazyImports}>
        <Audio src={staticFile("audio/python315/scene02_lazy.wav")} volume={1} />
      </Series.Sequence>

      {/* Scene 3: frozendict */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.frozendict}>
        <Audio src={staticFile("audio/python315/scene03_frozendict.wav")} volume={1} />
      </Series.Sequence>

      {/* Scene 4: Comprehension Unpacking */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.unpacking}>
        <Audio src={staticFile("audio/python315/scene04_unpacking.wav")} volume={1} />
      </Series.Sequence>

      {/* Scene 5: Outro */}
      <Series.Sequence durationInFrames={SCENE_DURATIONS.outro}>
        <Audio src={staticFile("audio/python315/scene05_outro.wav")} volume={1} />
      </Series.Sequence>
    </Series>
  );
};
