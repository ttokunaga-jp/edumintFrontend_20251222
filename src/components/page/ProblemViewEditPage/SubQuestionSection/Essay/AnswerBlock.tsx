import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface AnswerBlockProps {
  answerId: string;
  sampleAnswer: string;
  gradingCriteria: string;
  canEdit?: boolean;
  onSampleAnswerChange?: (content: string) => void;
  onGradingCriteriaChange?: (content: string) => void;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * AnswerBlock
 *
 * 模範解答と採点基準のエディタブロック
 */
export const AnswerBlock: React.FC<AnswerBlockProps> = ({
  sampleAnswer,
  gradingCriteria,
  canEdit = false,
  onSampleAnswerChange,
  onGradingCriteriaChange,
  onUnsavedChange,
  mode = 'preview',
  id,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        border: '1px solid #ccc',
        borderRadius: 1,
      }}
    >
      <Stack spacing={2}>
        {/* 模範解答 */}
        <Box>
          <Typography variant='subtitle2' sx={{ fontWeight: 'bold', mb: 1 }}>
            模範解答
          </Typography>
          <QuestionEditorPreview
            value={sampleAnswer}
            onChange={onSampleAnswerChange || (() => { })}
            mode={mode}
            onUnsavedChange={onUnsavedChange}
            minEditorHeight={100}
            minPreviewHeight={80}
            inputId={`${id}-sample`}
          />
        </Box>

        {/* 採点基準 */}
        <Box>
          <Typography variant='subtitle2' sx={{ fontWeight: 'bold', mb: 1 }}>
            採点基準
          </Typography>
          <QuestionEditorPreview
            value={gradingCriteria}
            onChange={onGradingCriteriaChange || (() => { })}
            mode={mode}
            onUnsavedChange={onUnsavedChange}
            minEditorHeight={100}
            minPreviewHeight={80}
            inputId={`${id}-grading`}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default AnswerBlock;
