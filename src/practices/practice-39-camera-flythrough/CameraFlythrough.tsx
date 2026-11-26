import React, { useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import type { CameraFlythroughProps } from "./types";

function getTunnelCenter(z: number): [number, number] {
  const x = Math.sin(z * 0.035) * 2.6;
  const y = Math.cos(z * 0.028) * 1.4;
  return [x, y];
}

const NEON_PALETTE = ["#22d3ee", "#818cf8", "#f472b6", "#38bdf8"] as const;

const TunnelCameraRig: React.FC<{ cameraZ: number; cameraRoll: number }> = ({
  cameraZ,
  cameraRoll,
}) => {
  const { camera } = useThree();

  useLayoutEffect(() => {
    const [cx, cy] = getTunnelCenter(cameraZ);
    const [tx, ty] = getTunnelCenter(cameraZ - 14);

    camera.position.set(cx, cy, cameraZ);
    camera.lookAt(tx, ty, cameraZ - 14);
    camera.rotateZ(cameraRoll);
    camera.updateMatrixWorld();
  }, [camera, cameraZ, cameraRoll]);

  return null;
};

const NeonSquareGate: React.FC<{
  z: number;
  index: number;
  cameraZ: number;
}> = ({ z, index, cameraZ }) => {
  const [x, y] = getTunnelCenter(z);
  const color = NEON_PALETTE[index % NEON_PALETTE.length] ?? "#22d3ee";

  // Distance ahead of the camera (camera looks down -Z)
  const distAhead = cameraZ - z;

  // Smoothly fade nearest rings to 0 opacity before reaching camera.near (0.1)
  const nearFade = interpolate(distAhead, [1.4, 7.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Far atmospheric fade so distant gates emerge cleanly from darkness
  const farFade = interpolate(distAhead, [75, 130], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = nearFade * farFade;
  if (opacity <= 0.005) {
    return null;
  }

  const gateSize = 7.4;
  const half = gateSize / 2;
  const thickness = 0.14;
  const depth = 0.22;
  const gateTilt = Math.sin(z * 0.035) * 0.18;

  return (
    <group position={[x, y, z]} rotation={[0, 0, gateTilt]}>
      {/* Top Bar */}
      <mesh position={[0, half, 0]}>
        <boxGeometry args={[gateSize + thickness, thickness, depth]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Bottom Bar */}
      <mesh position={[0, -half, 0]}>
        <boxGeometry args={[gateSize + thickness, thickness, depth]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Left Bar */}
      <mesh position={[-half, 0, 0]}>
        <boxGeometry args={[thickness, gateSize, depth]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Right Bar */}
      <mesh position={[half, 0, 0]}>
        <boxGeometry args={[thickness, gateSize, depth]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>

      {/* Outer subtle glow halo frame */}
      <mesh position={[0, half + 0.16, 0]}>
        <boxGeometry args={[gateSize * 0.72, 0.05, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.45} />
      </mesh>
      <mesh position={[0, -half - 0.16, 0]}>
        <boxGeometry args={[gateSize * 0.72, 0.05, 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.45} />
      </mesh>

      {/* Corner Accent Nodes */}
      {([
        [-half, half],
        [half, half],
        [-half, -half],
        [half, -half],
      ] as const).map(([cx, cy], cornerIdx) => (
        <mesh key={cornerIdx} position={[cx, cy, 0]}>
          <boxGeometry args={[0.32, 0.32, 0.32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.9} />
        </mesh>
      ))}
    </group>
  );
};

const TunnelParticles: React.FC<{ cameraZ: number }> = ({ cameraZ }) => {
  const streaks = useMemo(() => {
    const items: Array<{ angle: number; radius: number; z: number; len: number; color: string }> = [];
    for (let i = 0; i < 90; i++) {
      const s1 = Math.sin(i * 12.9898) * 43758.5453;
      const r1 = s1 - Math.floor(s1);
      const s2 = Math.sin(i * 78.233 + 1.5) * 43758.5453;
      const r2 = s2 - Math.floor(s2);
      items.push({
        angle: r1 * Math.PI * 2,
        radius: 4.5 + r2 * 3.5,
        z: 35 - i * 2.4,
        len: 1.8 + r1 * 2.5,
        color: NEON_PALETTE[i % NEON_PALETTE.length] ?? "#22d3ee",
      });
    }
    return items;
  }, []);

  return (
    <>
      {streaks.map((s, idx) => {
        const distAhead = cameraZ - s.z;
        const opacity =
          interpolate(distAhead, [1.5, 6], [0, 0.75], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }) *
          interpolate(distAhead, [65, 115], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        if (opacity <= 0.01) return null;
        const [cx, cy] = getTunnelCenter(s.z);
        return (
          <mesh
            key={idx}
            position={[
              cx + Math.cos(s.angle) * s.radius,
              cy + Math.sin(s.angle) * s.radius,
              s.z,
            ]}
          >
            <boxGeometry args={[0.06, 0.06, s.len]} />
            <meshBasicMaterial color={s.color} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </>
  );
};

const FlythroughScene: React.FC<{ ringCount: number }> = ({ ringCount }) => {
  const frame = useCurrentFrame();

  const cameraZ = interpolate(frame, [0, 150], [50, -150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cameraRoll = Math.sin(frame * 0.04) * 0.1;

  const ringPositions = useMemo(() => {
    return Array.from({ length: ringCount }, (_, i) => 38 - i * 6.5);
  }, [ringCount]);

  return (
    <>
      <color attach="background" args={["#02040d"]} />
      <fog attach="fog" args={["#02040d", 35, 130]} />
      <ambientLight intensity={0.4} />
      <TunnelCameraRig cameraZ={cameraZ} cameraRoll={cameraRoll} />
      <TunnelParticles cameraZ={cameraZ} />
      {ringPositions.map((z, idx) => (
        <NeonSquareGate key={idx} z={z} index={idx} cameraZ={cameraZ} />
      ))}
    </>
  );
};

export const CameraFlythrough: React.FC<CameraFlythroughProps> = ({
  hudTitle = "CYBER SPLINE TUNNEL",
  ringCount = 38,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const cameraZ = interpolate(frame, [0, 150], [50, -150], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraRollDeg = (Math.sin(frame * 0.04) * 0.1 * 180) / Math.PI;

  return (
    <AbsoluteFill style={{ backgroundColor: "#02040d", overflow: "hidden" }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 62, position: [0, 0, 50], near: 0.1, far: 180 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <FlythroughScene ringCount={ringCount} />
      </ThreeCanvas>

      {/* Subtle Cyber Telemetry HUD */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            padding: "10px 22px",
            borderRadius: 12,
            backgroundColor: "rgba(2, 6, 23, 0.65)",
            border: "1px solid rgba(34, 211, 238, 0.4)",
            color: "#67e8f9",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          {hudTitle} // PRACTICE 39
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            padding: "10px 24px",
            borderRadius: 12,
            backgroundColor: "rgba(2, 6, 23, 0.65)",
            border: "1px solid rgba(129, 140, 248, 0.35)",
            color: "#e2e8f0",
            fontSize: 20,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>
            Z: <strong style={{ color: "#22d3ee" }}>{cameraZ.toFixed(1)}</strong>
          </span>
          <span>
            BANK:{" "}
            <strong style={{ color: "#f472b6" }}>
              {cameraRollDeg.toFixed(1)}°
            </strong>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
