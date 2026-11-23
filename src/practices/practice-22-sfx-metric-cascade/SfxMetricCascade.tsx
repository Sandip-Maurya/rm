import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SfxMetricCascadeProps } from "./types";

export const SfxMetricCascade: React.FC<SfxMetricCascadeProps> = ({
  title = "Infrastructure Health Check",
  subtitle = "Deterministic Impact Synchronization • Frame-Accurate Audio Triggers",
  metrics = [
    {
      label: "Zero-Trust Mesh Network",
      value: "PASSED (100% MTLS)",
      status: "SECURE",
      impactFrame: 15,
    },
    {
      label: "Global Replication Latency",
      value: "1.4ms (p99)",
      status: "OPTIMAL",
      impactFrame: 30,
    },
    {
      label: "Autonomous Failover SLA",
      value: "99.999% VERIFIED",
      status: "READY",
      impactFrame: 45,
    },
  ],
  enableAudio = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header fade-in
  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 15 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050811",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 120px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 40%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Frame-Synced Audio Triggers at exact impact keyframes (15, 30, 45) */}
      {enableAudio && (
        <>
          <Sequence from={15}>
            <Audio
              src={staticFile("audio/samples/sample-locked-verify.wav")}
              volume={0.7}
            />
          </Sequence>
          <Sequence from={30}>
            <Audio
              src={staticFile("audio/samples/sample-locked-verify.wav")}
              volume={0.8}
            />
          </Sequence>
          <Sequence from={45}>
            <Audio
              src={staticFile("audio/samples/sample-am-channel-short.wav")}
              volume={0.85}
            />
          </Sequence>
        </>
      )}

      {/* Header section */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 60,
          transform: `scale(${headerEntrance})`,
          opacity: headerEntrance,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            borderRadius: 9999,
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(52, 211, 153, 0.35)",
            color: "#6ee7b7",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "#10b981",
              boxShadow: "0 0 10px #10b981",
            }}
          />
          Live Telemetry Verification
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#f8fafc",
            letterSpacing: "-0.03em",
            marginBottom: 14,
          }}
        >
          {title}
        </h1>

        <p
          style={{
            fontSize: 26,
            color: "#94a3b8",
            fontWeight: 500,
            maxWidth: 1000,
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Metric Cards Cascade */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 28,
          width: "100%",
          maxWidth: 1300,
        }}
      >
        {metrics.map((item, idx) => {
          // Spring physics starting exactly at each item's impactFrame
          const cardSpring = spring({
            frame: frame - item.impactFrame,
            fps,
            config: { damping: 10, mass: 0.6, stiffness: 160 },
          });

          // Impact shockwave / flash on exact landing frame
          const isLanded = frame >= item.impactFrame;
          const flashIntensity = interpolate(
            frame,
            [item.impactFrame, item.impactFrame + 6, item.impactFrame + 18],
            [1, 0.5, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          const scale = isLanded ? cardSpring : 0;
          const translateY = interpolate(scale, [0, 1], [60, 0]);

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "32px 48px",
                borderRadius: 24,
                backgroundColor: isLanded
                  ? `rgba(15, 23, 42, ${0.85 + flashIntensity * 0.15})`
                  : "transparent",
                border: isLanded
                  ? `1.5px solid rgba(${
                      idx === 2 ? "52, 211, 153" : "96, 165, 250"
                    }, ${0.3 + flashIntensity * 0.5})`
                  : "none",
                boxShadow: isLanded
                  ? `0 20px 40px rgba(0,0,0,0.6), 0 0 ${
                      20 + flashIntensity * 40
                    }px rgba(${
                      idx === 2 ? "16, 185, 129" : "59, 130, 246"
                    }, ${0.15 + flashIntensity * 0.4})`
                  : "none",
                transform: `scale(${scale}) translateY(${translateY}px)`,
                opacity: scale,
              }}
            >
              {/* Left Column: Icon + Label */}
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    backgroundColor:
                      idx === 2
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(59, 130, 246, 0.2)",
                    border: `1.5px solid ${
                      idx === 2 ? "#10b981" : "#3b82f6"
                    }`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      flashIntensity > 0
                        ? `0 0 25px ${idx === 2 ? "#10b981" : "#3b82f6"}`
                        : "none",
                  }}
                >
                  <svg
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={idx === 2 ? "#34d399" : "#60a5fa"}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 34,
                      fontWeight: 800,
                      color: "#f8fafc",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontSize: 22,
                      color: "#94a3b8",
                      fontWeight: 500,
                    }}
                  >
                    Audited at T+{item.impactFrame} frames
                  </span>
                </div>
              </div>

              {/* Right Column: Value + Status Pill */}
              <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: idx === 2 ? "#34d399" : "#38bdf8",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.value}
                </span>

                <div
                  style={{
                    padding: "10px 22px",
                    borderRadius: 14,
                    backgroundColor:
                      idx === 2
                        ? "rgba(16, 185, 129, 0.2)"
                        : "rgba(59, 130, 246, 0.18)",
                    border: `1px solid ${
                      idx === 2 ? "#34d399" : "#60a5fa"
                    }`,
                    color: idx === 2 ? "#6ee7b7" : "#93c5fd",
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                  }}
                >
                  {item.status}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
