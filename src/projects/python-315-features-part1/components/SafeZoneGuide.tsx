import React from "react";
import { AbsoluteFill } from "remotion";

export const SafeZoneGuide: React.FC = () => {
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 9999 }}>
      {/* Top Danger Zone */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 150,
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          borderBottom: "2px dashed rgba(239, 68, 68, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f87171",
          fontFamily: "monospace",
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        ⚠️ TOP SAFE ZONE (~150px) - Header / Camera / Audio Icons
      </div>

      {/* Right Rail Action Buttons Zone */}
      <div
        style={{
          position: "absolute",
          top: 700,
          right: 0,
          width: 140,
          height: 820,
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          borderLeft: "2px dashed rgba(239, 68, 68, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          color: "#f87171",
          fontFamily: "monospace",
          fontSize: 16,
          fontWeight: 700,
          padding: 8,
          textAlign: "center",
        }}
      >
        <div>👍<br />Like</div>
        <div>👎<br />Dislike</div>
        <div>💬<br />Comment</div>
        <div>↗️<br />Share</div>
        <div>🎵<br />Audio</div>
      </div>

      {/* Bottom Danger Zone */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 360,
          backgroundColor: "rgba(239, 68, 68, 0.12)",
          borderTop: "2px dashed rgba(239, 68, 68, 0.5)",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "24px 36px",
          color: "#f87171",
          fontFamily: "monospace",
          fontSize: 18,
          fontWeight: 700,
          gap: 12,
        }}
      >
        <div>⚠️ BOTTOM DANGER ZONE (~360px)</div>
        <div style={{ opacity: 0.8, fontSize: 16 }}>
          • Channel Avatar & Name (@channel) + "Subscribe" button
          <br />• Video Title & Captions (1-2 lines)
          <br />• Scrubbing / Progress Bar
        </div>
      </div>
    </AbsoluteFill>
  );
};
