export interface FeatureRowItem {
  feature: string;
  us: boolean;
  competitor: boolean;
}

export interface FeatureMatrixProps {
  title?: string;
  ourProduct?: string;
  competitorProduct?: string;
  features?: FeatureRowItem[];
}
