import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import type { ExtrudedBarItem, ExtrudedBarsProps } from "./types";

const DEFAULT_BARS: ExtrudedBarItem[] = [
  { label: "Q1", valueText: "$1.2M", targetHeight: 1.8, color: "#38bdf8" },
  { label: "Q2", valueText: "$2.4M", targetHeight: 2.9, color: "#818cf8" },
  { label: "Q3", valueText: "$3.7M", targetHeight: 4.1, color: "#c084fc" },
  { label: "Q4", valueText: "$5.2M", targetHeight: 5.4, color: "#34d399" },
];

function createBeveledCapGeometry(size: number, thickness: number, bevel: number): THREE.ExtrudeGeometry {
  const s = size / 2 - bevel;
  const r = 0.08;
  const shape = new THREE.Shape();
  shape.moveTo(-s + r, -s);
  shape.lineTo(s - r, -s);
  shape.quadraticCurveTo(s, -s, s, -s + r);
  shape.lineTo(s, s - r);
  shape.quadraticCurveTo(s, s, s - r, s);
  shape.lineTo(-s + r, s);
  shape.quadraticCurveTo(-s, s, -s, s - r);
  shape.lineTo(-s, -s + r);
  shape.quadraticCurveTo(-s, -s, -s + r, -s);

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: bevel,
    bevelThickness: bevel,
  });
  // Rotate from XY extrusion to vertical +Y extrusion with base at y=0
  geom.rotateX(-Math.PI / 2);
  geom.translate(0, bevel, 0);
  return geom;
}

const IsometricCamera: React.FC = () => {
  const frame = useCurrentFrame();
  const { camera } = useThree();

  const orbitOffset = interpolate(frame, [0, 120], [-0.45, 0.45]);

  useLayoutEffect(() => {
    camera.position.set(7.4 + orbitOffset, 6.2, 8.6);
    camera.lookAt(0, 2.0, 0);
    camera.updateMatrixWorld();
  }, [camera, orbitOffset]);

  return null;
};

const ExtrudedBarMesh: React.FC<{
  item: ExtrudedBarItem;
  index: number;
  xPos: number;
  capGeometry: THREE.ExtrudeGeometry;
}> = ({ item, index, xPos, capGeometry }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heightProgress = spring({
    frame: frame - index * 8,
    fps,
    config: { damping: 14, mass: 0.7, overshootClamping: true },
  });

  const currentHeight = item.targetHeight * heightProgress;
  const capThickness = 0.18;
  const shaftHeight = Math.max(0, currentHeight - capThickness);
  const capScaleY = currentHeight < capThickness ? currentHeight / capThickness : 1;

  if (currentHeight <= 0.004) {
    return null;
  }

  return (
    <group position={[xPos, 0, 0]}>
      {/* Main vertical pillar shaft: base strictly pinned at Y = 0 */}
      {shaftHeight > 0.002 && (
        <mesh
          position={[0, shaftHeight / 2, 0]}
          scale={[1, shaftHeight, 1]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.18, 1, 1.18]} />
          <meshStandardMaterial
            color={item.color}
            metalness={0.45}
            roughness={0.28}
          />
        </mesh>
      )}

      {/* Beveled top crown cap riding cleanly on top of the shaft */}
      <mesh
        position={[0, shaftHeight, 0]}
        scale={[1, Math.max(0.01, capScaleY), 1]}
        geometry={capGeometry}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0.22}
          metalness={0.6}
          roughness={0.18}
        />
      </mesh>

      {/* Base floor collar pinned at Y = 0.01 */}
      <mesh position={[0, 0.015, 0]} receiveShadow>
        <boxGeometry args={[1.38, 0.03, 1.38]} />
        <meshStandardMaterial
          color={item.color}
          emissive={item.color}
          emissiveIntensity={0.45}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};

const BarsScene: React.FC<{ bars: ExtrudedBarItem[] }> = ({ bars }) => {
  const capGeometry = useMemo(() => createBeveledCapGeometry(1.18, 0.08, 0.05), []);

  useEffect(() => {
    return () => {
      capGeometry.dispose();
    };
  }, [capGeometry]);

  const spacing = 2.05;
  const totalWidth = (bars.length - 1) * spacing;

  return (
    <>
      <color attach="background" args={["#050814"]} />
      <IsometricCamera />

      {/* Studio Lighting with Shadow Casting */}
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[6, 12, 7]}
        intensity={2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-6, 4, -5]} intensity={18} color="#38bdf8" />

      {/* Dark Shadow-Receiving Floor Plane at Y = 0 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 32]} />
        <meshStandardMaterial color="#090e1c" roughness={0.85} metalness={0.15} />
      </mesh>

      {/* Dark Floor Grid */}
      <gridHelper args={[26, 26, "#334155", "#172033"]} position={[0, 0.003, 0]} />

      {/* Four Beveled 3D Pillars */}
      {bars.map((item, idx) => {
        const xPos = idx * spacing - totalWidth / 2;
        return (
          <ExtrudedBarMesh
            key={item.label}
            item={item}
            index={idx}
            xPos={xPos}
            capGeometry={capGeometry}
          />
        );
      })}
    </>
  );
};

export const ExtrudedBars: React.FC<ExtrudedBarsProps> = ({
  title = "3D Revenue Elevation",
  subtitle = "Spring-Damped Beveled Pillars • Y=0 Floor Pinning & Drop Shadows",
  bars = DEFAULT_BARS,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const headerEntrance = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050814", overflow: "hidden" }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows={{ type: THREE.PCFShadowMap }}
        camera={{ fov: 36, position: [7.4, 6.2, 8.6], near: 0.1, far: 100 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <BarsScene bars={bars} />
      </ThreeCanvas>

      {/* Header Overlay */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          opacity: headerEntrance,
          transform: `translateY(${interpolate(headerEntrance, [0, 1], [16, 0])}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(52, 211, 153, 0.14)",
            border: "1px solid rgba(52, 211, 153, 0.35)",
            color: "#6ee7b7",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          CATEGORY G // PRACTICE 40
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 54,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </h1>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 6 }}>
          {subtitle}
        </div>
      </div>

      {/* Bottom Legend Cards synced with Pillar Springs */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 80,
          right: 80,
          display: "flex",
          justifyContent: "center",
          gap: 28,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          pointerEvents: "none",
        }}
      >
        {bars.map((bar, idx) => {
          const cardProgress = spring({
            frame: frame - idx * 8,
            fps,
            config: { damping: 14, mass: 0.7, overshootClamping: true },
          });
          return (
            <div
              key={bar.label}
              style={{
                minWidth: 220,
                padding: "18px 26px",
                borderRadius: 20,
                backgroundColor: "rgba(15, 23, 42, 0.76)",
                border: `1px solid ${bar.color}55`,
                backdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 20,
                opacity: cardProgress,
                transform: `translateY(${interpolate(cardProgress, [0, 1], [18, 0])}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 4,
                    backgroundColor: bar.color,
                    boxShadow: `0 0 12px ${bar.color}`,
                  }}
                />
                <span style={{ fontSize: 24, fontWeight: 800, color: "#e2e8f0" }}>
                  {bar.label}
                </span>
              </div>
              <span style={{ fontSize: 28, fontWeight: 900, color: bar.color }}>
                {bar.valueText}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
