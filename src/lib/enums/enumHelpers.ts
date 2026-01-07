/**
 * Enum Helper Utilities
 * Converts enumMappings.ts to selectionOptions format for UI rendering
 */

import type { EnumMap, EnumEntry } from './types';
import { DEFAULT_ENUM_MAPPINGS } from './enumMappings';

export interface SelectOption {
  id: string;
  value: number;
  labelKey: string;
}

/**
 * Converts an EnumMap (from enumMappings.ts) to selectionOptions format
 * @param enumMap - Map from enumMappings.ts
 * @param enumName - Name of the enum (e.g., 'questionType', 'level')
 * @returns Array of SelectOption objects ready for UI components
 */
export function mapEnumToSelectionOptions(
  enumMap: EnumMap,
  enumName: string
): SelectOption[] {
  const options: SelectOption[] = [];

  // Sort by order property to maintain consistent display order
  const sortedEntries = Array.from(enumMap.entries()).sort(
    (a, b) => (a[1].order ?? 0) - (b[1].order ?? 0)
  );

  sortedEntries.forEach(([id, entry]) => {
    options.push({
      id: `${enumName}.${id}`,
      value: id,
      labelKey: entry.i18nKey,
    });
  });

  return options;
}

/**
 * Get selectionOptions directly from enumMappings.ts
 * This is the primary interface for UI components
 */
export const getEnumSelectionOptions = (enumName: keyof typeof DEFAULT_ENUM_MAPPINGS) => {
  return mapEnumToSelectionOptions(
    DEFAULT_ENUM_MAPPINGS[enumName],
    enumName
  );
};

// Pre-computed selectionOptions from enumMappings.ts (can be cached)
export const QUESTION_TYPE_OPTIONS = getEnumSelectionOptions('questionType');
export const LEVEL_ENUM_OPTIONS = getEnumSelectionOptions('level');
export const EXAM_TYPE_ENUM_OPTIONS = getEnumSelectionOptions('examType');
export const PERIOD_ENUM_OPTIONS = getEnumSelectionOptions('period');
export const DURATION_ENUM_OPTIONS = getEnumSelectionOptions('duration');
export const LANGUAGE_ENUM_OPTIONS = getEnumSelectionOptions('language');
export const ACADEMIC_FIELD_ENUM_OPTIONS = getEnumSelectionOptions('academic_field');
export const ACADEMIC_TRACK_ENUM_OPTIONS = getEnumSelectionOptions('academic_track');
export const SORT_ORDER_ENUM_OPTIONS = getEnumSelectionOptions('sort_order');

/**
 * Get i18n label key for a specific enum value
 */
export const getEnumLabelKey = (enumName: keyof typeof DEFAULT_ENUM_MAPPINGS, id: number): string | undefined => {
  return DEFAULT_ENUM_MAPPINGS[enumName].get(id)?.i18nKey;
};

/**
 * Mock Data Generation Utilities
 * These functions are used to generate type-safe mock data from enumMappings.ts
 * Eliminates magic strings and hardcoded values
 */

/**
 * Get all valid numeric IDs for an enum
 */
export const getEnumIds = (enumName: keyof typeof DEFAULT_ENUM_MAPPINGS): number[] => {
  return Array.from(DEFAULT_ENUM_MAPPINGS[enumName].keys());
};

/**
 * Get a random enum ID from valid options
 */
export const getRandomEnumId = (enumName: keyof typeof DEFAULT_ENUM_MAPPINGS): number => {
  const ids = getEnumIds(enumName);
  return ids[Math.floor(Math.random() * ids.length)];
};

/**
 * Get all valid numeric IDs for an enum (sorted by order property)
 */
export const getOrderedEnumIds = (enumName: keyof typeof DEFAULT_ENUM_MAPPINGS): number[] => {
  return Array.from(DEFAULT_ENUM_MAPPINGS[enumName].entries())
    .sort((a, b) => (a[1].order ?? 0) - (b[1].order ?? 0))
    .map(([id]) => id);
};

/**
 * Create label mappings from enum for data generation
 * Returns a Map of numeric ID -> label (for logging/debugging only)
 * NOTE: For UI rendering, always use i18n keys via enumMappings.ts
 */
export const createEnumLabelMap = (enumName: keyof typeof DEFAULT_ENUM_MAPPINGS): Record<number, string> => {
  const map: Record<number, string> = {};
  DEFAULT_ENUM_MAPPINGS[enumName].forEach((entry, id) => {
    map[id] = entry.i18nKey;
  });
  return map;
};

/**
 * Pre-computed label maps from enumMappings.ts (for mock data generation)
 * These ensure data generation uses authoritative enum definitions
 */
export const ENUM_LABEL_MAPS = {
  questionType: createEnumLabelMap('questionType'),
  academic_field: createEnumLabelMap('academic_field'),
  level: createEnumLabelMap('level'),
  examType: createEnumLabelMap('examType'),
  period: createEnumLabelMap('period'),
  duration: createEnumLabelMap('duration'),
  academic_track: createEnumLabelMap('academic_track'),
  sort_order: createEnumLabelMap('sort_order'),
  language: createEnumLabelMap('language'),
};
