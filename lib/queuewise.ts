import type {
  RequestItem,
  ScoreBreakdown,
} from '../types/queue.ts';

export const ALGORITHM_VERSION = 'QW-1.1';

export function calculateScore(
  item: RequestItem
): ScoreBreakdown {
  const urgencyScore = item.urgency * 4;
  const waitingScore = Math.min(
    item.daysWaiting * 2,
    15
  );
  const dependencyScore = Math.min(
    item.dependencies * 3,
    15
  );
  const fairnessScore = Math.min(
    item.timesDeferred * 4,
    20
  );

  return {
    urgencyScore,
    waitingScore,
    dependencyScore,
    fairnessScore,
    total:
      urgencyScore +
      waitingScore +
      dependencyScore +
      fairnessScore,
  };
}

export function priorityLabel(
  score: number
) {
  if (score >= 35) return 'Critical';
  if (score >= 25) return 'High';
  if (score >= 15) return 'Medium';
  return 'Low';
}

export function priorityClasses(
  priority: string
) {
  switch (priority) {
    case 'Critical':
      return 'border-red-200 bg-red-50 text-red-700';
    case 'High':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'Medium':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    default:
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  }
}

export function scoreBarWidth(score: number) {
  return `${Math.min((score / 70) * 100, 100)}%`;
}

export function rankRequests(
  requests: RequestItem[]
) {
  return [...requests]
    .map((item) => ({
      item,
      score: calculateScore(item),
    }))
    .sort((a, b) => {
      if (b.score.total !== a.score.total) {
        return b.score.total - a.score.total;
      }

      if (
        b.item.daysWaiting !==
        a.item.daysWaiting
      ) {
        return (
          b.item.daysWaiting -
          a.item.daysWaiting
        );
      }

      if (
        b.item.urgency !==
        a.item.urgency
      ) {
        return (
          b.item.urgency -
          a.item.urgency
        );
      }

      if (
        b.item.dependencies !==
        a.item.dependencies
      ) {
        return (
          b.item.dependencies -
          a.item.dependencies
        );
      }

      return a.item.id - b.item.id;
    });
}