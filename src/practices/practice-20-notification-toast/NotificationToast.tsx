import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { NotificationToastProps } from "./types";

export const NotificationToast: React.FC<NotificationToastProps> = ({
  appName = "Apple Pay",
  sender = "Stripe Payouts",
  message = "Funds transferred to High-Yield Checking",
  amount = "+$4,850.00",
  timeAgo = "now",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring (from frame 10 downwards from the notch)
  const entranceProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 13, mass: 0.6, stiffness: 120 },
  });

  // Dynamic Island morphing:
  // Starts compact (width ~240, height ~64, borderRadius ~32)
  // Expands into full notification banner (width ~920, height ~240, borderRadius ~48)
  const width = interpolate(entranceProgress, [0, 1], [260, 920]);
  const height = interpolate(entranceProgress, [0, 1], [68, 220]);
  const borderRadius = interpolate(entranceProgress, [0, 1], [34, 46]);
  const initialY = interpolate(entranceProgress, [0, 1], [24, 88]);

  // Content fade-in inside the expanded pill
  const contentOpacity = interpolate(frame, [20, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit upward gliding back into notch between frame 85 and 108
  const exitProgress = interpolate(frame, [85, 108], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 0.0, 0.2, 1.0),
  });

  const exitY = interpolate(exitProgress, [0, 1], [0, -320]);
  const exitScale = interpolate(exitProgress, [0, 1], [1, 0.85]);
  const exitOpacity = interpolate(exitProgress, [0, 0.85, 1], [1, 0.8, 0]);

  const currentY = initialY + exitY;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Subtle iPhone wallpaper glow behind dynamic island */}
      <div
        style={{
          position: "absolute",
          top: -200,
          left: "50%",
          transform: "translateX(-50%)",
          width: 800,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.1) 40%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Screen mock time & status bar (Safe Zone ~40px from top) */}
      <div
        style={{
          width: "100%",
          padding: "36px 72px 0 72px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#ffffff",
          zIndex: 10,
        }}
      >
        <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em" }}>
          9:41
        </span>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {/* Signal */}
          <svg width="28" height="24" viewBox="0 0 24 24" fill="#ffffff">
            <rect x="2" y="16" width="3.5" height="6" rx="1" />
            <rect x="8" y="12" width="3.5" height="10" rx="1" />
            <rect x="14" y="7" width="3.5" height="15" rx="1" />
            <rect x="20" y="2" width="3.5" height="20" rx="1" />
          </svg>
          {/* Wifi */}
          <svg
            width="28"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M5 12.55a11 11 0 0 1 14.08 0" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <circle cx="12" cy="20" r="1.2" fill="#ffffff" />
          </svg>
          {/* Battery */}
          <div
            style={{
              width: 38,
              height: 18,
              border: "2.5px solid #ffffff",
              borderRadius: 6,
              padding: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "90%",
                height: "100%",
                backgroundColor: "#22c55e",
                borderRadius: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Island Container */}
      <div
        style={{
          position: "absolute",
          top: currentY,
          width,
          height,
          borderRadius,
          backgroundColor: "#111216",
          border: "1px solid rgba(255, 255, 255, 0.16)",
          boxShadow:
            "0 30px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(255, 255, 255, 0.08)",
          transform: `scale(${exitScale})`,
          opacity: exitOpacity,
          zIndex: 50,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "24px 36px",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {/* Expanded Content View */}
        {entranceProgress > 0.4 && (
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: contentOpacity,
            }}
          >
            {/* Left: App Icon & Details */}
            <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
              {/* App Icon */}
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 22,
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(16, 185, 129, 0.45)",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>

              {/* Text Info */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {appName}
                  </span>
                  <span style={{ color: "#475569", fontSize: 18 }}>•</span>
                  <span style={{ fontSize: 20, color: "#64748b" }}>
                    {timeAgo}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    color: "#ffffff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {sender}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    color: "#94a3b8",
                    maxWidth: 420,
                    lineHeight: 1.25,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {message}
                </div>
              </div>
            </div>

            {/* Right: Transfer Amount */}
            <div
              style={{
                textAlign: "right",
                paddingLeft: 16,
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: "#34d399",
                  letterSpacing: "-0.02em",
                }}
              >
                {amount}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#6ee7b7",
                  marginTop: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Completed
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative lockscreen center placeholder widget */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          color: "#334155",
        }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#334155"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <div style={{ fontSize: 26, fontWeight: 600, color: "#475569" }}>
          Face ID Verified
        </div>
      </div>
    </AbsoluteFill>
  );
};
