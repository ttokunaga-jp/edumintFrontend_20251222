/**
 * Question type configuration
 *
 * 問題形式の定義（ID、名前、アイコン、説明）
 */

export interface QuestionTypeConfig {
  id: number;
  label: string;
  description: string;
  icon?: string;
  category: 'selection' | 'matching' | 'ordering' | 'essay';
}

export const QUESTION_TYPE_CONFIGS: Record<number, QuestionTypeConfig> = {
  // Selection type (ID: 1-3)
  1: {
    id: 1,
    label: '単一選択',
    description: '1つの正解を選ぶ形式',
    category: 'selection',
  },
  2: {
    id: 2,
    label: '複数選択',
    description: '複数の正解を選ぶ形式',
    category: 'selection',
  },
  3: {
    id: 3,
    label: '正誤判定',
    description: '正誤を判定する形式',
    category: 'selection',
  },

  // Matching type (ID: 4)
  4: {
    id: 4,
    label: '組み合わせ',
    description: 'ペアマッチング形式',
    category: 'matching',
  },

  // Ordering type (ID: 5)
  5: {
    id: 5,
    label: '順序並べ替え',
    description: '正しい順序に並べ替える形式',
    category: 'ordering',
  },

  // Essay types (ID: 10-14)
  10: {
    id: 10,
    label: '記述式',
    description: '自由記述形式',
    category: 'essay',
  },
  11: {
    id: 11,
    label: '証明問題',
    description: '数学的証明を記述する形式',
    category: 'essay',
  },
  12: {
    id: 12,
    label: 'コード記述',
    description: 'プログラムコードを記述する形式',
    category: 'essay',
  },
  13: {
    id: 13,
    label: '翻訳',
    description: '言語翻訳を記述する形式',
    category: 'essay',
  },
  14: {
    id: 14,
    label: '数値計算',
    description: '数値計算結果を記述する形式',
    category: 'essay',
  },
};

export function getQuestionTypeConfig(typeId: number): QuestionTypeConfig | undefined {
  return QUESTION_TYPE_CONFIGS[typeId];
}

export function getQuestionTypeLabel(typeId: number): string {
  return QUESTION_TYPE_CONFIGS[typeId]?.label || '不明な形式';
}

export function getQuestionTypesByCategory(category: QuestionTypeConfig['category']): QuestionTypeConfig[] {
  return Object.values(QUESTION_TYPE_CONFIGS).filter((config) => config.category === category);
}
