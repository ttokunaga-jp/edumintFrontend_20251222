/**
 * Features Layer - Utils
 *
 * 検証・正規化ユーティリティの再エクスポート
 */

// Question validation exports
export {
  validateQuestion,
  validateQuestionForm,
  validateLatexSyntax,
  validateKeywordsDuplicate,
  validateQuestionComprehensive,
} from './validateQuestion';
export type { ValidationResult } from './validateQuestion';

// Question normalization exports
export {
  normalizeQuestion,
  normalizeQuestionContent,
  normalizeKeywords,
  normalizeQuestionComprehensive,
  getQuestionDifferences,
} from './normalizeQuestion';

// SubQuestion validation exports
export {
  validateSubQuestionBase,
  validateSelectionSubQuestion,
  validateMatchingSubQuestion,
  validateOrderingSubQuestion,
  validateEssaySubQuestion,
  validateSubQuestion,
  validateSubQuestions,
  mergeValidationResults,
} from './validateSubQuestion';

// SubQuestion normalization exports
export {
  normalizeSubQuestionContent,
  normalizeSubQuestionBase,
  normalizeSelectionSubQuestion,
  normalizeMatchingSubQuestion,
  normalizeOrderingSubQuestion,
  normalizeEssaySubQuestion,
  normalizeSubQuestion,
  normalizeSubQuestions,
  normalizeSelectionOptions,
  normalizeMatchingPairs,
  normalizeOrderingItems,
  normalizeEssayAnswers,
  getSubQuestionDifferences,
} from './normalizeSubQuestion';
