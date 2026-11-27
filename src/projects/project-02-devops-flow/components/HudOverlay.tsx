import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BEATS, COLORS, TOTAL_DURATION_IN_FRAMES } from "../constants";

interface HudOverlayProps {
  showSubtitles?: boolean;
}

interface BeatMeta {
  index: number;
  tag: string;
  color: string;
  subtitle: string;
  start: number;
  end: number;
}

const BEAT_LIST: BeatMeta[] = [
  {
    index: 1,
    tag: "01 // BASELINE TOPOLOGY",
    color: COLORS.sky,
    subtitle: "Every growing app starts simple: a client, an API server, and one database.",
    start: 0,
    end: BEATS.bottleneck.start,
  },
  {
    index: 2,
    tag: "02 // DATABASE BOTTLENECK",
    color: COLORS.coral,
    subtitle: "When traffic spikes, that database bottlenecks — latency hits 480ms.",
    start: BEATS.bottleneck.start,
    end: BEATS.cache.start,
  },
  {
    index: 3,
    tag: "03 // READ-THROUGH CACHE",
    color: COLORS.sky,
    subtitle: "First, we add a Redis cache in front to absorb repeated reads.",
    start: BEATS.cache.start,
    end: BEATS.queue.start,
  },
  {
    index: 4,
    tag: "04 // ASYNC EVENT QUEUE",
    color: COLORS.violet,
    subtitle: "Next, we introduce a Kafka queue so heavy jobs run asynchronously.",
    start: BEATS.queue.start,
    end: BEATS.resolution.start,
  },
  {
    index: 5,
    tag: "05 // SYSTEM HEALTHY",
    color: COLORS.emerald,
    subtitle: "Result? Latency drops to 18 milliseconds.",
    start: BEATS.resolution.start,
    end: TOTAL_DURATION_IN_FRAMES,
  },
];

const FALLBACK_BEAT: BeatMeta = {
  index: 5,
  tag: "05 // SYSTEM HEALTHY",
  color: COLORS.emerald,
  subtitle: "Result? Latency drops to 18 milliseconds.",
  start: BEATS.resolution.start,
  end: TOTAL_DURATION_IN_FRAMES,
};

export const HudOverlay: React.FC<HudOverlayProps> = ({ showSubtitles = true }) => {
  const frame = useCurrentFrame();

  const activeBeat =
    BEAT_LIST.find((b) => frame >= b.start && frame < b.end) ??
    BEAT_LIST[BEAT_LIST.length - 1] ??
    FALLBACK_BEAT;

  // Smooth global latency counter across the 5 beats
  const latencyMs = Math.round(
    interpolate(
      frame,
      [
        0,
        195,
        245,
        405,
        455,
        545,
        600,
        705,
        755,
        TOTAL_DURATION_IN_FRAMES,
      ],
      [42, 46, 480, 480, 140, 140, 62, 62, 18, 18],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      }
    )
  );

  const latencyColor =
    latencyMs >= 250
      ? COLORS.coral
      : latencyMs >= 80
        ? COLORS.amber
        : frame >= BEATS.resolution.start + 35
          ? COLORS.emerald
          : COLORS.sky;

  const checkDraw = interpolate(
    frame,
    [BEATS.resolution.start + 35, BEATS.resolution.start + 55],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Top-left Phase Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 20px",
            borderRadius: 16,
            backgroundColor: "rgba(15, 23, 42, 0.85)",
            border: `1.5px solid ${activeBeat.color}66`,
            boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: activeBeat.color,
              boxShadow: `0 0 12px ${activeBeat.color}`,
            }}
          />
          <span
            style={{
              color: COLORS.textPrimary,
              fontSize: 18,
              fontWeight: 700,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: 0.8,
            }}
          >
            {activeBeat.tag}
          </span>
        </div>

        {/* Top-right Global Latency Telemetry */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "12px 22px",
            borderRadius: 16,
            backgroundColor: "rgba(15, 23, 42, 0.88)",
            border: `1.5px solid ${latencyColor}77`,
            boxShadow: `0 12px 30px rgba(0,0,0,0.35), 0 0 24px ${latencyColor}22`,
          }}
        >
          <span
            style={{
              color: COLORS.textSecondary,
              fontSize: 16,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            P95 Latency
          </span>
          <span
            style={{
              color: latencyColor,
              fontSize: 28,
              fontWeight: 800,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontVariantNumeric: "tabular-nums",
              minWidth: 96,
              textAlign: "right",
            }}
          >
            {latencyMs}ms
          </span>
          {checkDraw > 0 && (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke={COLORS.emerald}
                strokeWidth="2.2"
                opacity={checkDraw}
              />
              <path
                d="M7.5 12.5 L10.5 15.5 L16.5 9"
                stroke={COLORS.emerald}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={20}
                strokeDashoffset={20 * (1 - checkDraw)}
              />
            </svg>
          )}
        </div>
      </div>

      {/* Bottom Subtitle & Progress Strip */}
      <div
        style={{
          position: "absolute",
          bottom: 34,
          left: 48,
          right: 48,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {showSubtitles && (
          <div
            style={{
              padding: "12px 26px",
              borderRadius: 14,
              backgroundColor: "rgba(9, 14, 26, 0.86)",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              color: COLORS.textPrimary,
              fontSize: 24,
              fontWeight: 600,
              letterSpacing: 0.2,
              boxShadow: "0 10px 28px rgba(0,0,0,0.45)",
            }}
          >
            {activeBeat.subtitle}
          </div>
        )}

        {/* 5-Segment Beat Progress Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: 10,
          }}
        >
          {BEAT_LIST.map((b) => {
            const segProgress = interpolate(
              frame,
              [b.start, b.end],
              [0, 100],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );
            return (
              <div
                key={b.index}
                style={{
                  flex: b.end - b.start,
                  height: 5,
                  borderRadius: 999,
                  backgroundColor: "rgba(148, 163, 184, 0.18)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${segProgress}%`,
                    height: "100%",
                    backgroundColor: b.color,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
