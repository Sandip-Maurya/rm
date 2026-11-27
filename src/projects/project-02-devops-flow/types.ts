import type { NodeId } from "./constants";

export interface DevOpsFlowProps {
  enableAudio?: boolean;
  showSubtitles?: boolean;
}

export type NodeKind = NodeId;

export interface NodeData {
  id: NodeId;
  title: string;
  subtitle: string;
  appearFrame: number;
}

export interface EdgeData {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  controlOffset?: { dx: number; dy: number };
  appearFrame: number;
  drawDuration?: number;
  dashed?: boolean;
  bidirectional?: boolean;
  label?: string;
}
