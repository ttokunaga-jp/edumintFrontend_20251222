import { describe, it, expect } from 'vitest';
import { getEnumOptions } from '@/lib/i18nHelpers';

describe('getEnumOptions', () => {
  it('returns numeric values and uses t() to label', () => {
    const t = (k: string) => k; // identity translator for test
    const opts = getEnumOptions('questionType', t as any);
    expect(Array.isArray(opts)).toBe(true);
    expect(opts.length).toBeGreaterThan(0);
    for (const opt of opts) {
      expect(typeof opt.value).toBe('number');
      expect(typeof opt.label).toBe('string');
      expect(opt.label).toMatch(/^enum\.questionType\./);
    }
  });

  it('includes sort_order options with correct ids and i18n keys', () => {
    const t = (k: string) => k; // identity translator
    const opts = getEnumOptions('sort_order', t as any);
    expect(Array.isArray(opts)).toBe(true);
    // should contain ids 0..3
    const ids = opts.map((o) => o.value).sort((a, b) => a - b);
    expect(ids).toEqual([0, 1, 2, 3]);
    // labels should point to enum.sort_order.* keys
    const labels = opts.map((o) => o.label);
    expect(labels).toEqual(expect.arrayContaining([
      'enum.sort_order.recommended',
      'enum.sort_order.latest',
      'enum.sort_order.popular',
      'enum.sort_order.most_viewed'
    ]));
  });
});
