import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SCENE_STARTS } from "../constants";

export const AudioTrack: React.FC = () => {
  return (
    <>
      {/* Single-shot Qwen3-TTS Voiceover */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/pulseflow/voiceover.wav")} volume={1} />
      </Sequence>

      {/* Subtle Whoosh on Scene Transitions */}
      <Sequence from={SCENE_STARTS.product - 4} durationInFrames={15}>
        <Audio src={staticFile("audio/pulseflow/sfx/whoosh.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={SCENE_STARTS.proof - 4} durationInFrames={15}>
        <Audio src={staticFile("audio/pulseflow/sfx/whoosh.wav")} volume={0.32} />
      </Sequence>
      <Sequence from={SCENE_STARTS.cta - 4} durationInFrames={15}>
        <Audio src={staticFile("audio/pulseflow/sfx/whoosh.wav")} volume={0.32} />
      </Sequence>

      {/* Tactile Click + Confetti Pop + Success Chime in Scene 4 */}
      <Sequence from={SCENE_STARTS.cta + 46} durationInFrames={10}>
        <Audio src={staticFile("audio/pulseflow/sfx/click.wav")} volume={0.75} />
      </Sequence>
      <Sequence from={SCENE_STARTS.cta + 48} durationInFrames={12}>
        <Audio src={staticFile("audio/pulseflow/sfx/pop.wav")} volume={0.6} />
      </Sequence>
      <Sequence from={SCENE_STARTS.cta + 49} durationInFrames={30}>
        <Audio src={staticFile("audio/pulseflow/sfx/chime.wav")} volume={0.42} />
      </Sequence>
    </>
  );
};
