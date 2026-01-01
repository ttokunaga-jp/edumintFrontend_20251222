/**
 * SubQuestion normalization utilities
 *
 * 小問のデータ正規化関数（形式別）
 */

import {
  SubQuestion,
  SelectionSubQuestion,
  MatchingSubQuestion,
  OrderingSubQuestion,
  EssaySubQuestion,
} from '../types';

/**
 * テキストの基本正規化
 */
function normalizeText(text: string): string {
  return (
    text
      .trim()
      .replace(/\n\n+/g, '\n\n')
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+$/gm, '')
      .replace(/([^\$])\s{2,}([^\$])/g, '$1 $2')
  );
}

/**
 * LaTeX形式テキストの正規化
 */
function normalizeLatex(text: string): string {
  let result = normalizeText(text);
  result = result.replace(/\$\s+/g, '$');
  result = result.replace(/\s+\$/g, '$');
  result = result.replace(/\s(\$[^$\n]+\$)\s/g, ' $1 ');
  result = result.replace(/(\$\$)\s+/g, '$1');
  result = result.replace(/\s+(\$\$)/g, '$1');
  return result;
}

/**
 * Markdown形式テキストの正規化
 */
function normalizeMarkdown(text: string): string {
  let result = normalizeText(text);
  result = result.replace(/`\s+/g, '`');
  result = result.replace(/\s+`/g, '`');
  result = result.replace(/^(\s*)([-*+])\s+/gm, '$1$2 ');
  result = result.replace(/^(#+)\s+/gm, '$1 ');
  return result;
}

/**
 * 小問コンテンツの正規化
 *
 * @param content - 正規化対象のコンテンツ
 * @param format - 形式（0: Markdown, 1: LaTeX）
 * @returns 正規化済みコンテンツ
 */
export function normalizeSubQuestionContent(
  content: string,
  format: 0 | 1
): string {
  const normalizer = format === 1 ? normalizeLatex : normalizeMarkdown;
  return normalizer(content);
}

/**
 * 基本的な小問の正規化
 *
 * @param subQuestion - 正規化対象の小問
 * @returns 正規化済み小問
 */
export function normalizeSubQuestionBase(subQuestion: SubQuestion): SubQuestion {
  const normalizer = subQuestion.format === 1 ? normalizeLatex : normalizeMarkdown;

  return {
    ...subQuestion,
    content: normalizer(subQuestion.content),
  };
}

/**
 * 選択問題の正規化（ID: 1, 2, 3）
 *
 * @param subQuestion - 選択問題小問
 * @returns 正規化済み選択問題小問
 */
export function normalizeSelectionSubQuestion(
  subQuestion: SelectionSubQuestion
): SelectionSubQuestion {
  const normalizer = subQuestion.format === 1 ? normalizeLatex : normalizeMarkdown;

  return {
    ...subQuestion,
    content: normalizer(subQuestion.content),
    options: subQuestion.options.map((opt) => ({
      ...opt,
      content: normalizer(opt.content),
    })),
  };
}

/**
 * マッチング問題の正規化（ID: 4）
 *
 * @param subQuestion - マッチング問題小問
 * @returns 正規化済みマッチング問題小問
 */
export function normalizeMatchingSubQuestion(
  subQuestion: MatchingSubQuestion
): MatchingSubQuestion {
  const normalizer = subQuestion.format === 1 ? normalizeLatex : normalizeMarkdown;

  return {
    ...subQuestion,
    content: normalizer(subQuestion.content),
    pairs: subQuestion.pairs.map((pair) => ({
      ...pair,
      question: normalizer(pair.question),
      answer: normalizer(pair.answer),
    })),
  };
}

/**
 * 並び替え問題の正規化（ID: 5）
 *
 * @param subQuestion - 並び替え問題小問
 * @returns 正規化済み並び替え問題小問
 */
export function normalizeOrderingSubQuestion(
  subQuestion: OrderingSubQuestion
): OrderingSubQuestion {
  const normalizer = subQuestion.format === 1 ? normalizeLatex : normalizeMarkdown;

  return {
    ...subQuestion,
    content: normalizer(subQuestion.content),
    items: subQuestion.items.map((item) => ({
      ...item,
      text: normalizer(item.text),
    })),
  };
}

/**
 * 記述問題の正規化（ID: 10-14）
 *
 * @param subQuestion - 記述問題小問
 * @returns 正規化済み記述問題小問
 */
export function normalizeEssaySubQuestion(
  subQuestion: EssaySubQuestion
): EssaySubQuestion {
  const normalizer = subQuestion.format === 1 ? normalizeLatex : normalizeMarkdown;

  return {
    ...subQuestion,
    content: normalizer(subQuestion.content),
    answers: subQuestion.answers.map((ans) => ({
      ...ans,
      sampleAnswer: normalizer(ans.sampleAnswer),
      gradingCriteria: ans.gradingCriteria ? normalizer(ans.gradingCriteria) : ans.gradingCriteria,
    })),
  };
}

/**
 * 小問の形式に応じた動的正規化
 *
 * @param subQuestion - 正規化対象の小問
 * @returns 正規化済み小問
 */
export function normalizeSubQuestion(
  subQuestion: SubQuestion
): SubQuestion {
  const questionTypeId = subQuestion.questionTypeId;

  // 選択問題（ID: 1, 2, 3）
  if ([1, 2, 3].includes(questionTypeId)) {
    return normalizeSelectionSubQuestion(subQuestion as SelectionSubQuestion);
  }

  // マッチング（ID: 4）
  if (questionTypeId === 4) {
    return normalizeMatchingSubQuestion(subQuestion as MatchingSubQuestion);
  }

  // 並び替え（ID: 5）
  if (questionTypeId === 5) {
    return normalizeOrderingSubQuestion(subQuestion as OrderingSubQuestion);
  }

  // 記述問題（ID: 10-14）
  if ([10, 11, 12, 13, 14].includes(questionTypeId)) {
    return normalizeEssaySubQuestion(subQuestion as EssaySubQuestion);
  }

  // デフォルト: 基本正規化
  return normalizeSubQuestionBase(subQuestion);
}

/**
 * 複数の小問を正規化
 *
 * @param subQuestions - 正規化対象の小問配列
 * @returns 正規化済み小問配列
 */
export function normalizeSubQuestions(subQuestions: SubQuestion[]): SubQuestion[] {
  return subQuestions.map((sq) => normalizeSubQuestion(sq));
}

/**
 * 選択問題オプションの正規化と重複排除
 *
 * @param options - オプション配列
 * @param format - 形式
 * @param removeDuplicates - 重複排除するか（デフォルト: false）
 * @returns 正規化済みオプション配列
 */
export function normalizeSelectionOptions(
  options: Array<{ id: string; content: string; isCorrect: boolean; order: number }>,
  format: 0 | 1,
  removeDuplicates: boolean = false
) {
  const normalizer = format === 1 ? normalizeLatex : normalizeMarkdown;
  const normalized = options.map((opt) => ({
    ...opt,
    content: normalizer(opt.content),
  }));

  if (!removeDuplicates) {
    return normalized;
  }

  // コンテンツの大文字小文字を区別せずに重複排除
  const seen = new Set<string>();
  return normalized.filter((opt) => {
    const lower = opt.content.toLowerCase();
    if (seen.has(lower)) {
      return false;
    }
    seen.add(lower);
    return true;
  });
}

/**
 * マッチング問題ペアの正規化
 *
 * @param pairs - ペア配列
 * @param format - 形式
 * @returns 正規化済みペア配列
 */
export function normalizeMatchingPairs(
  pairs: Array<{ id: string; question: string; answer: string; order: number }>,
  format: 0 | 1
) {
  const normalizer = format === 1 ? normalizeLatex : normalizeMarkdown;
  return pairs.map((pair) => ({
    ...pair,
    question: normalizer(pair.question),
    answer: normalizer(pair.answer),
  }));
}

/**
 * 並び替え問題アイテムの正規化
 *
 * @param items - アイテム配列
 * @param format - 形式
 * @returns 正規化済みアイテム配列
 */
export function normalizeOrderingItems(
  items: Array<{ id: string; text: string; correctOrder: number }>,
  format: 0 | 1
) {
  const normalizer = format === 1 ? normalizeLatex : normalizeMarkdown;
  return items.map((item) => ({
    ...item,
    text: normalizer(item.text),
  }));
}

/**
 * 記述問題答案の正規化
 *
 * @param answers - 答案配列
 * @param format - 形式
 * @returns 正規化済み答案配列
 */
export function normalizeEssayAnswers(
  answers: Array<{
    id: string;
    sampleAnswer: string;
    gradingCriteria: string;
    pointValue: number;
  }>,
  format: 0 | 1
) {
  const normalizer = format === 1 ? normalizeLatex : normalizeMarkdown;
  return answers.map((ans) => ({
    ...ans,
    sampleAnswer: normalizer(ans.sampleAnswer),
    gradingCriteria: normalizer(ans.gradingCriteria),
  }));
}

/**
 * 小問の差分抽出
 *
 * @param original - オリジナルデータ
 * @param updated - 更新後データ
 * @returns 変更があったフィールド名の配列
 */
export function getSubQuestionDifferences(
  original: SubQuestion,
  updated: SubQuestion
): string[] {
  const differences: string[] = [];

  if (original.content !== updated.content) differences.push('content');
  if (original.format !== updated.format) differences.push('format');
  if (original.questionTypeId !== updated.questionTypeId)
    differences.push('questionTypeId');

  // 形式固有フィールドの比較
  if ('options' in original && 'options' in updated) {
    if (JSON.stringify(original.options) !== JSON.stringify(updated.options))
      differences.push('options');
  }

  if ('pairs' in original && 'pairs' in updated) {
    if (JSON.stringify(original.pairs) !== JSON.stringify(updated.pairs))
      differences.push('pairs');
  }

  if ('items' in original && 'items' in updated) {
    if (JSON.stringify(original.items) !== JSON.stringify(updated.items))
      differences.push('items');
  }

  if ('answers' in original && 'answers' in updated) {
    if (JSON.stringify(original.answers) !== JSON.stringify(updated.answers))
      differences.push('answers');
  }

  return differences;
}
