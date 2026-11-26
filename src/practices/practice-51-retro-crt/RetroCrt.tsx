import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { RetroCrtProps } from "./types";

const BOOT_LOGS = [
  { frame: 2, tag: "BIOS", text: "PHOSPHOR-OS v4.0.545 KERNEL INITIALIZING..." },
  { frame: 9, tag: "MEM ", text: "65536K EXTENDED RAM VERIFIED [OK]" },
  { frame: 16, tag: "GPU ", text: "CRT CATHODE DEFLECTION COIL LOCKED @ 60.0 Hz" },
  { frame: 24, tag: "BUS ", text: "MOUNTING /dev/nvme0n1 -> /mnt/telemetry [RW]" },
  { frame: 32, tag: "NET ", text: "ESTABLISHING ENCRYPTED UPLINK TO NODE 10.0.42.9" },
  { frame: 40, tag: "SEC ", text: "HANDSHAKE VERIFIED: ED25519 SIGNATURE MATCHED" },
  { frame: 48, tag: "DISP", text: "BARREL DISTORTION OPTICS + RGB TRIAD MASK ENGAGED" },
  { frame: 56, tag: "SYNC", text: "FRAME-ACCURATE DETERMINISTIC CLOCK ONLINE" },
  { frame: 65, tag: "DONE", text: "ALL SUBSYSTEMS NOMINAL. READY FOR INPUT_" },
] as const;

/** Generate an SVG radial barrel-distortion displacement map data URI for <feDisplacementMap> */
function createBarrelDisplacementMapUrl(size = 256): string {
  if (typeof document === "undefined") return "";
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const img = ctx.createImageData(size, size);
  const data = img.data;
  const half = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - half) / half; // -1..1
      const ny = (y - half) / half; // -1..1
      const r2 = nx * nx + ny * ny;
      // Spherical barrel radial outward displacement encoded around neutral 128
      const factor = r2 * 0.42;
      const dx = nx * factor;
      const dy = ny * factor;

      const idx = (y * size + x) * 4;
      data[idx] = Math.max(0, Math.min(255, Math.round(128 + dx * 127)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dy * 127)));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

