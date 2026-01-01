import React from 'react';
import { Box, Stack } from '@mui/material';
import { EssayEditor } from './EssayEditor';
import { AnswerBlock } from './AnswerBlock';

export interface EssayContentProps {
  subQuestionNumber: number;
  questionContent: string;
  sampleAnswer?: string;
  gradingCriteria?: string;
  canEdit?: boolean;
  showAnswer?: boolean;
  onQuestionChange?: (content: string) => void;
  onSampleAnswerChange?: (content: string) => void;
  onGradingCriteriaChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * EssayContent
 *
 * 記述形式の全体レイアウト
 */
export const EssayContent: React.FC<EssayContentProps> = ({
  subQuestionNumber,
  questionContent,
  sampleAnswer = '',
  gradingCriteria = '',
  canEdit = false,
  showAnswer = false,
  onQuestionChange,
  onSampleAnswerChange,
  onGradingCriteriaChange,
  onQuestionUnsavedChange,
  mode = 'preview',
  id,
}) => {
  return (
    <Stack spacing={2}>
      {/* メインエディタ */}
      <EssayEditor
        subQuestionNumber={subQuestionNumber}
        questionContent={questionContent}
        sampleAnswer={sampleAnswer}
        gradingCriteria={gradingCriteria}
        canEdit={canEdit}
        onQuestionChange={onQuestionChange}
        onQuestionUnsavedChange={onQuestionUnsavedChange}
        mode={mode}
        id={id}
      />

      {/* 解答・採点基準の詳細エディタ */}
      {canEdit && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
          <AnswerBlock
            answerId='main'
            sampleAnswer={sampleAnswer}
            gradingCriteria={gradingCriteria}
            canEdit={canEdit}
            onSampleAnswerChange={onSampleAnswerChange}
            onGradingCriteriaChange={onGradingCriteriaChange}
            mode={mode}
            id={`${id}-answer`}
          />
        </Box>
      )}
    </Stack>
  );
};

export default EssayContent;
