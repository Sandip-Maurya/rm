import type { SceneDurationConfig } from "./types";

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const FPS = 30;

// Scene frame durations (@ 30 FPS)
export const SCENE_DURATIONS: SceneDurationConfig = {
  hook: 105,        // 3.5s
  lazyImports: 165, // 5.5s
  frozendict: 165,  // 5.5s
  unpacking: 165,   // 5.5s
  outro: 90,        // 3.0s
};

export const TOTAL_DURATION_IN_FRAMES =
  SCENE_DURATIONS.hook +
  SCENE_DURATIONS.lazyImports +
  SCENE_DURATIONS.frozendict +
  SCENE_DURATIONS.unpacking +
  SCENE_DURATIONS.outro; // 690 frames = 23.0s

// Theme Palette (Dark Modern Tech + Python accents)
export const THEME = {
  bg: "#090d16",
  bgSubtle: "#111827",
  cardBg: "rgba(17, 24, 39, 0.88)",
  cardBorder: "rgba(255, 255, 255, 0.12)",
  
  // Python Branding Accents
  pythonBlue: "#38bdf8",     // Vibrant Python blue
  pythonYellow: "#facc15",   // Python warm gold
  pythonGreen: "#4ade80",    // Fast/Success accent
  accentRed: "#f87171",      // Error/Before accent
  
  textPrimary: "#f8fafc",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  
  codeBg: "#0f172a",
  codeKeyword: "#c084fc",    // Purple
  codeFunction: "#facc15",   // Yellow
  codeString: "#4ade80",     // Green
  codeComment: "#64748b",    // Grey
  codeType: "#38bdf8",       // Cyan/Blue
};
