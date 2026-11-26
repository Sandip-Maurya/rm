export interface ExtrudedBarItem {
  label: string;
  valueText: string;
  targetHeight: number;
  color: string;
}

export interface ExtrudedBarsProps {
  title?: string;
  subtitle?: string;
  bars?: ExtrudedBarItem[];
}
