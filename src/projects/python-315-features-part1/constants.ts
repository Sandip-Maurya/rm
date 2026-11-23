import type { SceneDurationConfig } from "./types";

export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;
export const FPS = 30;

// Scene frame durations (@ 30 FPS) - Audio-driven from Kokoro TTS
export const SCENE_DURATIONS: SceneDurationConfig = {
  hook: 175,        // 5.42s audio + 0.4s buffer = 5.83s
  lazyImports: 270, // 8.60s audio + 0.4s buffer = 9.00s
  frozendict: 250,  // 7.89s audio + 0.4s buffer = 8.33s
  unpacking: 230,   // 7.21s audio + 0.4s buffer = 7.66s
  outro: 135,       // 4.03s audio + 0.5s buffer = 4.50s
};

export const TOTAL_DURATION_IN_FRAMES =
  SCENE_DURATIONS.hook +
  SCENE_DURATIONS.lazyImports +
  SCENE_DURATIONS.frozendict +
  SCENE_DURATIONS.unpacking +
  SCENE_DURATIONS.outro; // 1060 frames = 35.33s

// Safe Zone Padding (YouTube Shorts / Reels)
export const SAFE_ZONE = {
  top: 160,
  bottom: 380,
  left: 60,
  right: 150, // Clears Right-side Like/Comment rail
  contentWidth: 870, // 1080 - 60 - 150 = 870px
};

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
