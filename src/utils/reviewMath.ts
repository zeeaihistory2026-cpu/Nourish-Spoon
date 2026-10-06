import type { Review } from '../types/review';

export interface RatingSummaryData {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

export function ratingSummary(reviews: Review[]): RatingSummaryData {
  if (reviews.length === 0) {
    return { average: 0, count: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;
  for (const review of reviews) {
    const bucket = Math.min(5, Math.max(1, Math.round(review.rating)));
    distribution[bucket] = (distribution[bucket] ?? 0) + 1;
    total += review.rating;
  }
  return {
    average: total / reviews.length,
    count: reviews.length,
    distribution,
  };
}
