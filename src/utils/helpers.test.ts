import { describe, expect, it } from 'vitest';
import { formatNumber } from './helpers';

describe('formatNumber', () => {
  it('returns "0" for non-finite inputs without throwing', () => {
    expect(formatNumber(NaN)).toBe('0');
    expect(formatNumber(Infinity)).toBe('0');
    expect(formatNumber(-Infinity)).toBe('0');
  });

  it('formats thousands as "k" with one decimal, trimming trailing .0', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(999)).toBe('999');
    expect(formatNumber(1000)).toBe('1k');
    expect(formatNumber(1234)).toBe('1.2k');
    expect(formatNumber(1500)).toBe('1.5k');
  });

  it('formats millions as "M" with one decimal, trimming trailing .0', () => {
    expect(formatNumber(1_000_000)).toBe('1M');
    expect(formatNumber(2_500_000)).toBe('2.5M');
    expect(formatNumber(12_345_678)).toBe('12.3M');
  });

  it('handles negative numbers using absolute magnitude', () => {
    expect(formatNumber(-1234)).toBe('-1.2k');
    expect(formatNumber(-2_500_000)).toBe('-2.5M');
  });
});
