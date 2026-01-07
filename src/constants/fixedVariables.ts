// Centralized fixed variables and enum-like mappings used across the client
// All enum definitions are derived from src/lib/enums/enumMappings.ts
// This ensures a single source of truth for enum values

import { DEFAULT_ENUM_MAPPINGS, getOrderedEnumIds, ENUM_LABEL_MAPS } from '@/lib/enums/enumHelpers';

/**
 * Exam Type: Numeric IDs (0-2)
 * 0: 定期試験 (Regular Exam)
 * 1: 授業内試験 (In-class Exam)
 * 2: 小テスト (Quiz)
 */
export const EXAM_TYPE_COLORS: Record<number, { bg: string; text: string }> = {
  0: { bg: '#1565c0', text: '#ffffff' }, // 定期試験：濃青
  1: { bg: '#c62828', text: '#ffffff' }, // 授業内試験：濃赤
  2: { bg: '#2e7d32', text: '#ffffff' }, // 小テスト：濃緑
};

export const EXAM_TYPE_LABELS: Record<number, string> = {
  0: 'enum.exam.regular',    // i18n key
  1: 'enum.exam.class',      // i18n key
  2: 'enum.exam.quiz',       // i18n key
};

/**
 * Level: Numeric IDs (0-2)
 * 0: basic (基本)
 * 1: standard (標準)
 * 2: advanced (応用)
 */
export const LEVELS: Record<number, string> = {
  0: 'enum.level.basic',
  1: 'enum.level.standard',
  2: 'enum.level.advanced',
};

/**
 * Problem Format / Question Type: Numeric IDs (0-4, 10-14)
 * Derived from enumMappings.ts questionType
 */
export const PROBLEM_FORMATS: Record<number, string> = {
  0: 'enum.questionType.0',
  1: 'enum.questionType.1',
  2: 'enum.questionType.2',
  3: 'enum.questionType.3',
  4: 'enum.questionType.4',
  10: 'enum.questionType.10',
  11: 'enum.questionType.11',
  12: 'enum.questionType.12',
  13: 'enum.questionType.13',
  14: 'enum.questionType.14',
};

/**
 * Academic Field: Numeric IDs (0-6, 10-16, 20-26)
 * Derived from enumMappings.ts academic_field
 */
export const ACADEMIC_FIELDS: Record<number, string> = {
  // A. 文系・人文社会グループ (00 ~ 06)
  0: 'enum.academic_field.00',
  1: 'enum.academic_field.01',
  2: 'enum.academic_field.02',
  3: 'enum.academic_field.03',
  4: 'enum.academic_field.04',
  5: 'enum.academic_field.05',
  6: 'enum.academic_field.06',
  // B. 理工・情報グループ (10 ~ 16)
  10: 'enum.academic_field.10',
  11: 'enum.academic_field.11',
  12: 'enum.academic_field.12',
  13: 'enum.academic_field.13',
  14: 'enum.academic_field.14',
  15: 'enum.academic_field.15',
  16: 'enum.academic_field.16',
  // C. 農学・医療・生活・芸術グループ (20 ~ 26)
  20: 'enum.academic_field.20',
  21: 'enum.academic_field.21',
  22: 'enum.academic_field.22',
  23: 'enum.academic_field.23',
  24: 'enum.academic_field.24',
  25: 'enum.academic_field.25',
  26: 'enum.academic_field.26',
};

/**
 * Language: Numeric IDs (0-4)
 * 0: ja (Japanese)
 * 1: en (English)
 * 2: zh (Chinese)
 * 3: ko (Korean)
 * 4: other
 */
export const LANGUAGES: Record<number, string> = {
  0: 'enum.lang.ja',
  1: 'enum.lang.en',
  2: 'enum.lang.zh',
  3: 'enum.lang.ko',
  4: 'enum.lang.other',
};

/**
 * Learned Status: Numeric IDs (0-2)
 */
export const LEARNED_STATUS: Record<number, string> = {
  0: 'not_learned',
  1: 'learning',
  2: 'learned',
};

/**
 * Valid Exam Type IDs from enumMappings.ts
 * Dynamically generated from examType enum
 */
export const ALLOWED_EXAM_TYPE_IDS = getOrderedEnumIds('examType');

/**
 * Valid Question Type / Problem Format IDs from enumMappings.ts
 * Dynamically generated from questionType enum
 */
export const ALLOWED_QUESTION_TYPE_IDS = getOrderedEnumIds('questionType');

/**
 * Valid Level IDs from enumMappings.ts
 * Dynamically generated from level enum
 */
export const ALLOWED_LEVEL_IDS = getOrderedEnumIds('level');

/**
 * Valid Period IDs from enumMappings.ts
 * Dynamically generated from period enum
 */
export const ALLOWED_PERIOD_IDS = getOrderedEnumIds('period');

/**
 * Valid Duration IDs from enumMappings.ts
 * Dynamically generated from duration enum
 */
export const ALLOWED_DURATION_IDS = getOrderedEnumIds('duration');

/**
 * Valid Language IDs from enumMappings.ts
 * Dynamically generated from language enum
 */
export const ALLOWED_LANGUAGE_IDS = getOrderedEnumIds('language');

export default {
  EXAM_TYPE_COLORS,
  EXAM_TYPE_LABELS,
  LEVELS,
  PROBLEM_FORMATS,
  ACADEMIC_FIELDS,
  LANGUAGES,
  LEARNED_STATUS,
  ALLOWED_EXAM_TYPE_IDS,
  ALLOWED_QUESTION_TYPE_IDS,
  ALLOWED_LEVEL_IDS,
  ALLOWED_PERIOD_IDS,
  ALLOWED_DURATION_IDS,
  ALLOWED_LANGUAGE_IDS,
};
