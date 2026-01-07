/**
 * SubQuestion validation utilities
 *
 * 小問のバリデーション関数（形式別）
 */

import { SubQuestion, SelectionSubQuestion, MatchingSubQuestion, OrderingSubQuestion, EssaySubQuestion } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

/**
 * 基本的な小問バリデーション
 *
 * @param subQuestion - バリデーション対象の小問
 * @returns バリデーション結果
 */
export function validateSubQuestionBase(subQuestion: SubQuestion): ValidationResult {
  const errors: Record<string, string[]> = {};

  // contentの検証
  if (!subQuestion.content || subQuestion.content.trim().length === 0) {
    errors.content = ['小問の内容は必須です'];
  } else if (subQuestion.content.length > 5000) {
    errors.content = ['小問の内容は5000文字以下である必要があります'];
  }

  // formatの検証
  if (subQuestion.format !== 0 && subQuestion.format !== 1) {
    errors.format = ['形式は0（Markdown）または1（LaTeX）である必要があります'];
  }

  // questionTypeIdの検証 (0-based for core selection types)
  const validIds = [0, 1, 2, 3, 4, 10, 11, 12, 13, 14];
  if (!validIds.includes(subQuestion.questionTypeId)) {
    errors.questionTypeId = ['問題形式IDが不正です'];
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 選択問題のバリデーション（ID: 1, 2, 3）
 *
 * @param subQuestion - 選択問題小問
 * @returns バリデーション結果
 */
export function validateSelectionSubQuestion(
  subQuestion: SelectionSubQuestion
): ValidationResult {
  const baseResult = validateSubQuestionBase(subQuestion);

  if (!baseResult.isValid) {
    return baseResult;
  }

  const errors: Record<string, string[]> = {};

  // オプションの検証
  if (!subQuestion.options || subQuestion.options.length === 0) {
    errors.options = ['最低1つ以上のオプションが必要です'];
  } else if (subQuestion.options.length > 10) {
    errors.options = ['オプションは10個以下である必要があります'];
  } else {
    const optionErrors: string[] = [];

    subQuestion.options.forEach((option, index) => {
      if (!option.content || option.content.trim().length === 0) {
        optionErrors.push(`オプション${index + 1}の内容は必須です`);
      }
      if (option.content && option.content.length > 500) {
        optionErrors.push(`オプション${index + 1}は500文字以下である必要があります`);
      }
    });

    // 正解が1つ以上あるか確認
    const correctCount = subQuestion.options.filter((opt) => opt.isCorrect).length;
    if (correctCount === 0) {
      optionErrors.push('最低1つ以上の正解が必要です');
    }

    if (optionErrors.length > 0) {
      errors.options = optionErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * マッチング問題のバリデーション（ID: 4）
 *
 * @param subQuestion - マッチング問題小問
 * @returns バリデーション結果
 */
export function validateMatchingSubQuestion(
  subQuestion: MatchingSubQuestion
): ValidationResult {
  const baseResult = validateSubQuestionBase(subQuestion);

  if (!baseResult.isValid) {
    return baseResult;
  }

  const errors: Record<string, string[]> = {};

  // ペアの検証
  if (!subQuestion.pairs || subQuestion.pairs.length === 0) {
    errors.pairs = ['最低1つ以上のペアが必要です'];
  } else if (subQuestion.pairs.length > 20) {
    errors.pairs = ['ペアは20個以下である必要があります'];
  } else {
    const pairErrors: string[] = [];

    subQuestion.pairs.forEach((pair, index) => {
      if (!pair.question || pair.question.trim().length === 0) {
        pairErrors.push(`ペア${index + 1}の質問は必須です`);
      }
      if (pair.question && pair.question.length > 500) {
        pairErrors.push(`ペア${index + 1}の質問は500文字以下である必要があります`);
      }
      if (!pair.answer || pair.answer.trim().length === 0) {
        pairErrors.push(`ペア${index + 1}の答えは必須です`);
      }
      if (pair.answer && pair.answer.length > 500) {
        pairErrors.push(`ペア${index + 1}の答えは500文字以下である必要があります`);
      }
    });

    if (pairErrors.length > 0) {
      errors.pairs = pairErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 並び替え問題のバリデーション（ID: 5）
 *
 * @param subQuestion - 並び替え問題小問
 * @returns バリデーション結果
 */
export function validateOrderingSubQuestion(
  subQuestion: OrderingSubQuestion
): ValidationResult {
  const baseResult = validateSubQuestionBase(subQuestion);

  if (!baseResult.isValid) {
    return baseResult;
  }

  const errors: Record<string, string[]> = {};

  // アイテムの検証
  if (!subQuestion.items || subQuestion.items.length === 0) {
    errors.items = ['最低1つ以上のアイテムが必要です'];
  } else if (subQuestion.items.length > 20) {
    errors.items = ['アイテムは20個以下である必要があります'];
  } else {
    const itemErrors: string[] = [];

    subQuestion.items.forEach((item, index) => {
      if (!item.text || item.text.trim().length === 0) {
        itemErrors.push(`アイテム${index + 1}のテキストは必須です`);
      }
      if (item.text && item.text.length > 500) {
        itemErrors.push(`アイテム${index + 1}は500文字以下である必要があります`);
      }
      if (item.correctOrder === undefined || !Number.isInteger(item.correctOrder) || item.correctOrder < 0) {
        itemErrors.push(`アイテム${index + 1}の正答順序は0以上の整数である必要があります`);
      }
    });

    // 正答順序の一意性確認
    const orders = new Set(subQuestion.items.map((item) => item.correctOrder));
    if (orders.size !== subQuestion.items.length) {
      itemErrors.push('正答順序に重複があります');
    }

    if (itemErrors.length > 0) {
      errors.items = itemErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 記述問題のバリデーション（ID: 10-14）
 *
 * @param subQuestion - 記述問題小問
 * @returns バリデーション結果
 */
export function validateEssaySubQuestion(
  subQuestion: EssaySubQuestion
): ValidationResult {
  const baseResult = validateSubQuestionBase(subQuestion);

  if (!baseResult.isValid) {
    return baseResult;
  }

  const errors: Record<string, string[]> = {};

  // 答案の検証
  if (!subQuestion.answers || subQuestion.answers.length === 0) {
    errors.answers = ['最低1つ以上の答案例が必要です'];
  } else if (subQuestion.answers.length > 10) {
    errors.answers = ['答案例は10個以下である必要があります'];
  } else {
    const answerErrors: string[] = [];

    subQuestion.answers.forEach((answer, index) => {
      if (!answer.sampleAnswer || answer.sampleAnswer.trim().length === 0) {
        answerErrors.push(`答案例${index + 1}は必須です`);
      }
      if (answer.sampleAnswer && answer.sampleAnswer.length > 2000) {
        answerErrors.push(`答案例${index + 1}は2000文字以下である必要があります`);
      }
      if (answer.gradingCriteria && answer.gradingCriteria.length > 500) {
        answerErrors.push(`採点基準${index + 1}は500文字以下である必要があります`);
      }
      if (answer.pointValue === undefined || !Number.isInteger(answer.pointValue) || answer.pointValue < 0) {
        answerErrors.push(`配点${index + 1}は0以上の整数である必要があります`);
      }
    });

    if (answerErrors.length > 0) {
      errors.answers = answerErrors;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * 小問の形式に応じた動的バリデーション
 *
 * @param subQuestion - バリデーション対象の小問
 * @returns バリデーション結果
 */
export function validateSubQuestion(
  subQuestion: SubQuestion
): ValidationResult {
  const questionTypeId = subQuestion.questionTypeId;

  // 選択問題（ID: 0, 1, 2） (shifted to 0-based)
  if ([0, 1, 2].includes(questionTypeId)) {
    return validateSelectionSubQuestion(subQuestion as SelectionSubQuestion);
  }

  // マッチング（ID: 3） (was 4)
  if (questionTypeId === 3) {
    return validateMatchingSubQuestion(subQuestion as MatchingSubQuestion);
  }

  // 並び替え（ID: 4） (was 5)
  if (questionTypeId === 4) {
    return validateOrderingSubQuestion(subQuestion as OrderingSubQuestion);
  }

  // 記述問題（ID: 10-14）
  if ([10, 11, 12, 13, 14].includes(questionTypeId)) {
    return validateEssaySubQuestion(subQuestion as EssaySubQuestion);
  }

  // 不正な形式
  return {
    isValid: false,
    errors: { questionTypeId: ['不明な問題形式です'] },
  };
}

/**
 * 複数の小問をバリデーション
 *
 * @param subQuestions - バリデーション対象の小問配列
 * @returns バリデーション結果の配列（インデックス付き）
 */
export function validateSubQuestions(
  subQuestions: SubQuestion[]
): Array<ValidationResult & { index: number }> {
  return subQuestions.map((sq, index) => ({
    ...validateSubQuestion(sq),
    index,
  }));
}

/**
 * バリデーション結果をまとめる
 *
 * @param results - バリデーション結果の配列
 * @returns まとめたバリデーション結果
 */
export function mergeValidationResults(
  results: Array<ValidationResult & { index: number }>
): ValidationResult & { itemErrors: Map<number, Record<string, string[]>> } {
  const itemErrors = new Map<number, Record<string, string[]>>();
  const globalErrors: Record<string, string[]> = {};
  let isValid = true;

  results.forEach((result) => {
    if (!result.isValid) {
      isValid = false;
      itemErrors.set(result.index, result.errors);
    }
  });

  return {
    isValid,
    errors: globalErrors,
    itemErrors,
  };
}
