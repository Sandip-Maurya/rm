export interface SceneDurationConfig {
  hook: number;
  lazyImports: number;
  frozendict: number;
  unpacking: number;
  outro: number;
}

export interface PythonSnippet {
  code: string;
  highlightLines?: number[];
  filename?: string;
  badgeText?: string;
}

export interface MetricComparison {
  beforeLabel: string;
  beforeVal: string;
  afterLabel: string;
  afterVal: string;
}

export interface FeatureContent {
  id: string;
  index: string;
  icon: string;
  tag: string;
  title: string;
  summary: string;
  snippet: PythonSnippet;
  metric?: MetricComparison;
}

export interface Python315ShortProps {
  enableAudio?: boolean;
}
