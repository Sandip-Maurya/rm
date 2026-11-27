import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import { SCENE_STARTS } from "../constants";

export const AudioTrack: React.FC = () => {
  return (
    <>
      {/* Single-shot Qwen3-TTS Voiceover */}
      <Sequence from={0}>
        <Audio src={staticFile("audio/async-fix/voiceover.wav")} volume={1} />
      </Sequence>

      {/* Glitch SFX at CRT cut */}
      <Sequence from={SCENE_STARTS.codeFix - 10} durationInFrames={12}>
        <Audio src={staticFile("audio/async-fix/sfx/glitch.wav")} volume={0.55} />
      </Sequence>

      {/* Dive Whoosh into Parallel Lanes */}
      <Sequence from={SCENE_STARTS.parallelDive} durationInFrames={16}>
        <Audio src={staticFile("audio/async-fix/sfx/whoosh.wav")} volume={0.38} />
      </Sequence>

      {/* Transition Whoosh to Gauge */}
      <Sequence from={SCENE_STARTS.gauge - 3} durationInFrames={15}>
        <Audio src={staticFile("audio/async-fix/sfx/whoosh.wav")} volume={0.3} />
      </Sequence>

      {/* Gauge Rev Sweep */}
      <Sequence from={SCENE_STARTS.gauge + 76} durationInFrames={24}>
        <Audio src={staticFile("audio/async-fix/sfx/rev.wav")} volume={0.35} />
      </Sequence>
    </>
  );
};
