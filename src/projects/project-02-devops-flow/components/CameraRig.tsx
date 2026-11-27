import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import {
  CAMERA_KEYFRAMES,
  COLORS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../constants";
import type { CameraKeyframe } from "../constants";

interface CameraRigProps {
  children: React.ReactNode;
}

const DEFAULT_CAMERA: CameraKeyframe = { frame: 0, x: 960, y: 545, zoom: 1.0 };

const sampleCamera = (frame: number): CameraKeyframe => {
  const first = CAMERA_KEYFRAMES[0] ?? DEFAULT_CAMERA;
  const last = CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1] ?? DEFAULT_CAMERA;

  if (frame <= first.frame) {
    return first;
  }
  if (frame >= last.frame) {
    return last;
  }

  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    const a = CAMERA_KEYFRAMES[i];
    const b = CAMERA_KEYFRAMES[i + 1];
    if (a && b && frame >= a.frame && frame <= b.frame) {
      const t = interpolate(frame, [a.frame, b.frame], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      });
      return {
        frame,
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        zoom: a.zoom + (b.zoom - a.zoom) * t,
      };
    }
  }
  return last;
};

export const CameraRig: React.FC<CameraRigProps> = ({ children }) => {
  const frame = useCurrentFrame();
  const cam = sampleCamera(frame);

  const translateX = VIDEO_WIDTH / 2 - cam.x * cam.zoom;
  const translateY = VIDEO_HEIGHT / 2 - cam.y * cam.zoom;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: COLORS.bg,
      }}
    >
      {/* Subtle ambient radial vignette in screen space */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 45%, rgba(56, 189, 248, 0.08) 0%, rgba(9, 14, 26, 0) 65%)",
          pointerEvents: "none",
        }}
      />

      {/* World-space container */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: VIDEO_WIDTH,
          height: VIDEO_HEIGHT,
          transformOrigin: "0 0",
          transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${cam.zoom})`,
        }}
      >
        {/* World-space blueprint dot grid (oversized so pans never expose edges) */}
        <div
          style={{
            position: "absolute",
            left: -800,
            top: -600,
            width: VIDEO_WIDTH + 1600,
            height: VIDEO_HEIGHT + 1200,
            backgroundImage: `radial-gradient(${COLORS.gridDot} 1.6px, transparent 1.6px)`,
            backgroundSize: "36px 36px",
            pointerEvents: "none",
          }}
        />
        {children}
      </div>
    </div>
  );
};
