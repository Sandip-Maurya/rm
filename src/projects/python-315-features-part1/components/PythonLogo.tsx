import React from "react";
import { Img, staticFile, spring, useCurrentFrame, useVideoConfig } from "remotion";

interface PythonLogoProps {
  size?: number;
  delay?: number;
}

export const PythonLogo: React.FC<PythonLogoProps> = ({ size = 190, delay = 8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSpring = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 11,
      mass: 0.55,
      stiffness: 130,
    },
  });

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${logoSpring}) rotate(${(1 - logoSpring) * -12}deg)`,
        opacity: logoSpring,
      }}
    >
      <Img
        src={staticFile("python.svg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
};
