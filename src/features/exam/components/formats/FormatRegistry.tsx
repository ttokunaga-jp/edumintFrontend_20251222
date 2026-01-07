import { Fragment } from 'react';
import type { FC, ReactNode, SyntheticEvent, FormEvent } from 'react';
import { Box } from '@mui/material';
import { SelectionEditor } from './SelectionEditor';
import { MatchingEditor } from './MatchingEditor';
import { OrderingEditor } from './OrderingEditor';

interface FormatRegistryProps {
  questionTypeId: number;
  basePath: string;
  isEditMode: boolean;
}

/**
 * FormatRegistry
 * 
 * 問題形式（questionTypeId）に基づいて、
 * 対応する形式別エディタを動的に選択・レンダリングします。
 * 
 * ID 0, 1, 2: SelectionEditor (単一選択, 複数選択, 正誤判定) — shifted to 0-based
 * ID 3: MatchingEditor (マッチング)
 * ID 4: OrderingEditor (順序並べ替え)
 * ID 10-14: 基本フォーム（SubQuestionItem で問題文・答案・解説で完全対応）
 */
export const FormatRegistry: FC<FormatRegistryProps> = ({
  questionTypeId,
  basePath,
  isEditMode,
}) => {
  // ID 0, 1, 2 (shifted to 0-based)
  if ([0, 1, 2].includes(questionTypeId)) {
    return (
      <SelectionEditor
        questionTypeId={questionTypeId}
        basePath={basePath}
        isEditMode={isEditMode}
      />
    );
  }

  // ID 3 (was 4)
  if (questionTypeId === 3) {
    return (
      <MatchingEditor
        basePath={basePath}
        isEditMode={isEditMode}
      />
    );
  }

  // ID 4 (was 5)
  if (questionTypeId === 4) {
    return (
      <OrderingEditor
        basePath={basePath}
        isEditMode={isEditMode}
      />
    );
  }

  // ID 10-14: 基本フォームで完全対応（何も表示しない）
  return <Box />;
};

export default FormatRegistry;
