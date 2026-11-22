import React from "react";
import { AbsoluteFill } from "remotion";

/**
 * AudioTrack placeholder scaffold.
 * Plug-and-play ready for when voiceover, BGM, or SFX files are added.
 */
export const AudioTrack: React.FC = () => {
  return <AbsoluteFill style={{ pointerEvents: "none" }} />;
};
