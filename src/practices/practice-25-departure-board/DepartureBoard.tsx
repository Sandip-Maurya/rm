import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  Easing,
} from "remotion";
import { DepartureBoardProps } from "./types";

export const DepartureBoard: React.FC<DepartureBoardProps> = ({
  fromText = "DEPARTED",
  toText = "BOARDING",
  sublabel = "GATE 42B • FLIGHT RM-2026 • DIRECT TO SAN FRANCISCO",
}) => {
  const frame = useCurrentFrame();

  const maxLen = Math.max(fromText.length, toText.length);
  const fromChars = fromText.padEnd(maxLen, " ").split("");
  const toChars = toText.padEnd(maxLen, " ").split("");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#07090e",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, monospace',
      }}
    >
      {/* Airport Sign Housing Frame */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#11141c",
          padding: "50px 70px",
          borderRadius: 32,
          border: "4px solid #1e2433",
          boxShadow:
            "0 40px 100px -20px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.1), 0 0 40px rgba(245, 158, 11, 0.08)",
        }}
      >
        {/* Terminal Header Bar */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 32,
            borderBottom: "2px solid #1e2433",
            marginBottom: 44,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                backgroundColor: "#f59e0b",
                boxShadow: "0 0 16px #f59e0b",
              }}
            />
            <span
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#f59e0b",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              TERMINAL 3 // FLIGHT STATUS
            </span>
          </div>

          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#64748b",
              letterSpacing: "0.08em",
            }}
          >
            LOCAL TIME 14:30 GMT
          </span>
        </div>

        {/* The Flap Tiles Row */}
        <div style={{ display: "flex", gap: 18 }}>
          {fromChars.map((fromChar, i) => {
            const toChar = toChars[i];

            // Stagger per column flap: 4 frames delay per column
            const colDelay = 20 + i * 5;
            const flapFrame = Math.max(0, frame - colDelay);

            // Flip progress: 0 to 180 degrees over 16 frames
            const flipDeg = interpolate(flapFrame, [0, 16], [0, 180], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.4, 0.0, 0.2, 1.0),
            });

            const isPastHalfway = flipDeg >= 90;

            return (
              <div
                key={i}
                style={{
                  width: 110,
                  height: 160,
                  perspective: 800,
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#0d0f17",
                  borderRadius: 16,
                  boxShadow: "0 10px 25px rgba(0,0,0,0.8)",
                }}
              >
                {/* TOP HALF (STATIC UNDERNEATH) - Shows new character */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "50%",
                    backgroundColor: "#161922",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    borderBottom: "1px solid rgba(0,0,0,0.8)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 104,
                      fontWeight: 900,
                      color: "#f8fafc",
                      transform: "translateY(50%)",
                      lineHeight: 1,
                    }}
                  >
                    {toChar}
                  </span>
                </div>

                {/* BOTTOM HALF (STATIC UNDERNEATH) - Shows new character once flipped */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "50%",
                    backgroundColor: "#13161f",
                    borderBottomLeftRadius: 16,
                    borderBottomRightRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 104,
                      fontWeight: 900,
                      color: "#f8fafc",
                      transform: "translateY(-50%)",
                      lineHeight: 1,
                    }}
                  >
                    {isPastHalfway ? toChar : fromChar}
                  </span>
                </div>

                {/* FLIPPING LEAF (Rotating 0 -> 180deg) */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "50%",
                    transformOrigin: "bottom center",
                    transformStyle: "preserve-3d",
                    transform: `rotateX(-${flipDeg}deg)`,
                    zIndex: 20,
                  }}
                >
                  {/* Front of flipping leaf (Old character top half) */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#181b26",
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-end",
                      backfaceVisibility: "hidden",
                      borderBottom: "1px solid rgba(0,0,0,0.8)",
                      boxShadow:
                        flipDeg > 5 && flipDeg < 175
                          ? "0 10px 20px rgba(0,0,0,0.6)"
                          : "none",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 104,
                        fontWeight: 900,
                        color: "#f8fafc",
                        transform: "translateY(50%)",
                        lineHeight: 1,
                      }}
                    >
                      {fromChar}
                    </span>
                  </div>

                  {/* Back of flipping leaf (New character bottom half, upside down in 3D space) */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#141720",
                      borderBottomLeftRadius: 16,
                      borderBottomRightRadius: 16,
                      overflow: "hidden",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                      backfaceVisibility: "hidden",
                      transform: "rotateX(180deg)",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 104,
                        fontWeight: 900,
                        color: "#f8fafc",
                        transform: "translateY(-50%)",
                        lineHeight: 1,
                      }}
                    >
                      {toChar}
                    </span>
                  </div>
                </div>

                {/* Realistic physical center hinge shadow divider */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: "100%",
                    height: 2,
                    backgroundColor: "#05070a",
                    zIndex: 30,
                    boxShadow: "0 1px 3px rgba(0,0,0,0.9)",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Airport Flight Sublabel */}
        <div
          style={{
            marginTop: 40,
            fontSize: 22,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {sublabel}
        </div>
      </div>
    </AbsoluteFill>
  );
};
