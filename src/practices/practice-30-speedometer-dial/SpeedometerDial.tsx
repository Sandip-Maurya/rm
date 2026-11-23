import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SpeedometerDialProps } from "./types";

export const SpeedometerDial: React.FC<SpeedometerDialProps> = ({
  label = "SYSTEM THROUGHPUT VELOCITY",
  metricUnit = "GB / SEC",
  targetScore = 94,
  substatus = "OPTIMAL CLUSTER BANDWIDTH • INERTIAL SPRING DAMPING",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for overall meter housing
  const meterEntrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
  });

  // Inertial Needle Spring:
  // Starts at frame 12, rockets from -120deg (0 score) to +105deg (score 94) with realistic recoil
  const needleSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 9, mass: 0.65, stiffness: 85 }, // Noticeable inertial overshoot!
  });

  const needleAngle = interpolate(needleSpring, [0, 1], [-120, 105]);

  // Synchronized digital counter: ticks from 0 to targetScore
  const liveScore = Math.min(
    targetScore,
    Math.round(interpolate(needleSpring, [0, 1], [0, targetScore]))
  );

  // Dial Geometry
  const cx = 350;
  const cy = 350;
  const radius = 230;

  // Generate 25 radial tick marks spanning -120deg to +120deg (240 deg arc)
  const totalTicks = 25;
  const ticks = Array.from({ length: totalTicks }).map((_, i) => {
    const angleDeg = -120 + (i / (totalTicks - 1)) * 240;
    const angleRad = (angleDeg * Math.PI) / 180;
    const isMajor = i % 4 === 0;
    const tickLen = isMajor ? 24 : 14;

    const r1 = radius;
    const r2 = radius - tickLen;

    const x1 = cx + r1 * Math.cos(angleRad);
    const y1 = cy + r1 * Math.sin(angleRad);
    const x2 = cx + r2 * Math.cos(angleRad);
    const y2 = cy + r2 * Math.sin(angleRad);

    const isLit = needleAngle >= angleDeg;

    return { x1, y1, x2, y2, isMajor, isLit, angleDeg };
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#060913",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Background ambient radial glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(0,0,0,0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Gauge Dial Card (Square 1:1) */}
      <div
        style={{
          width: 780,
          height: 780,
          borderRadius: "50%",
          backgroundColor: "#0d111a",
          border: "4px solid rgba(255, 255, 255, 0.1)",
          boxShadow:
            "0 40px 100px -20px rgba(0,0,0,0.95), inset 0 0 60px rgba(0,0,0,0.8), 0 0 50px rgba(56, 189, 248, 0.12)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${meterEntrance})`,
          opacity: meterEntrance,
        }}
      >
        <svg
          width="700"
          height="700"
          viewBox="0 0 700 700"
          style={{ position: "absolute", top: 40, left: 40, overflow: "visible" }}
        >
          {/* Background Arc Path */}
          <path
            d="M 150 480 A 230 230 0 1 1 550 480"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Radial Ticks */}
          {ticks.map((t, i) => (
            <line
              key={i}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke={
                t.isLit
                  ? t.angleDeg > 60
                    ? "#f43f5e"
                    : t.angleDeg > 0
                    ? "#38bdf8"
                    : "#34d399"
                  : "rgba(255,255,255,0.18)"
              }
              strokeWidth={t.isMajor ? 4.5 : 2.5}
              strokeLinecap="round"
              filter={
                t.isLit
                  ? `drop-shadow(0 0 6px ${
                      t.angleDeg > 60 ? "#f43f5e" : "#38bdf8"
                    })`
                  : "none"
              }
            />
          ))}

          {/* Inertial Speedometer Needle */}
          <g
            style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${needleAngle}deg)`,
              transition: "transform 0.05s ease-out",
            }}
          >
            {/* Needle Body */}
            <polygon
              points={`${cx - 5},${cy} ${cx},${cy - 220} ${cx + 5},${cy}`}
              fill="url(#needleGrad)"
              filter="drop-shadow(0 0 12px rgba(244, 63, 94, 0.7))"
            />
            {/* Center Pivot Hub Pin */}
            <circle
              cx={cx}
              cy={cy}
              r="22"
              fill="#1e293b"
              stroke="#f43f5e"
              strokeWidth="4"
              filter="drop-shadow(0 0 14px rgba(244, 63, 94, 0.6))"
            />
            <circle cx={cx} cy={cy} r="8" fill="#ffffff" />
          </g>

          <defs>
            <linearGradient id="needleGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>

        {/* Digital Telemetry Readout (In Lower Center Arc) */}
        <div
          style={{
            position: "absolute",
            bottom: 110,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: "#38bdf8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {label}
          </div>

          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.04em",
              lineHeight: 1,
              textShadow: "0 4px 25px rgba(0,0,0,0.8)",
            }}
          >
            {liveScore}
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#94a3b8",
              letterSpacing: "0.06em",
              marginTop: 6,
            }}
          >
            {metricUnit}
          </div>
        </div>
      </div>

      {/* Dial Substatus Info */}
      <div
        style={{
          marginTop: 36,
          fontSize: 20,
          fontWeight: 700,
          color: "#64748b",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          transform: `scale(${meterEntrance})`,
          opacity: meterEntrance,
        }}
      >
        {substatus}
      </div>
    </AbsoluteFill>
  );
};
