import { describe, it, expect } from 'vitest';
import { getEnumOptions, getEnumLabel } from '@/lib/i18nHelpers';

// NOTE: file name retained for history; test covers `major_field` mapping now

describe('academic_field enum mappings', () => {
  it('getEnumOptions returns numeric values and i18n keys for academic_field', () => {
    const t = (k: string) => k; // identity translator for test
    const opts = getEnumOptions('academic_field', t as any);
    expect(Array.isArray(opts)).toBe(true);
    // expect at least the entries we defined (00..06, 10..16, 20..26)
    expect(opts.length).toBeGreaterThanOrEqual(16);
    // check that at least one known id exists
    const has00 = opts.some((o) => o.value === 0 && o.label === 'enum.academic_field.00');
    const has10 = opts.some((o) => o.value === 10 && o.label === 'enum.academic_field.10');
    const has20 = opts.some((o) => o.value === 20 && o.label === 'enum.academic_field.20');
    expect(has00).toBe(true);
    expect(has10).toBe(true);
    expect(has20).toBe(true);
  });

  it('getEnumLabel resolves a academic_field i18n key via t()', () => {
    const t = (k: string) => `translated:${k}`;
    expect(getEnumLabel('academic_field', 0, t as any)).toBe('translated:enum.academic_field.00');
    expect(getEnumLabel('academic_field', 15, t as any)).toBe('translated:enum.academic_field.15');
  });
});
