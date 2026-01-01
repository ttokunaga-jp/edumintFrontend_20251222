import React, { useState, useCallback, useEffect } from 'react';
import { Paper, Stack, Alert, CircularProgress, Box } from '@mui/material';
import { SubQuestionBlockContent } from '../SubQuestionBlock/SubQuestionBlockContent';
import { SubQuestionBlockAnswer } from '../SubQuestionBlock/SubQuestionBlockAnswer';
import { SubQuestionBlockHeader } from '../SubQuestionBlock/SubQuestionBlockHeader';
import { SubQuestionBlockMeta } from '../SubQuestionBlock/SubQuestionBlockMeta';
import { useSubQuestionState, SubQuestionStateType } from '@/features/content/hooks/useSubQuestionState';
import { useUnsavedChanges } from '@/features/content/hooks/useUnsavedChanges';
import { getSubQuestionRepository } from '@/features/content/repositories';
import { validateSubQuestion } from '@/features/content/utils/validateSubQuestion';
import { normalizeSubQuestion } from '@/features/content/utils/normalizeSubQuestion';

export type SubQuestionSectionProps = {
  id: string;
  subQuestionNumber: number;
  questionTypeId: number;
  questionContent: string;
  answerContent?: string;
  keywords?: Array<{ id: string; keyword: string }>;
  options?: Array<{ id: string; content: string; isCorrect: boolean }>;
  pairs?: Array<{ id: string; question: string; answer: string }>;
  items?: Array<{ id: string; text: string; correctOrder: number }>;
  answers?: Array<{ id: string; sampleAnswer: string; gradingCriteria: string; pointValue: number }>;
  canEdit?: boolean;
  showAnswer?: boolean;
  onQuestionChange?: (content: string) => void;
  onAnswerChange?: (content: string) => void;
  onQuestionsUnsavedChange?: (hasUnsaved: boolean) => void;
  onAnswersUnsavedChange?: (hasUnsaved: boolean) => void;
  onKeywordAdd?: (keyword: string) => void;
  onKeywordRemove?: (keywordId: string) => void;
  onTypeChange?: (typeId: number) => void;
  onDelete?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
  mode?: 'preview' | 'edit';
  // ref に保存メソッドを公開
  ref?: React.Ref<SubQuestionSectionHandle>;
};

export interface SubQuestionSectionHandle {
  save: () => Promise<void>;
  isSaving: boolean;
  hasError: boolean;
  error: Error | null;
}

// 新規問題形式のラベル定義（ID 1-5, 10-14）
const questionTypeLabels: Record<number, string> = {
  1: '単一選択',
  2: '複数選択',
  3: '正誤判定',
  4: '組み合わせ',
  5: '順序並べ替え',
  10: '記述式',
  11: '証明問題',
  12: 'コード記述',
  13: '翻訳',
  14: '数値計算',
};

/**
 * SubQuestionSection
 *
 * Repository + Hooks + Validation + Normalization を統合した
 * 完全な保存フロー対応の SubQuestion エディタ
 *
 * 使用方法:
 * ```tsx
 * const sectionRef = useRef<SubQuestionSectionHandle>(null);
 *
 * // 保存を実行
 * await sectionRef.current?.save();
 * ```
 */
export const SubQuestionSection = React.forwardRef<
  SubQuestionSectionHandle,
  SubQuestionSectionProps
