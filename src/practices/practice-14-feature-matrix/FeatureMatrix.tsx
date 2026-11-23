import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { FeatureMatrixProps, FeatureRowItem } from "./types";

const defaultFeatures: FeatureRowItem[] = [
  { feature: "Real-Time 60 FPS Engine", us: true, competitor: false },
  { feature: "Interactive Props in Studio", us: true, competitor: false },
  { feature: "Zero-Latency Bun Runtime", us: true, competitor: false },
  { feature: "Full Vector Math Control", us: true, competitor: true },
];

export const FeatureMatrix: React.FC<FeatureMatrixProps> = ({
  title = "Feature Comparison Matrix",
  ourProduct = "Remotion Native",
  competitorProduct = "Legacy Stack",
  features = defaultFeatures,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header and container pop-in spring (frames 0 -> 24)
  const containerEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6, stiffness: 120 },
  });
  const containerScale = interpolate(containerEntrance, [0, 1], [0.92, 1]);
  const containerOpacity = interpolate(containerEntrance, [0, 1], [0, 1]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#09090b",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: "80px",
      }}
    >
      {/* 3-Column Table Chassis Card */}
      <div
        style={{
          transform: `scale(${containerScale})`,
          opacity: containerOpacity,
          width: "100%",
          maxWidth: 1440,
          background:
            "linear-gradient(145deg, rgba(24, 24, 27, 0.95) 0%, rgba(9, 9, 11, 0.95) 100%)",
          backdropFilter: "blur(24px)",
          borderRadius: 36,
          border: "1px solid rgba(255, 255, 255, 0.14)",
          boxShadow: "0 35px 90px rgba(0, 0, 0, 0.8)",
          padding: "54px 72px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {/* Table Title Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div
              style={{
                color: "#38bdf8",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              ✦ COMPETITIVE ADVANTAGE
            </div>
            <div
              style={{
                color: "#ffffff",
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </div>
          </div>
          <div style={{ color: "#71717a", fontSize: 22, fontWeight: 500 }}>
            Industry Standard Benchmark
          </div>
        </div>

        {/* Column Headers */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2.2fr 1.2fr 1.2fr",
            padding: "20px 24px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
            alignItems: "center",
          }}
        >
          <div style={{ color: "#a1a1aa", fontSize: 24, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Capabilities
          </div>
          <div style={{ textAlign: "center", color: "#38bdf8", fontSize: 28, fontWeight: 800, letterSpacing: "-0.01em" }}>
            {ourProduct}
          </div>
          <div style={{ textAlign: "center", color: "#71717a", fontSize: 26, fontWeight: 600 }}>
            {competitorProduct}
          </div>
        </div>

        {/* Feature Rows (Staggered Reading Rhythm: ~8 frames per row) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {features.map((item, index) => {
            const rowDelay = 18 + index * 10; // Staggered entry starting frame 18
            const rowFrame = frame - rowDelay;

            // Row slide and fade spring
            const rowSpring = spring({
              frame: rowFrame,
              fps,
              config: { damping: 14, mass: 0.5 },
            });
            const rowTranslateY = interpolate(rowSpring, [0, 1], [25, 0]);
            const rowOpacity = interpolate(rowSpring, [0, 1], [0, 1]);

            // Practice 14 Math:
            // Checkmark SVG vector draw-in (frames 0 -> 14 after row begins)
            const checkLength = 40;
            const checkOffset = interpolate(rowFrame, [4, 18], [checkLength, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            });

            return (
              <div
                key={item.feature}
                style={{
                  transform: `translateY(${rowTranslateY}px)`,
                  opacity: rowOpacity,
                  display: "grid",
                  gridTemplateColumns: "2.2fr 1.2fr 1.2fr",
                  padding: "22px 24px",
                  borderRadius: 18,
                  backgroundColor:
                    index % 2 === 0 ? "rgba(255, 255, 255, 0.03)" : "transparent",
                  alignItems: "center",
                  border: "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                {/* Feature Name */}
                <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  {item.feature}
                </div>

                {/* Our Product Column: Glowing Green Checkmark */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {item.us && (
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        backgroundColor: "rgba(34, 197, 94, 0.15)",
                        border: "1px solid rgba(74, 222, 128, 0.35)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 0 20px rgba(74, 222, 128, 0.25)",
                      }}
                    >
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M 4 12 L 9 17 L 20 6"
                          stroke="#4ade80"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={checkLength}
                          strokeDashoffset={checkOffset}
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Competitor Column: Checkmark or Muted Red Cross */}
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {item.competitor ? (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M 4 12 L 9 17 L 20 6"
                          stroke="#a1a1aa"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeDasharray={checkLength}
                          strokeDashoffset={checkOffset}
                        />
                      </svg>
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M 6 6 L 18 18 M 6 18 L 18 6"
                          stroke="#f87171"
                          strokeWidth="3"
                          strokeLinecap="round"
                          opacity="0.8"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
