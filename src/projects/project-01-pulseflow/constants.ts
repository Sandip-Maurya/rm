export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const FPS = 30;

export const TRANSITION_FRAMES = 12;

/**
 * Derived from single-shot Qwen3-TTS voiceover.wav (463 frames @ 30fps):
 * - Scene 1 audio: 0..80
 * - Scene 2 audio: 80..194
 * - Scene 3 audio: 194..390
 * - Scene 4 audio: 390..462 (+38f CTA confetti hold -> 500)
 */
export const SCENE_DURATIONS = {
  hook: 92, // 0 -> 80 (+12 transition overlap)
  product: 126, // 80 -> 194 (+12 transition overlap)
  proof: 208, // 194 -> 390 (+12 transition overlap)
  cta: 110, // 390 -> 500
} as const;

export const SCENE_STARTS = {
  hook: 0,
  product: 80,
  proof: 194,
  cta: 390,
} as const;

export const TOTAL_DURATION_IN_FRAMES =
  SCENE_DURATIONS.hook +
  SCENE_DURATIONS.product +
  SCENE_DURATIONS.proof +
  SCENE_DURATIONS.cta -
  3 * TRANSITION_FRAMES; // 500 frames (16.67s)

export const PALETTE = {
  bg: "#09090B",
  surface: "rgba(24, 24, 27, 0.85)",
  surfaceBorder: "rgba(255, 255, 255, 0.11)",
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
  indigo: "#6366F1",
  indigoGlow: "rgba(99, 102, 241, 0.35)",
  cyan: "#22D3EE",
  cyanGlow: "rgba(34, 211, 238, 0.3)",
  emerald: "#10B981",
  coral: "#F43F5E",
} as const;
