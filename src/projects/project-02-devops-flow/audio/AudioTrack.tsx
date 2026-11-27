import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { BEATS } from "../constants";

export const AudioTrack: React.FC = () => {
  return (
    <>
      <Sequence from={BEATS.baseline.start} durationInFrames={BEATS.baseline.audioFrames + 5}>
        <Audio src={staticFile("audio/devops-flow/beat01_baseline.wav")} volume={1} />
      </Sequence>

      <Sequence from={BEATS.bottleneck.start} durationInFrames={BEATS.bottleneck.audioFrames + 5}>
        <Audio src={staticFile("audio/devops-flow/beat02_bottleneck.wav")} volume={1} />
      </Sequence>

      <Sequence from={BEATS.cache.start} durationInFrames={BEATS.cache.audioFrames + 5}>
        <Audio src={staticFile("audio/devops-flow/beat03_cache.wav")} volume={1} />
      </Sequence>

      <Sequence from={BEATS.queue.start} durationInFrames={BEATS.queue.audioFrames + 5}>
        <Audio src={staticFile("audio/devops-flow/beat04_queue.wav")} volume={1} />
      </Sequence>

      <Sequence from={BEATS.resolution.start} durationInFrames={BEATS.resolution.audioFrames + 5}>
        <Audio src={staticFile("audio/devops-flow/beat05_resolution.wav")} volume={1} />
      </Sequence>
    </>
  );
};
