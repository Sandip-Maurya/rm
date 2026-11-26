import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { MotionBlurProps } from "./types";

/** Pure deterministic X position curve:
 *  Frames 0..10: rest at -560
 *  Frames 10..42: rocket left -> right (-560 -> +560)
 *  Frames 42..54: sharp stop hold at +560
 *  Frames 54..76: snap back to center (+560 -> 0)
 *  Frames 76..90: crisp rest at 0
 */
function getPositionX(f: number): number {
  if (f <= 10) return -560;
  if (f < 42) {
    return interpolate(f, [10, 42], [-560, 560], {
      easing: Easing.bezier(0.76, 0, 0.24, 1),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  if (f <= 54) return 560;
  if (f < 76) {
    return interpolate(f, [54, 76], [560, 0], {
      easing: Easing.out(Easing.exp),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  }
  return 0;
}

const MotionCardBody: React.FC<{
  cardTitle: string;
  metricValue: string;
  velocity: number;
}> = ({ cardTitle, metricValue, velocity }) => {
  return (
    <div
      style={{
        width: 580,
        height: 310,
        borderRadius: 34,
        background:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.9) 100%)",
        border: "2px solid rgba(56, 189, 248, 0.55)",
        boxShadow:
          "0 30px 70px rgba(0, 0, 0, 0.75), 0 0 40px rgba(56, 189, 248, 0.22)",
        padding: "36px 44px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            padding: "6px 16px",
            borderRadius: 9999,
            backgroundColor: "rgba(56, 189, 248, 0.16)",
            border: "1px solid rgba(56, 189, 248, 0.45)",
            color: "#38bdf8",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          SHUTTER // 180°
        </span>
        <span
          style={{
            color: velocity > 0 ? "#f472b6" : "#34d399",
            fontSize: 18,
            fontWeight: 800,
          }}
        >
          {velocity > 0 ? "IN MOTION" : "LOCKED SHARP"}
        </span>
      </div>

      <div>
        <div style={{ fontSize: 22, color: "#94a3b8", fontWeight: 700 }}>
          {cardTitle}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginTop: 6,
          }}
        >
          {metricValue}
        </div>
      </div>

      <div
        style={{
          height: 6,
          width: "100%",
          borderRadius: 9999,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(100, 35 + velocity * 0.9)}%`,
            background: "linear-gradient(90deg, #38bdf8, #f472b6)",
            borderRadius: 9999,
          }}
        />
      </div>
    </div>
  );
};

export const MotionBlur: React.FC<MotionBlurProps> = ({
  cardTitle = "HYPER-VELOCITY RENDER NODE",
  metricValue = "4,820 px/s",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentX = getPositionX(frame);
  const prevX = getPositionX(frame - 0.5);
  const deltaX = currentX - prevX;
  const rawVelocity = Math.abs(deltaX);

  // Enforce exact zero when effectively stopped so blurAmount is strictly 0px at rest
  const velocity = rawVelocity < 0.05 ? 0 : rawVelocity;
  const blurAmount = velocity === 0 ? 0 : Math.min(28, velocity * 0.42);

  // Sub-frame trailing ghost silhouettes over the 180-deg shutter exposure window
  const ghostOffsets = [0.85, 0.68, 0.5, 0.34, 0.18];

  const hudSpring = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0f172a 0%, #050814 60%, #020308 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Directional Horizontal SVG Blur Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="velocity-dir-blur" x="-30%" y="-10%" width="160%" height="120%">
            <feGaussianBlur stdDeviation={`${blurAmount.toFixed(2)} 0`} />
          </filter>
        </defs>
      </svg>

      {/* Subtle Horizontal Velocity Track */}
      <div
        style={{
          position: "absolute",
          width: 1520,
          height: 2,
          background:
            "linear-gradient(90deg, rgba(56,189,248,0) 0%, rgba(56,189,248,0.35) 50%, rgba(56,189,248,0) 100%)",
        }}
      />

      {/* Header Overlay */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          opacity: hudSpring,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(244, 114, 182, 0.14)",
            border: "1px solid rgba(244, 114, 182, 0.4)",
            color: "#f9a8d4",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 14,
          }}
        >
          CATEGORY J // PRACTICE 52
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 50,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          Velocity-Aware Motion Blur
        </h1>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 6 }}>
          Directional Shutter Sampling • Multi-Frame Ghost Trails & Zero-Blur Snap
        </div>
      </div>

      {/* Motion Stage */}
      <div
        style={{
          position: "relative",
          width: 580,
          height: 310,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Multi-Sample Trailing Ghost Silhouettes (only rendered when moving) */}
        {velocity > 0 &&
          ghostOffsets.map((subOffset, idx) => {
            const ghostX = getPositionX(frame - subOffset);
            const ghostOpacity = (1 - subOffset) * 0.24;
            const ghostBlur = Math.min(18, blurAmount * 0.65);

            return (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  transform: `translate3d(${ghostX}px, 0, 0)`,
                  opacity: ghostOpacity,
                  filter: `blur(${ghostBlur.toFixed(2)}px)`,
                  pointerEvents: "none",
                }}
              >
                <MotionCardBody
                  cardTitle={cardTitle}
                  metricValue={metricValue}
                  velocity={velocity}
                />
              </div>
            );
          })}

        {/* Primary Moving Card with Directional Horizontal Blur (strictly none when velocity === 0) */}
        <div
          style={{
            position: "relative",
            transform: `translate3d(${currentX}px, 0, 0)`,
            filter: blurAmount > 0 ? "url(#velocity-dir-blur)" : "none",
          }}
        >
          <MotionCardBody
            cardTitle={cardTitle}
            metricValue={metricValue}
            velocity={velocity}
          />
        </div>
      </div>

      {/* Bottom Shutter Telemetry Readout */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 28px",
          borderRadius: 18,
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          backdropFilter: "blur(14px)",
          color: "#cbd5e1",
          fontSize: 20,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          opacity: hudSpring,
        }}
      >
        <span>
          POS X:{" "}
          <strong style={{ color: "#ffffff" }}>{currentX.toFixed(1)}px</strong>
        </span>
        <span>
          |Δx| (0.5f):{" "}
          <strong style={{ color: "#38bdf8" }}>{velocity.toFixed(2)}px</strong>
        </span>
        <span>
          DIRECTIONAL BLUR:{" "}
          <strong style={{ color: blurAmount === 0 ? "#34d399" : "#f472b6" }}>
            {blurAmount.toFixed(1)}px
          </strong>
        </span>
      </div>
    </AbsoluteFill>
  );
};
