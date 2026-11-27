export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const FPS = 30;

/**
 * Exact beat boundaries derived from public/audio/async-fix/voiceover.wav (527 frames @ 30fps):
 * - Scene 1 (CRT Crash + Glitch): 0..124
 * - Scene 2 (VS Code Fix):        124..277
 * - Scene 3 (Infinite Dive):      277..340
 * - Scene 4 (Throughput Gauge):   340..560 (voice ends 527 + 33f hold)
 */
export const SCENE_STARTS = {
  crtCrash: 0,
  codeFix: 124,
  parallelDive: 277,
  gauge: 340,
} as const;

export const SCENE_DURATIONS = {
  crtCrash: 124,
  codeFix: 153,
  parallelDive: 63,
  gauge: 220,
} as const;

export const TOTAL_DURATION_IN_FRAMES =
  SCENE_DURATIONS.crtCrash +
  SCENE_DURATIONS.codeFix +
  SCENE_DURATIONS.parallelDive +
  SCENE_DURATIONS.gauge; // 560 frames (18.67s)

export const THEME = {
  bg: "#0D1117",
  surface: "#161B22",
  border: "rgba(240, 246, 252, 0.14)",
  text: "#E6EDF3",
  muted: "#8B949E",
  coral: "#F43F5E",
  emerald: "#10B981",
  sky: "#38BDF8",
  amber: "#F59E0B",
  purple: "#C084FC",
} as const;
