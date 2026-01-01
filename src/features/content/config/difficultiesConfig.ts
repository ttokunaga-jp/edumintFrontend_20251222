/**
 * Difficulty configuration
 *
 * 難易度の定義
 */

import { Difficulty } from '../types/problem';

export const DIFFICULTY_LEVELS: Record<number, Difficulty> = {
  1: {
    id: 1,
    label: '超簡単',
    level: 1,
  },
  2: {
    id: 2,
    label: '簡単',
    level: 2,
  },
  3: {
    id: 3,
    label: '普通',
    level: 3,
  },
  4: {
    id: 4,
    label: '難しい',
    level: 4,
  },
  5: {
    id: 5,
    label: '非常に難しい',
    level: 5,
  },
};

export const DIFFICULTY_OPTIONS = Object.values(DIFFICULTY_LEVELS);

export function getDifficultyLabel(level: number): string {
  return DIFFICULTY_LEVELS[level]?.label || '未定義';
}

export function getDifficultyByLevel(level: number): Difficulty | undefined {
  return DIFFICULTY_LEVELS[level];
}

/**
 * Difficulty color mapping for UI
 */
export const DIFFICULTY_COLORS: Record<number, string> = {
  1: '#4caf50', // green
  2: '#8bc34a', // light green
  3: '#ffc107', // amber
  4: '#ff9800', // orange
  5: '#f44336', // red
};

export function getDifficultyColor(level: number): string {
  return DIFFICULTY_COLORS[level] || '#999999';
}
