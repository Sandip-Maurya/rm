export interface BarItem {
  year: string;
  value: number; // percentage (e.g. 35, 62, 85, 100)
  displayValue: string;
  isHighlight?: boolean;
}

export interface StaggeredBarChartProps {
  title?: string;
  subtitle?: string;
  bars?: BarItem[];
}
