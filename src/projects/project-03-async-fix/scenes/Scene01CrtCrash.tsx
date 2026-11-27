import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../constants";

interface WaterfallItem {
  label: string;
  start: number;
  end: number;
  ms: string;
}

const WATERFALL: WaterfallItem[] = [
  { label: "await fetchUser(id)", start: 10, end: 32, ms: "610ms" },
  { label: "await fetchOrders(id)", start: 32, end: 56, ms: "640ms" },
  { label: "await fetchMetrics(id)", start: 56, end: 80, ms: "590ms" },
  { label: "await fetchAlerts(id)", start: 80, end: 104, ms: "560ms" },
];

export const Scene01CrtCrash: React.FC = () => {
  const frame = useCurrentFrame();

  const flicker = 0.96 + Math.sin(frame * 1.9) * 0.04;
  const totalMs = Math.round(
    interpolate(frame, [10, 104], [0, 2400], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // 10-frame RGB glitch cut at the end of Scene 1 (frames 114..124)
  const isGlitch = frame >= 114;
  const seed = Math.sin(frame * 9973);
  const redShift = isGlitch ? seed * 22 : 0;
  const cyanShift = isGlitch ? -seed * 22 : 0;
  const jitterY = isGlitch ? Math.cos(frame * 4321) * 8 : 0;

  const renderTerminalContent = (tintColor?: string) => (
    <div
      style={{
        width: 1480,
        borderRadius: 28,
        padding: "44px 52px",
        backgroundColor: "#0A0F0D",
        border: `2px solid ${tintColor ?? "rgba(244, 63, 94, 0.45)"}`,
        boxShadow: "0 30px 90px rgba(0, 0, 0, 0.85)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        color: tintColor ?? THEME.text,
      }}
    >
      {/* Terminal Top Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 24,
          borderBottom: "1px solid rgba(255,255,255,0.12)",
          marginBottom: 34,
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 700, color: tintColor ?? THEME.coral }}>
          VT-420 // SEQUENTIAL AWAIT TRACE
        </span>
        <span
          style={{
            padding: "8px 18px",
            borderRadius: 10,
            backgroundColor: "rgba(244, 63, 94, 0.16)",
            border: `1.5px solid ${THEME.coral}`,
            color: THEME.coral,
            fontSize: 24,
            fontWeight: 800,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {totalMs}ms {frame >= 102 ? "TIMEOUT!" : ""}
        </span>
      </div>

      {/* Sequential Waterfall Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {WATERFALL.map((item, idx) => {
          const barProg = interpolate(frame, [item.start, item.end], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          });
          const leftPct = idx * 24;
          const widthPct = 24 * barProg;
          const active = frame >= item.start;

          return (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 24 }}>
              <div
                style={{
                  width: 390,
                  fontSize: 24,
                  color: active ? (tintColor ?? THEME.text) : THEME.muted,
                  fontWeight: 600,
                }}
              >
                {item.label}
              </div>

              <div
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.05)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: 0,
                    bottom: 0,
                    borderRadius: 6,
                    backgroundColor: tintColor ?? THEME.coral,
                    boxShadow: `0 0 18px ${THEME.coral}88`,
                  }}
                />
              </div>

              <div
                style={{
                  width: 96,
                  textAlign: "right",
                  fontSize: 22,
                  color: frame >= item.end ? THEME.coral : THEME.muted,
                  fontWeight: 700,
                }}
              >
                {frame >= item.end ? item.ms : "..."}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#06080A",
        justifyContent: "center",
        alignItems: "center",
        opacity: flicker,
      }}
    >
      {/* Main CRT Layer */}
      <div style={{ transform: `translateY(${jitterY}px)` }}>
        {renderTerminalContent()}
      </div>

      {/* Chromatic RGB Split Layers during glitch cut */}
      {isGlitch && (
        <>
          <div
            style={{
              position: "absolute",
              transform: `translate(${redShift}px, ${-jitterY}px)`,
              mixBlendMode: "screen",
              opacity: 0.75,
              pointerEvents: "none",
            }}
          >
            {renderTerminalContent("#FF2A55")}
          </div>
          <div
            style={{
              position: "absolute",
              transform: `translate(${cyanShift}px, ${jitterY}px)`,
              mixBlendMode: "screen",
              opacity: 0.75,
              pointerEvents: "none",
            }}
          >
            {renderTerminalContent("#22D3EE")}
          </div>
        </>
      )}

      {/* CRT Horizontal Scanlines + Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 5px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle, rgba(0,0,0,0) 58%, rgba(0,0,0,0.72) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