export const RetroCrt: React.FC<RetroCrtProps> = ({
  terminalTitle = "REMOTION // VT-420 PHOSPHOR TERMINAL",
  phosphorColor = "#4ade80",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const displacementUrl = useMemo(() => createBarrelDisplacementMapUrl(256), []);

  // Rolling horizontal scanlines (10-18% subtle opacity so text stays crisp)
  const scanlineY = (frame * 2.5) % 8;
  // Subtle CRT phosphor flicker
  const flicker = 0.96 + Math.sin(frame * 123) * 0.04;
  // Slow rolling CRT refresh hum bar
  const humBarY = interpolate(frame % 90, [0, 90], [-140, 980]);
  const cursorVisible = Math.floor(frame / 10) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#040608",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 56,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
        overflow: "hidden",
      }}
    >
      {/* SVG Spherical Barrel Displacement Filter */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="crt-barrel-warp" x="-5%" y="-5%" width="110%" height="110%">
            {displacementUrl && (
              <>
                <feImage
                  href={displacementUrl}
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  preserveAspectRatio="none"
                  result="dispMap"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="dispMap"
                  scale="34"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </>
            )}
          </filter>
        </defs>
      </svg>

      {/* Vintage Hardware CRT Plastic Monitor Bezel */}
      <div
        style={{
          width: 1580,
          height: 920,
          borderRadius: 56,
          background:
            "linear-gradient(145deg, #272b33 0%, #171a20 55%, #0e1014 100%)",
          padding: 44,
          boxShadow:
            "0 50px 120px rgba(0,0,0,0.95), inset 0 2px 4px rgba(255,255,255,0.16), 0 0 80px rgba(74, 222, 128, 0.08)",
          border: "3px solid #353b45",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Recessed CRT Curved Glass Tube */}
        <div
          style={{
            flex: 1,
            borderRadius: "64px / 48px",
            backgroundColor: "#030b07",
            boxShadow:
              "inset 0 0 70px rgba(0, 0, 0, 0.95), inset 0 0 18px rgba(74, 222, 128, 0.25)",
            border: "6px solid #090b0f",
            overflow: "hidden",
            position: "relative",
            opacity: flicker,
          }}
        >
          {/* Barrel-Warped Phosphor Content Layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              padding: "56px 72px",
              filter: displacementUrl ? "url(#crt-barrel-warp)" : undefined,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Terminal Top Status Bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingBottom: 22,
                  marginBottom: 32,
                  borderBottom: "2px solid rgba(74, 222, 128, 0.3)",
                  color: phosphorColor,
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  // Chromatic RGB edge bleeding
                  textShadow:
                    "-2px 0 rgba(255, 50, 90, 0.45), 2px 0 rgba(0, 240, 255, 0.45), 0 0 12px rgba(74, 222, 128, 0.65)",
                }}
              >
                <span>{terminalTitle}</span>
                <span>
                  CH-03 // {(frame / fps).toFixed(2)}s
                </span>
              </div>

              {/* Boot Log Lines typing deterministically */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {BOOT_LOGS.map((entry, idx) => {
                  const localFrame = frame - entry.frame;
                  if (localFrame < 0) return null;

                  const charsVisible = Math.floor(localFrame * 3.8);
                  const shownText = entry.text.slice(0, charsVisible);
                  const isTyping = charsVisible < entry.text.length;

                  return (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 20,
                        fontSize: 27,
                        fontWeight: 700,
                        lineHeight: 1.35,
                        color: phosphorColor,
                        textShadow:
                          "-1.8px 0 rgba(255, 45, 95, 0.42), 1.8px 0 rgba(34, 211, 238, 0.42), 0 0 10px rgba(74, 222, 128, 0.55)",
                      }}
                    >
                      <span
                        style={{
                          padding: "2px 10px",
                          borderRadius: 6,
                          backgroundColor: "rgba(74, 222, 128, 0.14)",
                          border: "1px solid rgba(74, 222, 128, 0.4)",
                          color: "#bbf7d0",
                          fontSize: 21,
                          flexShrink: 0,
                        }}
                      >
                        [{entry.tag}]
                      </span>
                      <span>
                        {shownText}
                        {(isTyping || (idx === BOOT_LOGS.length - 1 && cursorVisible)) && (
                          <span
                            style={{
                              display: "inline-block",
                              width: 16,
                              height: 28,
                              backgroundColor: phosphorColor,
                              marginLeft: 6,
                              verticalAlign: "text-bottom",
                              boxShadow: `0 0 12px ${phosphorColor}`,
                            }}
                          />
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Prompt Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                color: "rgba(134, 239, 172, 0.78)",
                fontSize: 20,
                fontWeight: 700,
                textShadow:
                  "-1.5px 0 rgba(255, 45, 95, 0.35), 1.5px 0 rgba(34, 211, 238, 0.35)",
              }}
            >
              <span>CATEGORY J // PRACTICE 51</span>
              <span>OPTICS: BARREL + RGB APERTURE GRILLE</span>
            </div>
          </div>

          {/* Rolling CRT Hum Refresh Band */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: humBarY,
              height: 110,
              background:
                "linear-gradient(180deg, rgba(74,222,128,0) 0%, rgba(74,222,128,0.06) 50%, rgba(74,222,128,0) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Subtle Scrolling Horizontal Scanlines (14% opacity for high legibility) */}
          <div
            style={{
              position: "absolute",
              inset: -8,
              transform: `translateY(${scanlineY}px)`,
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.28) 0px, rgba(0, 0, 0, 0.28) 2px, transparent 2px, transparent 6px)",
              opacity: 0.52, // effective dark band ~14.5%
              pointerEvents: "none",
            }}
          />

          {/* RGB Phosphor Aperture Grille Subpixel Matrix */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(255,0,0,0.05) 0px, rgba(255,0,0,0.05) 1px, rgba(0,255,0,0.05) 1px, rgba(0,255,0,0.05) 2px, rgba(0,120,255,0.05) 2px, rgba(0,120,255,0.05) 3px)",
              pointerEvents: "none",
            }}
          />

          {/* Spherical Glass Vignette & Curvature Glare */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0) 56%, rgba(0,0,0,0.68) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Monitor Power LED */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 76,
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#64748b",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          <span>POWER</span>
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: phosphorColor,
              boxShadow: `0 0 10px ${phosphorColor}`,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
