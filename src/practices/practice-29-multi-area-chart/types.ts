export interface DataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface MultiSeriesAreaChartProps {
  title?: string;
  subtitle?: string;
  dataPoints?: DataPoint[];
}
