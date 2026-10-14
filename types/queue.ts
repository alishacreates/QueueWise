export type RequestItem = {
  id: number;
  title: string;
  description: string;
  urgency: number;
  daysWaiting: number;
  dependencies: number;
  timesDeferred: number;
};

export type ScoreBreakdown = {
  urgencyScore: number;
  waitingScore: number;
  dependencyScore: number;
  fairnessScore: number;
  total: number;
};

export type RankedRequest = {
  item: RequestItem;
  score: ScoreBreakdown;
};

export type QueueForm = {
  title: string;
  description: string;
  urgency: number;
  daysWaiting: number;
  dependencies: number;
  timesDeferred: number;
};

export type QueueStats = {
  total: number;
  critical: number;
  old: number;
  boosted: number;
};