export interface MetricCheckItem {
  label: string;
  value: string;
  status: string;
  impactFrame: number;
}

export interface SfxMetricCascadeProps {
  title?: string;
  subtitle?: string;
  metrics?: MetricCheckItem[];
  enableAudio?: boolean;
}
