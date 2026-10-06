import { ratingSummary } from '../../../utils/reviewMath';
import type { Review } from '../../../types/review';

function review(rating: number): Review {
  return {
    id: `r-${rating}-${Math.random()}`,
    productId: 'p',
    productName: 'Classic Panjeeri',
    userId: 'u',
    userName: 'Test User',
    rating,
    comment: 'Great',
    verifiedPurchase: true,
    createdAt: null,
  };
}

describe('ratingSummary', () => {
  it('returns zeros for no reviews', () => {
    const summary = ratingSummary([]);
    expect(summary.average).toBe(0);
    expect(summary.count).toBe(0);
    expect(summary.distribution).toEqual({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  });

  it('averages ratings across reviews', () => {
    const summary = ratingSummary([review(5), review(4), review(5)]);
    expect(summary.count).toBe(3);
    expect(summary.average).toBeCloseTo(4.667, 2);
  });

  it('buckets ratings into a distribution', () => {
    const summary = ratingSummary([review(5), review(5), review(5), review(4), review(3)]);
    expect(summary.distribution[5]).toBe(3);
    expect(summary.distribution[4]).toBe(1);
    expect(summary.distribution[3]).toBe(1);
    expect(summary.distribution[1]).toBe(0);
  });
});
