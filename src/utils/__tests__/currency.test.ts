import { formatPrice } from '../currency';

describe('formatPrice', () => {
  it('formats plain amounts', () => {
    expect(formatPrice(950)).toBe('Rs. 950');
  });

  it('groups thousands with commas', () => {
    expect(formatPrice(1250)).toBe('Rs. 1,250');
    expect(formatPrice(1450)).toBe('Rs. 1,450');
    expect(formatPrice(2700)).toBe('Rs. 2,700');
    expect(formatPrice(1234567)).toBe('Rs. 1,234,567');
  });

  it('rounds fractional amounts to whole rupees', () => {
    expect(formatPrice(99.6)).toBe('Rs. 100');
    expect(formatPrice(99.4)).toBe('Rs. 99');
  });

  it('keeps a minus sign for negative amounts', () => {
    expect(formatPrice(-2500)).toBe('Rs. -2,500');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('Rs. 0');
  });
});
