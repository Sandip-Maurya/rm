export interface KpiPillItem {
  label: string;
  value: string;
  isPositive?: boolean;
}

export interface StaggeredCascadeProps {
  title?: string;
  items?: KpiPillItem[];
}
