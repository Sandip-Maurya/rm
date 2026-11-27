import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  BEATS,
  COLORS,
  NODE_HEIGHT,
  NODE_POSITIONS,
  NODE_WIDTH,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./constants";
import { CameraRig } from "./components/CameraRig";
import { ArchitectureNode } from "./components/ArchitectureNode";
import { FlowEdge } from "./components/FlowEdge";
import { FocusBox } from "./components/FocusBox";
import { HudOverlay } from "./components/HudOverlay";
import { AudioTrack } from "./audio/AudioTrack";
import type { DevOpsFlowProps } from "./types";

export const DevOpsFlow: React.FC<DevOpsFlowProps> = ({
  enableAudio = true,
  showSubtitles = true,
}) => {
  const frame = useCurrentFrame();

  const inBottleneck =
    frame >= BEATS.bottleneck.start && frame < BEATS.cache.start;
  const inCache = frame >= BEATS.cache.start && frame < BEATS.queue.start;
  const inQueue = frame >= BEATS.queue.start && frame < BEATS.resolution.start;
  const inResolution = frame >= BEATS.resolution.start;

  // Dynamic node states per beat
  const postgresColor = inBottleneck
    ? COLORS.coral
    : inCache
      ? COLORS.amber
      : COLORS.emerald;
  const postgresStatus = inBottleneck
    ? "98% CPU"
    : inCache
      ? "38% CPU"
      : inQueue || inResolution
        ? "14% CPU"
        : "22% CPU";
  const postgresLoad = inBottleneck ? 98 : inCache ? 38 : inQueue || inResolution ? 14 : 22;

  const apiColor = inBottleneck ? COLORS.amber : COLORS.sky;
  const apiStatus = inBottleneck
    ? "QUEUED"
    : inResolution
      ? "18ms P95"
      : "ONLINE";

  const packetSpeedClientToApi = inBottleneck ? 3.2 : 1.7;
  const packetSpeedApiToDb = inBottleneck ? 3.6 : inCache || inQueue || inResolution ? 1.1 : 1.7;

  const halfW = NODE_WIDTH / 2;
  const halfH = NODE_HEIGHT / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <CameraRig>
        {/* World-space SVG Connectors */}
        <svg
          width={VIDEO_WIDTH}
          height={VIDEO_HEIGHT}
          viewBox={`0 0 ${VIDEO_WIDTH} ${VIDEO_HEIGHT}`}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {/* Client -> API */}
          <FlowEdge
            x1={NODE_POSITIONS.client.x + halfW}
            y1={NODE_POSITIONS.client.y}
            x2={NODE_POSITIONS.api.x - halfW - 6}
            y2={NODE_POSITIONS.api.y}
            cx={(NODE_POSITIONS.client.x + NODE_POSITIONS.api.x) / 2}
            cy={NODE_POSITIONS.client.y}
            appearFrame={42}
            color={inBottleneck ? COLORS.coral : COLORS.sky}
            packetCount={inBottleneck ? 4 : 2}
            packetSpeed={packetSpeedClientToApi}
            dimmed={inBottleneck || inCache || inQueue}
            label={inBottleneck ? "Spike 10k RPS" : "HTTPS"}
          />

          {/* API -> Postgres */}
          <FlowEdge
            x1={NODE_POSITIONS.api.x + halfW}
            y1={NODE_POSITIONS.api.y}
            x2={NODE_POSITIONS.postgres.x - halfW - 6}
            y2={NODE_POSITIONS.postgres.y}
            cx={(NODE_POSITIONS.api.x + NODE_POSITIONS.postgres.x) / 2}
            cy={NODE_POSITIONS.api.y}
            appearFrame={84}
            color={inBottleneck ? COLORS.coral : inResolution ? COLORS.emerald : COLORS.sky}
            packetCount={inBottleneck ? 5 : 2}
            packetSpeed={packetSpeedApiToDb}
            dimmed={inQueue}
            label={inBottleneck ? "480ms Lock!" : "SQL"}
          />

          {/* API -> Redis Cache (Beat 3) */}
          <FlowEdge
            x1={NODE_POSITIONS.api.x + 20}
            y1={NODE_POSITIONS.api.y - halfH}
            x2={NODE_POSITIONS.redis.x - halfW - 8}
            y2={NODE_POSITIONS.redis.y + 16}
            cx={NODE_POSITIONS.api.x + 15}
            cy={NODE_POSITIONS.redis.y + 20}
            appearFrame={BEATS.cache.start + 18}
            color={COLORS.sky}
            dashed
            packetCount={3}
            packetSpeed={2.2}
            dimmed={inQueue}
            label="Cache Hit 2ms"
          />

          {/* Redis -> Postgres fallback (Beat 3) */}
          <FlowEdge
            x1={NODE_POSITIONS.redis.x + halfW + 6}
            y1={NODE_POSITIONS.redis.y + 16}
            x2={NODE_POSITIONS.postgres.x - 20}
            y2={NODE_POSITIONS.postgres.y - halfH - 6}
            cx={NODE_POSITIONS.postgres.x - 15}
            cy={NODE_POSITIONS.redis.y + 20}
            appearFrame={BEATS.cache.start + 34}
            color={COLORS.indigo}
            dashed
            packetCount={1}
            packetSpeed={1.2}
            dimmed={inQueue}
            label="Miss Only"
          />

          {/* API -> Kafka Queue (Beat 4) */}
          <FlowEdge
            x1={NODE_POSITIONS.api.x + 25}
            y1={NODE_POSITIONS.api.y + halfH}
            x2={NODE_POSITIONS.kafka.x - halfW - 8}
            y2={NODE_POSITIONS.kafka.y}
            cx={NODE_POSITIONS.api.x + 30}
            cy={NODE_POSITIONS.kafka.y}
            appearFrame={BEATS.queue.start + 18}
            color={COLORS.violet}
            dashed
            packetCount={3}
            packetSpeed={2.0}
            dimmed={inCache}
            label="Async Events"
          />

          {/* Kafka -> Worker Pool (Beat 4) */}
          <FlowEdge
            x1={NODE_POSITIONS.kafka.x + halfW}
            y1={NODE_POSITIONS.kafka.y}
            x2={NODE_POSITIONS.workers.x - halfW - 6}
            y2={NODE_POSITIONS.workers.y}
            cx={(NODE_POSITIONS.kafka.x + NODE_POSITIONS.workers.x) / 2}
            cy={NODE_POSITIONS.kafka.y}
            appearFrame={BEATS.queue.start + 34}
            color={COLORS.amber}
            packetCount={3}
            packetSpeed={2.3}
            dimmed={inCache}
            label="Batch Jobs"
          />
        </svg>

        {/* World-space Architecture Nodes */}
        <ArchitectureNode
          kind="client"
          x={NODE_POSITIONS.client.x}
          y={NODE_POSITIONS.client.y}
          title="Client App"
          subtitle="Web & Mobile Traffic"
          appearFrame={15}
          statusLabel={inBottleneck ? "10k RPS" : "ACTIVE"}
          accentColor={COLORS.sky}
          loadPercent={inBottleneck ? 88 : 35}
          dimmed={inBottleneck || inCache || inQueue}
        />

        <ArchitectureNode
          kind="api"
          x={NODE_POSITIONS.api.x}
          y={NODE_POSITIONS.api.y}
          title="API Server"
          subtitle="Node / REST Gateway"
          appearFrame={52}
          statusLabel={apiStatus}
          accentColor={apiColor}
          loadPercent={inBottleneck ? 74 : 28}
          dimmed={false}
        />

        <ArchitectureNode
          kind="postgres"
          x={NODE_POSITIONS.postgres.x}
          y={NODE_POSITIONS.postgres.y}
          title="Postgres DB"
          subtitle="Primary Storage"
          appearFrame={88}
          statusLabel={postgresStatus}
          accentColor={postgresColor}
          loadPercent={postgresLoad}
          focused={inBottleneck}
          dimmed={inQueue}
        />

        <ArchitectureNode
          kind="redis"
          x={NODE_POSITIONS.redis.x}
          y={NODE_POSITIONS.redis.y}
          title="Redis Cache"
          subtitle="In-Memory Read Store"
          appearFrame={BEATS.cache.start + 6}
          statusLabel="92% HIT"
          accentColor={COLORS.sky}
          loadPercent={24}
          focused={inCache}
          dimmed={inQueue}
        />

        <ArchitectureNode
          kind="kafka"
          x={NODE_POSITIONS.kafka.x}
          y={NODE_POSITIONS.kafka.y}
          title="Kafka Queue"
          subtitle="Event Stream Broker"
          appearFrame={BEATS.queue.start + 6}
          statusLabel="STREAMING"
          accentColor={COLORS.violet}
          loadPercent={42}
          focused={inQueue}
        />

        <ArchitectureNode
          kind="workers"
          x={NODE_POSITIONS.workers.x}
          y={NODE_POSITIONS.workers.y}
          title="Worker Pool"
          subtitle="4x Auto-Scaled"
          appearFrame={BEATS.queue.start + 22}
          statusLabel="4x PODS"
          accentColor={COLORS.amber}
          loadPercent={36}
          focused={inQueue}
        />

        {/* Dynamic Marching-Ants Focus Rectangle */}
        <FocusBox />
      </CameraRig>

      {/* Screen-space Telemetry HUD & Subtitles */}
      <HudOverlay showSubtitles={showSubtitles} />

      {/* Synchronized Qwen3-TTS Voiceover */}
      {enableAudio && <AudioTrack />}
    </AbsoluteFill>
  );
};
