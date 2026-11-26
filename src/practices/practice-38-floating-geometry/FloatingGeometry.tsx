import React from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { FloatingGeometryProps } from "./types";

interface ShapeConfig {
  id: string;
  kind: "icosahedron" | "torus" | "sphere" | "torusKnot" | "octahedron";
  basePos: [number, number, number];
  orbitRadius: [number, number];
  color: string;
  attenuationColor: string;
  scaleFactor: number;
}

const SHAPES: ShapeConfig[] = [
  {
    id: "ico",
    kind: "icosahedron",
    basePos: [-3.9, 1.35, -0.4],
    orbitRadius: [0.35, 0.9],
    color: "#38bdf8",
    attenuationColor: "#0ea5e9",
    scaleFactor: 1.05,
  },
  {
    id: "torus",
    kind: "torus",
    basePos: [3.6, 1.4, 0.7],
    orbitRadius: [0.45, 0.85],
    color: "#c084fc",
    attenuationColor: "#9333ea",
    scaleFactor: 1.0,
  },
  {
    id: "knot",
    kind: "torusKnot",
    basePos: [0.1, -0.2, 1.4],
    orbitRadius: [0.55, 1.1],
    color: "#f472b6",
    attenuationColor: "#db2777",
    scaleFactor: 0.95,
  },
  {
    id: "sphere",
    kind: "sphere",
    basePos: [-2.1, -1.5, 0.9],
    orbitRadius: [0.4, 0.7],
    color: "#34d399",
    attenuationColor: "#10b981",
    scaleFactor: 0.92,
  },
  {
    id: "octa",
    kind: "octahedron",
    basePos: [2.4, -1.35, -0.7],
    orbitRadius: [0.42, 0.95],
    color: "#818cf8",
    attenuationColor: "#4f46e5",
    scaleFactor: 1.1,
  },
];

const FloatingShapeMesh: React.FC<{
  config: ShapeConfig;
  index: number;
}> = ({ config, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - index * 6,
    fps,
    config: { damping: 12, mass: 0.5 },
  });

  const floatY = Math.sin(frame * 0.05 + index * 1.2) * 0.4;
  const driftX = Math.cos(frame * 0.032 + index * 1.7) * config.orbitRadius[0];
  const driftZ = Math.sin(frame * 0.038 + index * 1.4) * config.orbitRadius[1];

  const rotX = frame * 0.02 + index;
  const rotY = frame * 0.026 + index * 0.8;
  const rotZ = frame * 0.016 + index * 0.5;

  const currentScale = Math.max(0.0001, entrance * config.scaleFactor);

  return (
    <mesh
      position={[
        config.basePos[0] + driftX,
        config.basePos[1] + floatY,
        config.basePos[2] + driftZ,
      ]}
      rotation={[rotX, rotY, rotZ]}
      scale={[currentScale, currentScale, currentScale]}
    >
      {config.kind === "icosahedron" && <icosahedronGeometry args={[1.05, 0]} />}
      {config.kind === "torus" && <torusGeometry args={[0.88, 0.3, 28, 64]} />}
      {config.kind === "sphere" && <sphereGeometry args={[0.92, 48, 48]} />}
      {config.kind === "torusKnot" && <torusKnotGeometry args={[0.75, 0.24, 128, 32]} />}
      {config.kind === "octahedron" && <octahedronGeometry args={[1.08, 0]} />}

      <meshPhysicalMaterial
        color={config.color}
        metalness={0.55}
        roughness={0.12}
        clearcoat={1}
        clearcoatRoughness={0.06}
        iridescence={1}
        iridescenceIOR={1.42}
        iridescenceThicknessMinimum={180}
        iridescenceThicknessMaximum={620}
        reflectivity={1}
        attenuationColor={config.attenuationColor}
        attenuationDistance={1.5}
      />
    </mesh>
  );
};

const ClusterScene: React.FC = () => {
  const frame = useCurrentFrame();
  const orbitLightX = Math.sin(frame * 0.04) * 7;
  const orbitLightZ = Math.cos(frame * 0.04) * 7;

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[6, 8, 8]} intensity={2.2} color="#ffffff" />
      <pointLight position={[orbitLightX, 3, orbitLightZ]} intensity={36} color="#38bdf8" />
      <pointLight position={[-orbitLightX, -3, 5]} intensity={32} color="#ec4899" />
      <pointLight position={[0, 5, -6]} intensity={28} color="#a855f7" />

      {SHAPES.map((shape, index) => (
        <FloatingShapeMesh key={shape.id} config={shape} index={index} />
      ))}
    </>
  );
};

export const FloatingGeometry: React.FC<FloatingGeometryProps> = ({
  headline = "IRIDESCENT",
  subheadline = "SPRING HARMONICS",
  badgeText = "CATEGORY G // PRACTICE 38",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const textEntrance = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.7 },
  });

  const bgScale = interpolate(textEntrance, [0, 1], [0.92, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 50%, #0d1326 0%, #050711 60%, #020308 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Background Typography Layer (behind the 3D WebGL cluster) */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          opacity: textEntrance,
          transform: `scale(${bgScale})`,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            fontSize: 210,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            color: "rgba(203, 213, 225, 0.2)",
            WebkitTextStroke: "2px rgba(255, 255, 255, 0.18)",
            textAlign: "center",
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: 112,
            fontWeight: 900,
            letterSpacing: "0.08em",
            lineHeight: 1.05,
            color: "rgba(56, 189, 248, 0.24)",
            marginTop: 18,
            textAlign: "center",
          }}
        >
          {subheadline}
        </div>
      </AbsoluteFill>

      {/* Transparent 3D WebGL Layer floating in front of typography */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 42, position: [0, 0, 11], near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
      >
        <ClusterScene />
      </ThreeCanvas>

      {/* Subtle Corner Badge */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 72,
          zIndex: 3,
          padding: "8px 20px",
          borderRadius: 9999,
          backgroundColor: "rgba(168, 85, 247, 0.16)",
          border: "1px solid rgba(192, 132, 252, 0.35)",
          color: "#d8b4fe",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: "0.08em",
          opacity: textEntrance,
        }}
      >
        {badgeText}
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 52,
          right: 72,
          zIndex: 3,
          color: "#94a3b8",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "0.04em",
          opacity: textEntrance,
        }}
      >
        5 Iridescent Meshes • Staggered Springs & Z-Depth Occlusion
      </div>
    </AbsoluteFill>
  );
};
