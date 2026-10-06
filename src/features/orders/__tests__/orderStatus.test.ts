import { PRODUCT_SORT_LABELS } from '../../../types/product';
import { statusLabel } from '../../../components/common/StatusBadge';
import type { OrderStatus } from '../../../types/order';

describe('order status labels', () => {
  it('labels every status a customer can see', () => {
    const expected: Record<OrderStatus, string> = {
      placed: 'Placed',
      packed: 'Packed',
      out_for_delivery: 'In Transit',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    (Object.keys(expected) as OrderStatus[]).forEach((status) => {
      expect(statusLabel(status)).toBe(expected[status]);
    });
  });
});

describe('product sort labels', () => {
  it('exposes a label for every sort option', () => {
    expect(PRODUCT_SORT_LABELS.popular).toBe('Popular');
    expect(PRODUCT_SORT_LABELS.price_asc).toBe('Price: Low to High');
    expect(PRODUCT_SORT_LABELS.price_desc).toBe('Price: High to Low');
  });
});
