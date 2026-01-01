import React from 'react';
import { Box, Stack } from '@mui/material';
import { MatchingEditor } from './MatchingEditor';
import { PairBlock } from './PairBlock';

export interface MatchingContentProps {
  subQuestionNumber: number;
  questionContent: string;
  pairs: Array<{ id: string; question: string; answer: string }>;
  canEdit?: boolean;
  showAnswer?: boolean;
  onQuestionChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * MatchingContent
 *
 * 組み合わせ形式の全体レイアウト
 */
export const MatchingContent: React.FC<MatchingContentProps> = ({
  subQuestionNumber,
  questionContent,
  pairs,
  canEdit = false,
  showAnswer = false,
  onQuestionChange,
  onQuestionUnsavedChange,
  mode = 'preview',
  id,
}) => {
  return (
    <Stack spacing={2}>
      {/* メインエディタ */}
      <MatchingEditor
        subQuestionNumber={subQuestionNumber}
        questionContent={questionContent}
        pairs={pairs}
        canEdit={canEdit}
        onQuestionChange={onQuestionChange}
        onQuestionUnsavedChange={onQuestionUnsavedChange}
        mode={mode}
        id={id}
      />

      {/* ペアの詳細エディタ */}
      {canEdit && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
          <Stack spacing={2}>
            {pairs.map((pair, index) => (
              <PairBlock
                key={pair.id}
                pairId={pair.id}
                pairNumber={index + 1}
                question={pair.question}
                answer={pair.answer}
                canEdit={canEdit}
                mode={mode}
                id={`${id}-pair-${pair.id}`}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default MatchingContent;
