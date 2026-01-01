import React from 'react';
import { QuestionEditorPreview } from '@/components/common/editors';
import { SelectionViewer } from '@/components/problemTypes/common/SelectionViewer';
import { ProblemTypeViewProps } from '@/types/problemTypes';

/**
 * MultipleChoiceView
 * 
 * 複数選択問題（ID: 2）の表示・編集コンポーネント
 * - mode="preview": プレビューのみ表示（showAnswer時）
 * - mode="edit": エディタ + プレビュー表示（編集時）
 * 
 * 更新：SelectionViewer共通コンポーネント採用
 * - Markdown/LaTeX自動判定
 * - 統一されたUIスタイリング
 * - アクセシビリティ対応
 */
export default function MultipleChoiceView(props: ProblemTypeViewProps) {
  const { questionContent, onQuestionChange, options = [], showAnswer = false } = props;
  // showAnswer=true の場合 preview、それ以外は edit
  const mode = showAnswer ? 'preview' : 'edit';

  // options配列をSelectionViewer用のItem構造に変換
  const selectionItems = options.map((opt) => ({
    id: opt.id,
    label: opt.content,
    value: opt.isCorrect === true, // 正解フラグをvalueに
  }));

  return (
    <div>
      <QuestionEditorPreview
        value={questionContent}
        onChange={onQuestionChange || (() => {})}
        mode={mode}
        minEditorHeight={150}
        minPreviewHeight={150}
        disableUndo={mode === 'preview'}
      />

      <SelectionViewer
        items={selectionItems}
        showAnswer={showAnswer}
        isSingleSelect={false}
        sx={{ mt: 2 }}
      />
    </div>
  );
}
