import { formatDate, timeAgo, toDate } from '../date';

describe('toDate', () => {
  it('converts a Firestore-style timestamp', () => {
    const date = toDate({ seconds: 1750000000, nanoseconds: 0 });
    expect(date).toBeInstanceOf(Date);
    expect(date?.getFullYear()).toBe(2025);
  });

  it('passes through Date instances', () => {
    const input = new Date(2026, 8, 28);
    expect(toDate(input)).toBe(input);
  });

  it('returns null for missing values', () => {
    expect(toDate(null)).toBeNull();
    expect(toDate(undefined)).toBeNull();
  });
});

describe('formatDate', () => {
  it('formats as "28 Sep 2026"', () => {
    expect(formatDate(new Date(2026, 8, 28))).toBe('28 Sep 2026');
  });

  it('returns an empty string without a value', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('timeAgo', () => {
  const now = Date.now();

  function minutesAgo(minutes: number) {
    return new Date(now - minutes * 60 * 1000);
  }

  it('describes recent moments', () => {
    expect(timeAgo(new Date(now - 5000))).toBe('just now');
    expect(timeAgo(minutesAgo(5))).toBe('5m ago');
    expect(timeAgo(minutesAgo(90))).toBe('1h ago');
  });

  it('switches to days and weeks', () => {
    expect(timeAgo(minutesAgo(60 * 24 * 2))).toBe('2d ago');
    expect(timeAgo(minutesAgo(60 * 24 * 14))).toBe('2w ago');
  });

  it('falls back to a full date for older items', () => {
    expect(timeAgo(new Date(2026, 0, 5))).toBe('5 Jan 2026');
  });
});
