import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { NeuralNetworkProps } from "./types";

interface NetworkNode {
  id: string;
  layerIndex: number;
  nodeIndex: number;
  x: number;
  y: number;
  entranceStartFrame: number;
  settledFrame: number;
  color: string;
}

interface SynapseEdge {
  id: string;
  from: NetworkNode;
  to: NetworkNode;
  drawStartFrame: number;
  pulseLaunchFrame: number;
  travelDuration: number;
}

const LAYER_CONFIG = [
  { name: "INPUT", count: 3, x: 340, color: "#38bdf8" },
  { name: "HIDDEN L1", count: 5, x: 750, color: "#818cf8" },
  { name: "HIDDEN L2", count: 4, x: 1170, color: "#c084fc" },
  { name: "OUTPUT", count: 2, x: 1580, color: "#34d399" },
] as const;

export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({
  title = "Transformer Neural Architecture",
  subtitle = "Staggered Layer Topology • Post-Settlement Synaptic Pulse Propagation",
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  const { nodes, edges } = useMemo(() => {
    const centerY = height * 0.6;
    const verticalSpacing = 126;

    const builtNodes: NetworkNode[] = [];
    const layers: NetworkNode[][] = [];

    LAYER_CONFIG.forEach((layerCfg, layerIdx) => {
      const layerArr: NetworkNode[] = [];
      const totalH = (layerCfg.count - 1) * verticalSpacing;
      const entranceStart = layerIdx * 12;
      // Spring damping:14, mass:0.5 settles cleanly by ~24 frames after launch
      const settledFrame = entranceStart + 24;

      for (let nIdx = 0; nIdx < layerCfg.count; nIdx++) {
        const y = centerY - totalH / 2 + nIdx * verticalSpacing;
        const node: NetworkNode = {
          id: `L${layerIdx}-N${nIdx}`,
          layerIndex: layerIdx,
          nodeIndex: nIdx,
          x: layerCfg.x,
          y,
          entranceStartFrame: entranceStart + nIdx * 2,
          settledFrame: settledFrame + nIdx * 2,
          color: layerCfg.color,
        };
        builtNodes.push(node);
        layerArr.push(node);
      }
      layers.push(layerArr);
    });

    const builtEdges: SynapseEdge[] = [];
    for (let l = 0; l < layers.length - 1; l++) {
      const srcLayer = layers[l] ?? [];
      const dstLayer = layers[l + 1] ?? [];
      srcLayer.forEach((src) => {
        dstLayer.forEach((dst, dstIdx) => {
          // Ensure pulse ONLY triggers AFTER source node's entrance animation has fully settled
          const pulseLaunchFrame = src.settledFrame + ((src.nodeIndex + dstIdx) % 3) * 3;
          builtEdges.push({
            id: `${src.id}->${dst.id}`,
            from: src,
            to: dst,
            drawStartFrame: src.entranceStartFrame + 6,
            pulseLaunchFrame,
            travelDuration: 28,
          });
        });
      });
    }

    return { nodes: builtNodes, edges: builtEdges };
  }, [height]);

  // Compute node excitation intensity from arriving synaptic energy packets
  const nodeExcitationMap = useMemo(() => {
    const excitation: Record<string, number> = {};
    edges.forEach((edge) => {
      if (frame < edge.pulseLaunchFrame) return;
      const elapsed = frame - edge.pulseLaunchFrame;
      const cyclePos = (elapsed % edge.travelDuration) / edge.travelDuration;
      // Downstream node flashes brightly as packet arrives (cyclePos near 1.0 or 0.0 after first wave)
      const arrivalFlash =
        elapsed >= edge.travelDuration * 0.78
          ? Math.max(
              interpolate(cyclePos, [0.82, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
              elapsed >= edge.travelDuration
                ? interpolate(cyclePos, [0, 0.25], [1, 0], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  })
                : 0
            )
          : 0;

      excitation[edge.to.id] = Math.max(excitation[edge.to.id] ?? 0, arrivalFlash);
    });
    return excitation;
  }, [edges, frame]);

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.6 },
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 54%, #0d152a 0%, #030612 65%, #010207 100%)",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 80,
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [14, 0])}px)`,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "8px 20px",
            borderRadius: 9999,
            backgroundColor: "rgba(56, 189, 248, 0.14)",
            border: "1px solid rgba(56, 189, 248, 0.35)",
            color: "#7dd3fc",
            fontSize: 18,
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}
        >
          CATEGORY I // PRACTICE 47
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 50,
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

      {/* SVG Network Graph & Pulse Layer */}
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id="neural-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Layer Column Headers */}
        {LAYER_CONFIG.map((layer, lIdx) => {
          const lSpring = spring({
            frame: frame - lIdx * 12,
            fps,
            config: { damping: 14, mass: 0.5 },
          });
          return (
            <text
              key={layer.name}
              x={layer.x}
              y={252}
              textAnchor="middle"
              fill={layer.color}
              fillOpacity={lSpring * 0.9}
              fontSize={20}
              fontWeight={800}
              letterSpacing={2}
            >
              {layer.name}
            </text>
          );
        })}

        {/* Connecting Synapses */}
        {edges.map((edge) => {
          const lineLen = Math.hypot(edge.to.x - edge.from.x, edge.to.y - edge.from.y);
          const drawProgress = interpolate(
            frame,
            [edge.drawStartFrame, edge.drawStartFrame + 16],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          if (drawProgress <= 0.005) return null;

          return (
            <line
              key={edge.id}
              x1={edge.from.x}
              y1={edge.from.y}
              x2={edge.to.x}
              y2={edge.to.y}
              stroke={edge.from.color}
              strokeOpacity={0.22 * drawProgress}
              strokeWidth={2}
              strokeDasharray={lineLen}
              strokeDashoffset={lineLen * (1 - drawProgress)}
            />
          );
        })}

        {/* Traveling Energy Packets (strictly triggered after source node settles) */}
        {edges.map((edge) => {
          if (frame < edge.pulseLaunchFrame) return null;

          const elapsed = frame - edge.pulseLaunchFrame;
          const pulseProgress = (elapsed % edge.travelDuration) / edge.travelDuration;
          const pulseX = edge.from.x + (edge.to.x - edge.from.x) * pulseProgress;
          const pulseY = edge.from.y + (edge.to.y - edge.from.y) * pulseProgress;
          const packetAlpha = interpolate(
            pulseProgress,
            [0, 0.12, 0.85, 1],
            [0, 1, 1, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          );

          return (
            <g key={`pulse-${edge.id}`} opacity={packetAlpha}>
              <circle
                cx={pulseX}
                cy={pulseY}
                r={7}
                fill={edge.to.color}
                fillOpacity={0.5}
                filter="url(#neural-glow)"
              />
              <circle cx={pulseX} cy={pulseY} r={3.6} fill="#ffffff" />
            </g>
          );
        })}

        {/* Neural Nodes */}
        {nodes.map((node) => {
          const nodeSpring = spring({
            frame: frame - node.entranceStartFrame,
            fps,
            config: { damping: 14, mass: 0.5 },
          });

          if (nodeSpring <= 0.005) return null;

          const excite = nodeExcitationMap[node.id] ?? 0;
          const baseRadius = 24;
          const scale = nodeSpring * (1 + excite * 0.22);

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y}) scale(${scale})`}
            >
              {/* Arrival Excitation Pulse Halo */}
              {excite > 0.02 && (
                <circle
                  cx={0}
                  cy={0}
                  r={baseRadius + 10 + excite * 18}
                  fill="none"
                  stroke={node.color}
                  strokeOpacity={excite * 0.8}
                  strokeWidth={3}
                  filter="url(#neural-glow)"
                />
              )}

              {/* Outer node glow ring */}
              <circle
                cx={0}
                cy={0}
                r={baseRadius + 6}
                fill={node.color}
                fillOpacity={0.14 + excite * 0.35}
                filter="url(#neural-glow)"
              />

              {/* Main Node Body */}
              <circle
                cx={0}
                cy={0}
                r={baseRadius}
                fill="#0b1120"
                stroke={node.color}
                strokeWidth={3 + excite * 1.5}
              />

              {/* Inner Activation Core */}
              <circle
                cx={0}
                cy={0}
                r={9 + excite * 5}
                fill={excite > 0.25 ? "#ffffff" : node.color}
                fillOpacity={0.75 + excite * 0.25}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
