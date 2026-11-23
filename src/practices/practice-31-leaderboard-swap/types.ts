export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  scoreBefore: number;
  scoreAfter: number;
  badge: string;
}

export interface LeaderboardRankSwapProps {
  title?: string;
  subtitle?: string;
  entries?: LeaderboardEntry[];
}
