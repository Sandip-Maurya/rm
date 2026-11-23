export interface WordTimestamp {
  text: string;
  start: number;
  end: number;
}

export interface KaraokePillProps {
  speaker?: string;
  words?: WordTimestamp[];
}
