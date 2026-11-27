export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const FPS = 30;

/**
 * Exact timings derived from Qwen3-TTS generated WAV durations @ 30fps:
 * - beat01_baseline.wav:   5.82s (175 frames)
 * - beat02_bottleneck.wav: 6.62s (199 frames)
 * - beat03_cache.wav:      4.06s (122 frames)
 * - beat04_queue.wav:      4.62s (139 frames)
 * - beat05_resolution.wav: 4.14s (124 frames)
 */
export const BEATS = {
  baseline: { start: 10, audioFrames: 175, end: 200 },
  bottleneck: { start: 200, audioFrames: 199, end: 415 },
  cache: { start: 415, audioFrames: 122, end: 555 },
  queue: { start: 555, audioFrames: 139, end: 712 },
  resolution: { start: 712, audioFrames: 124, end: 875 },
} as const;

export const TOTAL_DURATION_IN_FRAMES = BEATS.resolution.end;

export const COLORS = {
  bg: "#090E1A",
  gridDot: "rgba(148, 163, 184, 0.16)",
  cardBg: "rgba(15, 23, 42, 0.88)",
  cardBorder: "rgba(148, 163, 184, 0.22)",
  textPrimary: "#F8FAFC",
  textSecondary: "#94A3B8",
  sky: "#38BDF8",
  indigo: "#818CF8",
  coral: "#F43F5E",
  amber: "#F59E0B",
  emerald: "#10B981",
  violet: "#A855F7",
} as const;

export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 148;

export type NodeId = "client" | "api" | "postgres" | "redis" | "kafka" | "workers";

export const NODE_POSITIONS: Record<NodeId, { x: number; y: number }> = {
  client: { x: 270, y: 555 },
  api: { x: 720, y: 555 },
  postgres: { x: 1200, y: 555 },
  redis: { x: 960, y: 265 },
  kafka: { x: 1200, y: 840 },
  workers: { x: 1640, y: 840 },
};

export interface CameraKeyframe {
  frame: number;
  x: number;
  y: number;
  zoom: number;
}

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { frame: 0, x: 735, y: 555, zoom: 1.06 },
  { frame: 185, x: 735, y: 555, zoom: 1.06 },
  // Beat 2: Zoom onto Postgres bottleneck
  { frame: 235, x: 1120, y: 555, zoom: 1.44 },
  { frame: 405, x: 1120, y: 555, zoom: 1.44 },
  // Beat 3: Pan & zoom to Redis Cache + API
  { frame: 450, x: 930, y: 395, zoom: 1.3 },
  { frame: 545, x: 930, y: 395, zoom: 1.3 },
  // Beat 4: Pan & zoom to Kafka Queue + Worker Pool
  { frame: 595, x: 1260, y: 730, zoom: 1.24 },
  { frame: 700, x: 1260, y: 730, zoom: 1.24 },
  // Beat 5: Pull back to full architecture
  { frame: 748, x: 960, y: 545, zoom: 1.0 },
  { frame: TOTAL_DURATION_IN_FRAMES, x: 960, y: 545, zoom: 1.0 },
];
