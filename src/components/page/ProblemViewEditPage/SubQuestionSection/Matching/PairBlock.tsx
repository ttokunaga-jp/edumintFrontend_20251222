import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface PairBlockProps {
  pairId: string;
  pairNumber: number;
  question: string;
  answer: string;
  canEdit?: boolean;
  onQuestionChange?: (question: string) => void;
  onAnswerChange?: (answer: string) => void;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * PairBlock
 *
 * 個別ペアのエディタブロック
 */
export const PairBlock: React.FC<PairBlockProps> = ({
  pairNumber,
  question,
  answer,
  canEdit = false,
  onQuestionChange,
  onAnswerChange,
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
        <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
          ペア {pairNumber}
        </Typography>

        {/* 質問テキストエディタ */}
        <Box>
          <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            質問
          </Typography>
          <QuestionEditorPreview
            value={question}
            onChange={onQuestionChange || (() => { })}
            mode={mode}
            onUnsavedChange={onUnsavedChange}
            minEditorHeight={80}
            minPreviewHeight={60}
            inputId={`${id}-question`}
          />
        </Box>

        {/* 回答テキストエディタ */}
        <Box>
          <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            回答
          </Typography>
          <QuestionEditorPreview
            value={answer}
            onChange={onAnswerChange || (() => { })}
            mode={mode}
            onUnsavedChange={onUnsavedChange}
            minEditorHeight={80}
            minPreviewHeight={60}
            inputId={`${id}-answer`}
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default PairBlock;
