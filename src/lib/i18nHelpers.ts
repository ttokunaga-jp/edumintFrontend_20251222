import { TFunction } from 'i18next';
import DEFAULT_ENUM_MAPPINGS from './enums/enumMappings';
import type { EnumName, EnumId, EnumEntry } from './enums/types';

// Runtime overrides (server-provided or client edits). Use Maps to preserve numeric keys.
const runtimeOverrides: Partial<Record<string, Map<number, EnumEntry>>> = {};

export function getEnumEntry(enumName: EnumName, id: number): EnumEntry | undefined {
  const overrides = runtimeOverrides[enumName];
  if (overrides && overrides.has(id)) return overrides.get(id);
  const base = DEFAULT_ENUM_MAPPINGS[enumName];
  if (!base) return undefined;
  return base.get(id);
}

export function getEnumLabel(enumName: EnumName, id: number, t: TFunction): string {
  const entry = getEnumEntry(enumName, id);
  if (!entry) return String(id);
  return t(entry.i18nKey);
}

export function setClientEnumEntry(enumName: EnumName, id: number, entry: EnumEntry) {
  if (!runtimeOverrides[enumName]) runtimeOverrides[enumName] = new Map<number, EnumEntry>();
  runtimeOverrides[enumName]!.set(id, entry);
}

export function mergeServerMappings(enumName: EnumName, map: Record<number, EnumEntry> | Array<[number, EnumEntry]>) {
  if (!runtimeOverrides[enumName]) runtimeOverrides[enumName] = new Map<number, EnumEntry>();
  const target = runtimeOverrides[enumName]!;
  if (Array.isArray(map)) {
    for (const [k, v] of map) target.set(Number(k), v);
  } else {
    for (const k of Object.keys(map)) {
      target.set(Number(k), (map as any)[k]);
    }
  }
}

// Helper to list options for UI consumption (ensures numeric IDs)
export function getEnumOptions(enumName: EnumName, t: TFunction) {
  const base = DEFAULT_ENUM_MAPPINGS[enumName] ?? new Map<number, EnumEntry>();
  const overrides = runtimeOverrides[enumName] ?? new Map<number, EnumEntry>();
  // merge (overrides wins)
  const merged = new Map<number, EnumEntry>(base);
  for (const [k, v] of overrides) merged.set(k, v);

  // return array sorted by entry.order
  return Array.from(merged.entries())
    .map(([id, entry]) => ({ value: id, label: t(entry.i18nKey), order: entry.order ?? 0 }))
    .sort((a, b) => (a.order - b.order));
}
