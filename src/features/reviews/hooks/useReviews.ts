import { useCallback, useEffect, useState } from 'react';

import type { LoadState } from '../../../types/common';
import type { Review, ReviewStats } from '../../../types/review';
import { DEMO_MODE, DEMO_REVIEWS, useDemoStore } from '../../../demo/demo';
import { ratingSummary } from '../../../utils/reviewMath';
import {
  EMPTY_STATS,
  fetchProductReviews,
  fetchRecentReviews,
  fetchReviewStats,
} from '../services/reviewService';

export function useProductReviews(productId: string, limitValue = 20) {
  const demoReviews = useDemoStore((state) => state.reviews);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const load = useCallback(async () => {
    if (DEMO_MODE) {
      const all = [...demoReviews, ...DEMO_REVIEWS]
        .filter((review) => review.productId === productId)
        .slice(0, limitValue);
      setReviews(all);
      setState('ready');
      return;
    }
    setState('loading');
    try {
      setReviews(await fetchProductReviews(productId, limitValue));
      setState('ready');
    } catch {
      setState('error');
    }
  }, [productId, limitValue, demoReviews]);

  useEffect(() => {
    void load();
  }, [load]);

  return { reviews, state, refresh: load };
}

export function useRecentReviews(limitValue = 10) {
  const demoReviews = useDemoStore((state) => state.reviews);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [state, setState] = useState<LoadState>('loading');

  const load = useCallback(async () => {
    if (DEMO_MODE) {
      setReviews(
        [...demoReviews, ...DEMO_REVIEWS]
          .sort(
            (a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
          )
          .slice(0, limitValue)
      );
      setState('ready');
      return;
    }
    setState('loading');
    try {
      setReviews(await fetchRecentReviews(limitValue));
      setState('ready');
    } catch {
      setState('error');
    }
  }, [limitValue, demoReviews]);

  useEffect(() => {
    void load();
  }, [load]);

  return { reviews, state, refresh: load };
}

export function useReviewStats() {
  const demoReviews = useDemoStore((state) => state.reviews);
  const [stats, setStats] = useState<ReviewStats>(EMPTY_STATS);
  const [state, setState] = useState<LoadState>('loading');

  const load = useCallback(async () => {
    if (DEMO_MODE) {
      const summary = ratingSummary([...DEMO_REVIEWS, ...demoReviews]);
      setStats({
        average: summary.average,
        count: summary.count,
        distribution: {
          1: summary.distribution[1] ?? 0,
          2: summary.distribution[2] ?? 0,
          3: summary.distribution[3] ?? 0,
          4: summary.distribution[4] ?? 0,
          5: summary.distribution[5] ?? 0,
        },
      });
      setState('ready');
      return;
    }
    setState('loading');
    try {
      setStats(await fetchReviewStats());
      setState('ready');
    } catch {
      setState('error');
    }
  }, [demoReviews]);

  useEffect(() => {
    void load();
  }, [load]);

  return { stats, state, refresh: load };
}
