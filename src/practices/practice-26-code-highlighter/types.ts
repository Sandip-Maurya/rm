export interface CodeLineItem {
  tokens: { text: string; color: string }[];
}

export interface CodeHighlighterProps {
  filename?: string;
  lines?: CodeLineItem[];
}
