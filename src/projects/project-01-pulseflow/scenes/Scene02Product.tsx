import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PALETTE } from "../constants";
import { ConstellationBackground } from "../components/ConstellationBackground";

interface PipelineStage {
  id: string;
  step: string;
  name: string;
  metric: string;
  doneFrame: number;
}

const STAGES: PipelineStage[] = [
  { id: "build", step: "01", name: "AST Build", metric: "0.4s", doneFrame: 36 },
  { id: "test", step: "02", name: "Edge Checks", metric: "1.1s", doneFrame: 62 },
  { id: "deploy", step: "03", name: "Global Rollout", metric: "0.3s", doneFrame: 90 },
];

export const Scene02Product: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 120 },
  });

  const cardSpring = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, mass: 0.7, stiffness: 95 },
  });

  const rotX = interpolate(cardSpring, [0, 1], [18, 6]);
  const rotY = interpolate(frame, [0, 126], [-14, 5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.sin),
  });
  const cardScale = interpolate(cardSpring, [0, 1], [0.85, 1]);
  const floatY = Math.sin(frame * 0.06) * 5;

  // Diagonal specular glare sweep across the glass surface
  const glareX = interpolate(frame, [26, 86], [-60, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: PALETTE.bg,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ConstellationBackground opacity={0.55} />

      {/* Backglow behind 3D stage */}
      <div
        style={{
          position: "absolute",
          width: 1180,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.26) 0%, rgba(34,211,238,0.12) 42%, rgba(9,9,11,0) 72%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          padding: "0 120px",
          boxSizing: "border-box",
        }}
      >
        {/* Top Product Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 42,
            opacity: headerSpring,
            transform: `translateY(${interpolate(headerSpring, [0, 1], [24, 0])}px)`,
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${PALETTE.indigo}, ${PALETTE.cyan})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 28px ${PALETTE.indigoGlow}`,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 54,
                fontWeight: 800,
                color: PALETTE.textPrimary,
                letterSpacing: -1.5,
                lineHeight: 1.05,
              }}
            >
              Meet PulseFlow
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: PALETTE.textSecondary,
                marginTop: 4,
              }}
            >
              Automated pipelines built for speed
            </div>
          </div>
        </div>

        {/* 3D Glass Device Frame */}
        <div
          style={{
            width: 1320,
            borderRadius: 28,
            padding: 2,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.28) 0%, rgba(99,102,241,0.35) 50%, rgba(34,211,238,0.25) 100%)",
            boxShadow:
              "0 40px 90px rgba(0, 0, 0, 0.72), 0 0 50px rgba(99, 102, 241, 0.22)",
            transform: `perspective(1600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${cardScale}) translateY(${floatY}px)`,
            opacity: cardSpring,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              backgroundColor: "#111116",
              borderRadius: 26,
              padding: "30px 38px 38px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Window Top Chrome */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingBottom: 24,
                borderBottom: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#EF4444" }} />
                <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#F59E0B" }} />
                <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: "#10B981" }} />
                <span
                  style={{
                    marginLeft: 16,
                    color: PALETTE.textSecondary,
                    fontSize: 20,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  }}
                >
                  pulseflow.dev / pipelines / prod-edge
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 16px",
                  borderRadius: 999,
                  backgroundColor: "rgba(16, 185, 129, 0.14)",
                  border: "1px solid rgba(16, 185, 129, 0.45)",
                  color: PALETTE.emerald,
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    backgroundColor: PALETTE.emerald,
                    boxShadow: `0 0 10px ${PALETTE.emerald}`,
                  }}
                />
                LIVE PIPELINE
              </div>
            </div>

            {/* 3-Stage Animated Pipeline Row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 36,
                gap: 20,
              }}
            >
              {STAGES.map((stage, idx) => {
                const startF = stage.doneFrame - 24;
                const progress = interpolate(frame, [startF, stage.doneFrame], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.cubic),
                });
                const isDone = frame >= stage.doneFrame;
                const accent = isDone ? PALETTE.emerald : PALETTE.cyan;

                return (
                  <React.Fragment key={stage.id}>
                    <div
                      style={{
                        flex: 1,
                        borderRadius: 20,
                        padding: "24px 26px",
                        backgroundColor: "rgba(255, 255, 255, 0.035)",
                        border: `1.5px solid ${isDone ? "rgba(16, 185, 129, 0.5)" : "rgba(34, 211, 238, 0.35)"}`,
                        boxShadow: isDone
                          ? "0 10px 30px rgba(16, 185, 129, 0.12)"
                          : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 14,
                        }}
                      >
                        <span
                          style={{
                            color: PALETTE.textSecondary,
                            fontSize: 16,
                            fontWeight: 700,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          STAGE {stage.step}
                        </span>
                        <span
                          style={{
                            color: accent,
                            fontSize: 18,
                            fontWeight: 700,
                            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                          }}
                        >
                          {isDone ? `✓ ${stage.metric}` : `${Math.round(progress * 100)}%`}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: PALETTE.textPrimary,
                          marginBottom: 18,
                        }}
                      >
                        {stage.name}
                      </div>

                      <div
                        style={{
                          width: "100%",
                          height: 8,
                          borderRadius: 999,
                          backgroundColor: "rgba(255,255,255,0.08)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${progress * 100}%`,
                            height: "100%",
                            borderRadius: 999,
                            background: isDone
                              ? PALETTE.emerald
                              : `linear-gradient(90deg, ${PALETTE.indigo}, ${PALETTE.cyan})`,
                          }}
                        />
                      </div>
                    </div>

                    {idx < STAGES.length - 1 && (
                      <svg width="44" height="24" viewBox="0 0 44 24" fill="none">
                        <path
                          d="M2 12 H38 M30 5 L39 12 L30 19"
                          stroke={isDone ? PALETTE.emerald : "rgba(161, 161, 170, 0.35)"}
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Bottom Live Summary Strip */}
            <div
              style={{
                marginTop: 30,
                padding: "16px 24px",
                borderRadius: 14,
                backgroundColor: "rgba(99, 102, 241, 0.09)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 18,
                color: PALETTE.textSecondary,
              }}
            >
              <span>region: global-edge (38 PoPs)</span>
              <span style={{ color: PALETTE.cyan, fontWeight: 700 }}>
                total_deploy_time: 1.8s
              </span>
            </div>

            {/* Diagonal Specular Glass Glare Sweep */}
            <div
              style={{
                position: "absolute",
                top: "-30%",
                bottom: "-30%",
                left: `${glareX}%`,
                width: "28%",
                transform: "skewX(-28deg)",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0) 100%)",
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