>(function SubQuestionSectionComponent(
  {
    id,
    subQuestionNumber,
    questionTypeId,
    questionContent,
    answerContent,
    keywords = [],
    options = [],
    pairs = [],
    items = [],
    answers = [],
    canEdit = false,
    showAnswer = false,
    onQuestionChange,
    onAnswerChange,
    onQuestionsUnsavedChange,
    onAnswersUnsavedChange,
    onKeywordAdd,
    onKeywordRemove,
    onTypeChange,
    onDelete,
    onSaveSuccess,
    onSaveError,
    mode = 'preview',
  },
  ref
) {
  // 初期状態オブジェクトの構成
  const initialSubQuestion: SubQuestionStateType = {
    id,
    questionTypeId,
    questionContent,
    answerContent: answerContent || '',
    keywords,
    options,
    pairs,
    items,
    answers,
    // Required fields from SubQuestion interface
    questionId: '',
    subQuestionNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as any;

  // 状態管理フック
  const {
    state: subQuestionState,
    updateContent,
    updateAnswerDescription,
    markDirty,
    markClean,
  } = useSubQuestionState(initialSubQuestion);

  // 未保存変更追跡
  const questionChanges = useUnsavedChanges('questionContent');
  const answerChanges = useUnsavedChanges('answerContent');

  // UI 状態
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<Error | null>(null);

  // 未保存状態のコールバック
  useEffect(() => {
    onQuestionsUnsavedChange?.(questionChanges.hasUnsaved);
  }, [questionChanges.hasUnsaved, onQuestionsUnsavedChange]);

  useEffect(() => {
    onAnswersUnsavedChange?.(answerChanges.hasUnsaved);
  }, [answerChanges.hasUnsaved, onAnswersUnsavedChange]);

  // 質問内容の変更ハンドラ
  const handleQuestionChange = useCallback(
    (content: string) => {
      updateContent(content);
      onQuestionChange?.(content);
      questionChanges.markAsChanged('questionContent');
      setIsEditingQuestion(false);
    },
    [updateContent, onQuestionChange, questionChanges]
  );

  // 回答内容の変更ハンドラ
  const handleAnswerChange = useCallback(
    (content: string) => {
      updateAnswerDescription(content);
      onAnswerChange?.(content);
      answerChanges.markAsChanged('answerContent');
    },
    [updateAnswerDescription, onAnswerChange, answerChanges]
  );

  // キーワードの追加ハンドラ
  const handleKeywordAdd = useCallback(
    async (keyword: string) => {
      setSaveError(null);
      try {
        const repo = getSubQuestionRepository();
        await repo.addKeyword(id, keyword);
        onKeywordAdd?.(keyword);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('キーワード追加に失敗しました');
        setSaveError(err);
        onSaveError?.(err);
      }
    },
    [id, onKeywordAdd, onSaveError]
  );

  // キーワードの削除ハンドラ
  const handleKeywordRemove = useCallback(
    async (keywordId: string) => {
      setSaveError(null);
      try {
        const repo = getSubQuestionRepository();
        await repo.removeKeyword(id, keywordId);
        onKeywordRemove?.(keywordId);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('キーワード削除に失敗しました');
        setSaveError(err);
        onSaveError?.(err);
      }
    },
    [id, onKeywordRemove, onSaveError]
  );

  /**
   * 完全な保存フロー
   * 1. バリデーション
   * 2. 正規化
   * 3. 基本情報を Repository で保存
   * 4. 形式別データを Repository で保存
   * 5. キャッシュ自動更新
   */
  const handleSaveSubQuestion = useCallback(async () => {
    setSaveError(null);
    setIsSaving(true);

    try {
      // 1️⃣ データの統合
      const subQuestionData = {
        id,
        questionTypeId,
        questionContent: subQuestionState.subQuestion.content,
        answerContent: answerContent || '',
        keywords,
        options,
        pairs,
        items,
        answers,
      };

      // 2️⃣ バリデーション (validateSubQuestion)
      // 注: validateSubQuestion は SubQuestion 型を期待しているため、キャスト
      const validation = validateSubQuestion(subQuestionData as any);
      if (!validation.isValid) {
        // validation.errors は配列の配列の場合もあるため処理
        const errors = Array.isArray(validation.errors) ? validation.errors : [validation.errors];
        const errorMessages = errors
          .flat()
          .map((err: any) => typeof err === 'string' ? err : (err?.message || JSON.stringify(err)))
          .join(', ');
        throw new Error(`バリデーション失敗: ${errorMessages}`);
      }

      // 3️⃣ 正規化 (normalizeSubQuestion)
      const normalized = normalizeSubQuestion(subQuestionData as any);

      // 4️⃣ Repository で基本情報を保存
      const repo = getSubQuestionRepository();
      await repo.update(id, {
        content: (normalized as any).questionContent || subQuestionData.questionContent,
        keywords: (normalized as any).keywords?.map((k: any) => typeof k === 'string' ? k : k.keyword) || [],
      });

      // 5️⃣ 形式別のデータを保存 (updateSelection/Matching/Ordering/Essay)
      const normalizedData = normalized as any;
      switch (normalizedData.questionTypeId || questionTypeId) {
        case 1:
        case 2:
        case 3:
          // Selection 形式
          if (options && options.length > 0) {
            await repo.updateSelection(id, options);
          }
          break;

        case 4:
          // Matching 形式
          if (pairs && pairs.length > 0) {
            await repo.updateMatching(id, pairs);
          }
          break;

        case 5:
          // Ordering 形式
          if (items && items.length > 0) {
            await repo.updateOrdering(id, items);
          }
          break;

        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
          // Essay 形式
          if (answers && answers.length > 0) {
            await repo.updateEssay(id, answers);
          }
          break;
      }

      // 6️⃣ キャッシュが自動更新される
      // Repository の自動キャッシング機構により、5分 TTL でキャッシュが無効化される

      // 7️⃣ 未保存状態をクリア
      questionChanges.markAllSaved();
      answerChanges.markAllSaved();
      markClean();

      // 8️⃣ 成功コールバック
      onSaveSuccess?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('保存に失敗しました');
      setSaveError(err);
      onSaveError?.(err);
    } finally {
      setIsSaving(false);
    }
  }, [
    id,
    questionTypeId,
    subQuestionState.subQuestion.content,
    answerContent,
    keywords,
    options,
    pairs,
    items,
    answers,
    questionChanges,
    answerChanges,
    markClean,
    onSaveSuccess,
    onSaveError,
  ]);
  // ref に save メソッドを公開
  React.useImperativeHandle(
    ref,
    () => ({
      save: handleSaveSubQuestion,
      isSaving,
      hasError: saveError !== null,
      error: saveError,
    }),
    [handleSaveSubQuestion, isSaving, saveError]
  );
  return (
    <Paper variant='outlined' sx={{ p: 2, mb: 2, bgcolor: 'background.paper', overflow: 'visible', position: 'relative', zIndex: 1 }}>
      <Stack spacing={2} sx={{ overflow: 'visible' }}>
        {/* エラーメッセージ */}
        {saveError && (
          <Alert severity='error' onClose={() => setSaveError(null)}>
            {saveError.message}
          </Alert>
        )}

        {/* 保存中インジケータ */}
        {isSaving && (
          <Stack direction='row' spacing={1} alignItems='center'>
            <CircularProgress size={20} />
            <span>保存中...</span>
          </Stack>
        )}

        {/* Header */}
        <SubQuestionBlockHeader
          subQuestionNumber={subQuestionNumber}
          questionTypeLabel={questionTypeLabels[questionTypeId] || '記述式'}
          canEdit={canEdit}
          onEdit={() => setIsEditingQuestion(true)}
          onDelete={onDelete}
        />

        {/* Meta */}
        <SubQuestionBlockMeta
          questionTypeId={questionTypeId}
          questionTypeLabel={questionTypeLabels[questionTypeId] || '記述式'}
          questionTypeOptions={Object.entries(questionTypeLabels).map(([id, label]) => ({
            value: Number(id),
            label,
          }))}
          keywords={keywords}
          canEdit={canEdit}
          onTypeChange={onTypeChange}
          onKeywordAdd={handleKeywordAdd}
          onKeywordRemove={handleKeywordRemove}
        />

        {/* Content */}
        <SubQuestionBlockContent
          subQuestionNumber={subQuestionNumber}
          questionTypeId={questionTypeId}
          questionContent={subQuestionState.subQuestion.content}
          answerContent={answerContent}
          options={options}
          pairs={pairs}
          items={items}
          answers={answers}
          keywords={keywords}
          canEdit={isEditingQuestion && canEdit}
          showAnswer={showAnswer}
          onQuestionChange={handleQuestionChange}
          onAnswerChange={handleAnswerChange}
          onQuestionsUnsavedChange={questionChanges.hasUnsaved ? () => {} : undefined}
          onAnswersUnsavedChange={answerChanges.hasUnsaved ? () => {} : undefined}
          mode={mode}
          id={`${id}-content`}
        />

        {/* Answer */}
        <SubQuestionBlockAnswer
          answerContent={answerContent}
          showAnswer={showAnswer}
          canEdit={canEdit}
          onAnswerChange={handleAnswerChange}
          id={`${id}-answer`}
        />
      </Stack>
    </Paper>
  );
});

export default SubQuestionSection;
