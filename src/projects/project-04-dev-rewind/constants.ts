export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const FPS = 30;
export const TRANSITION_FRAMES = 10;

/**
 * Exact beat boundaries derived from dylan_warm_casual.wav (388 frames @ 30fps):
 * - Scene 1 (Hook):     0..80
 * - Scene 2 (Orb):      80..158
 * - Scene 3 (RankSwap): 158..286
 * - Scene 4 (Heatmap):  286..430 (voice ends 388 + 42f hold)
 */
export const SCENE_STARTS = {
  hook: 0,
  orb: 80,
  rankSwap: 158,
  heatmap: 286,
} as const;

export const SCENE_DURATIONS = {
  hook: 90,
  orb: 98,
  rankSwap: 148,
  heatmap: 154,
} as const;

export const TOTAL_DURATION_IN_FRAMES =
  SCENE_DURATIONS.hook +
  SCENE_DURATIONS.orb +
  SCENE_DURATIONS.rankSwap +
  SCENE_DURATIONS.heatmap -
  3 * TRANSITION_FRAMES; // 430 frames (14.33s)

export const WRAPPED = {
  bg: "#0F0720",
  surface: "rgba(30, 16, 62, 0.84)",
  border: "rgba(168, 85, 247, 0.28)",
  text: "#FAF5FF",
  muted: "#C4B5FD",
  violet: "#A855F7",
  magenta: "#EC4899",
  gold: "#FACC15",
  cyan: "#38BDF8",
} as const;
