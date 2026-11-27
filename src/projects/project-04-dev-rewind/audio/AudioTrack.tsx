import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SCENE_STARTS } from "../constants";

export const AudioTrack: React.FC = () => {
  return (
    <>
      {/* Single-shot Dylan Warm Casual Voiceover */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/dev-rewind/voiceover.wav")} volume={1} />
      </Sequence>

      {/* Scene transition whooshes */}
      <Sequence from={SCENE_STARTS.orb - 3} durationInFrames={14}>
        <Audio src={staticFile("audio/dev-rewind/sfx/whoosh.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={SCENE_STARTS.rankSwap - 3} durationInFrames={14}>
        <Audio src={staticFile("audio/dev-rewind/sfx/whoosh.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={SCENE_STARTS.heatmap - 3} durationInFrames={14}>
        <Audio src={staticFile("audio/dev-rewind/sfx/whoosh.wav")} volume={0.32} />
      </Sequence>

      {/* Rank swap sound */}
      <Sequence from={SCENE_STARTS.rankSwap + 42} durationInFrames={12}>
        <Audio src={staticFile("audio/dev-rewind/sfx/swap.wav")} volume={0.55} />
      </Sequence>

      {/* Top 1% Badge sparkle */}
      <Sequence from={SCENE_STARTS.heatmap + 70} durationInFrames={24}>
        <Audio src={staticFile("audio/dev-rewind/sfx/sparkle.wav")} volume={0.48} />
      </Sequence>
    </>
  );
};
