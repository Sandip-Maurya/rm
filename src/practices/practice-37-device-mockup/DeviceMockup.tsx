import React, { useEffect, useLayoutEffect, useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import * as THREE from "three";
import type { DeviceMockupProps } from "./types";

function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

function drawPhoneScreenTexture(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frame: number,
  accentColor: string,
  brandTitle: string
) {
  ctx.clearRect(0, 0, w, h);

  // Deep gradient screen background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, "#050914");
  bg.addColorStop(0.5, "#0b1428");
  bg.addColorStop(1, "#09071a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Ambient screen glow
  const glow = ctx.createRadialGradient(w * 0.5, h * 0.35, 10, w * 0.5, h * 0.35, w * 0.75);
  glow.addColorStop(0, "rgba(56, 189, 248, 0.28)");
  glow.addColorStop(0.55, "rgba(168, 85, 247, 0.14)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Status bar
  ctx.fillStyle = "#94a3b8";
  ctx.font = "600 22px system-ui, -apple-system, sans-serif";
  ctx.fillText("9:41", 38, 52);
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(w - 92, 36, 44, 18);

  // Dynamic Island pill
  ctx.fillStyle = "#020617";
  ctx.beginPath();
  ctx.roundRect(w / 2 - 74, 24, 148, 36, 18);
  ctx.fill();

  // Brand tag
  ctx.fillStyle = "rgba(56, 189, 248, 0.18)";
  ctx.beginPath();
  ctx.roundRect(42, 118, 220, 40, 20);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = accentColor;
  ctx.font = "700 18px system-ui, -apple-system, sans-serif";
  ctx.fillText(brandTitle.toUpperCase(), 62, 144);

  // Main KPI display
  const animatedVal = Math.round(
    interpolate(frame, [0, 120], [1420, 9840], { extrapolateRight: "clamp" })
  );
  ctx.fillStyle = "#ffffff";
  ctx.font = "800 76px system-ui, -apple-system, sans-serif";
  ctx.fillText(`$${animatedVal.toLocaleString("en-US")}`, 42, 245);

  ctx.fillStyle = "#34d399";
  ctx.font = "700 24px system-ui, -apple-system, sans-serif";
  ctx.fillText("▲ +34.8% REALTIME THROUGHPUT", 42, 286);

  // Live animated chart card
  ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
  ctx.beginPath();
  ctx.roundRect(36, 336, w - 72, 290, 26);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Animated wave bars inside chart card
  const barCount = 14;
  const chartX = 64;
  const chartBaseY = 574;
  const barWidth = 18;
  const gap = 14;
  for (let i = 0; i < barCount; i++) {
    const wave = 0.5 + 0.5 * Math.sin(frame * 0.1 + i * 0.6);
    const bh = 38 + wave * 140;
    const grad = ctx.createLinearGradient(0, chartBaseY - bh, 0, chartBaseY);
    grad.addColorStop(0, accentColor);
    grad.addColorStop(1, "#6366f1");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(chartX + i * (barWidth + gap), chartBaseY - bh, barWidth, bh, 8);
    ctx.fill();
  }

  // Bottom status tiles
  const cards = [
    { label: "SHADER FPS", val: "60.0", color: "#38bdf8" },
    { label: "SPECULAR", val: "PBR", color: "#f472b6" },
  ];
  cards.forEach((c, idx) => {
    const cx = 36 + idx * ((w - 88) / 2 + 16);
    const cw = (w - 88) / 2;
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    ctx.roundRect(cx, 660, cw, 165, 22);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.stroke();

    ctx.fillStyle = "#94a3b8";
    ctx.font = "700 18px system-ui, -apple-system, sans-serif";
    ctx.fillText(c.label, cx + 22, 704);

    ctx.fillStyle = c.color;
    ctx.font = "800 44px system-ui, -apple-system, sans-serif";
    ctx.fillText(c.val, cx + 22, 772);
  });

  // Home indicator bar
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  ctx.beginPath();
  ctx.roundRect(w / 2 - 80, h - 36, 160, 8, 4);
  ctx.fill();
}

const DeviceScene: React.FC<{
  brandTitle: string;
  accentColor: string;
}> = ({ brandTitle, accentColor }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 90 },
  });

  // Smooth revolution from -30deg (-PI/6) to +30deg (+PI/6)
  const rotationY = interpolate(frame, [0, 120], [-Math.PI / 6, Math.PI / 6], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotationX = interpolate(frame, [0, 60, 120], [0.22, 0.08, 0.18], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const floatY = Math.sin(frame * 0.06) * 0.12;

  // Sweep directional key light slightly so highlights glide across glass and aluminum bevels
  const lightX = interpolate(frame, [0, 120], [-6, 7]);

  // Procedural beveled aluminum chassis geometry
  const chassisGeometry = useMemo(() => {
    const shape = createRoundedRectShape(3.55, 7.15, 0.42);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.24,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    });
    geom.center();
    return geom;
  }, []);

  // Screen bezel geometry
  const bezelGeometry = useMemo(() => {
    const shape = createRoundedRectShape(3.38, 6.96, 0.36);
    const geom = new THREE.ExtrudeGeometry(shape, {
      depth: 0.03,
      bevelEnabled: false,
    });
    geom.center();
    return geom;
  }, []);

  // Screen plane geometry with UV mapped rounded corners
  const screenGeometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(3.16, 6.66);
    return geom;
  }, []);

  // Procedural CanvasTexture for live device UI
  const screenTextureBundle = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return { canvas, ctx, texture };
  }, []);

  useLayoutEffect(() => {
    if (screenTextureBundle.ctx) {
      drawPhoneScreenTexture(
        screenTextureBundle.ctx,
        screenTextureBundle.canvas.width,
        screenTextureBundle.canvas.height,
        frame,
        accentColor,
        brandTitle
      );
      screenTextureBundle.texture.needsUpdate = true;
    }
  }, [frame, accentColor, brandTitle, screenTextureBundle]);

  useEffect(() => {
    return () => {
      chassisGeometry.dispose();
      bezelGeometry.dispose();
      screenGeometry.dispose();
      screenTextureBundle.texture.dispose();
    };
  }, [chassisGeometry, bezelGeometry, screenGeometry, screenTextureBundle]);

  const scale = interpolate(entrance, [0, 1], [0.75, 1]);

  return (
    <>
      {/* Studio Lighting Rig */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[lightX, 6, 8]} intensity={2.4} color="#ffffff" />
      <pointLight position={[-6, -3, 6]} intensity={25} color="#38bdf8" />
      <pointLight position={[6, 3, -5]} intensity={30} color="#a855f7" />

      {/* Revolving Metallic Device Assembly */}
      <group
        position={[0, floatY - 0.15, 0]}
        rotation={[rotationX, rotationY, -0.04]}
        scale={[scale, scale, scale]}
      >
        {/* Brushed Titanium / Aluminum Body */}
        <mesh geometry={chassisGeometry}>
          <meshStandardMaterial
            color="#64748b"
            metalness={0.88}
            roughness={0.2}
          />
        </mesh>

        {/* Inner Metallic Frame Accent */}
        <mesh position={[0, 0, 0.165]} geometry={bezelGeometry}>
          <meshStandardMaterial
            color="#020617"
            metalness={0.4}
            roughness={0.18}
          />
        </mesh>

        {/* Glowing OLED Glass Screen */}
        <mesh position={[0, 0, 0.186]} geometry={screenGeometry}>
          <meshStandardMaterial
            map={screenTextureBundle.texture}
            emissive="#ffffff"
            emissiveMap={screenTextureBundle.texture}
            emissiveIntensity={0.48}
            roughness={0.08}
            metalness={0.18}
          />
        </mesh>

        {/* Subtle Top Glass Specular Overlay */}
        <mesh position={[0, 0, 0.19]}>
          <planeGeometry args={[3.16, 6.66]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.12}
            color="#ffffff"
            roughness={0.04}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </mesh>

        {/* Side Hardware Buttons */}
        <mesh position={[1.86, 0.9, 0]}>
          <boxGeometry args={[0.06, 0.85, 0.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-1.86, 1.3, 0]}>
          <boxGeometry args={[0.06, 0.55, 0.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[-1.86, 0.55, 0]}>
          <boxGeometry args={[0.06, 0.55, 0.1]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Rear Camera Island (visible during -30deg/+30deg edge sweeps) */}
        <mesh position={[-0.75, 2.25, -0.22]}>
          <boxGeometry args={[1.2, 1.2, 0.12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.25} />
        </mesh>
      </group>
    </>
  );
};

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  brandTitle = "Remotion 3D",
  headline = "Metallic Device Orbit",
  sublabel = "ThreeCanvas • Beveled Extrusion & Specular Rig",
  accentColor = "#38bdf8",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const hudEntrance = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  const angleDeg = interpolate(frame, [0, 120], [-30, 30], {
    easing: Easing.inOut(Easing.sin),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 45%, #0f172a 0%, #050814 55%, #020308 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Ambient studio halo */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 960,
          height: 960,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, rgba(168, 85, 247, 0.08) 45%, rgba(0, 0, 0, 0) 72%)",
          pointerEvents: "none",
        }}
      />

      {/* True 3D WebGL Canvas */}
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: 38, position: [0, 0, 13.5], near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ position: "absolute", inset: 0 }}
      >
        <DeviceScene brandTitle={brandTitle} accentColor={accentColor} />
      </ThreeCanvas>

      {/* Editorial HUD Overlay */}
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 80,
          opacity: hudEntrance,
          transform: `translateY(${interpolate(hudEntrance, [0, 1], [16, 0])}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(56, 189, 248, 0.14)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#7dd3fc",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          CATEGORY G // PRACTICE 37
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 52,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
          }}
        >
          {headline}
        </h1>
        <div style={{ fontSize: 22, color: "#94a3b8", marginTop: 6 }}>
          {sublabel}
        </div>
      </div>

      {/* Live Orbit Telemetry Pill */}
      <div
        style={{
          position: "absolute",
          bottom: 56,
          right: 80,
          padding: "16px 28px",
          borderRadius: 20,
          backgroundColor: "rgba(15, 23, 42, 0.72)",
          border: "1px solid rgba(255, 255, 255, 0.14)",
          backdropFilter: "blur(16px)",
          color: "#e2e8f0",
          fontSize: 22,
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          opacity: hudEntrance,
        }}
      >
        ORBIT Y:{" "}
        <span style={{ color: accentColor }}>
          {angleDeg >= 0 ? `+${angleDeg.toFixed(1)}°` : `${angleDeg.toFixed(1)}°`}
        </span>
      </div>
    </AbsoluteFill>
  );
};
