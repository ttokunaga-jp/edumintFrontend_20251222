import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface MatchingEditorProps {
  subQuestionNumber: number;
  questionContent: string;
  pairs: Array<{ id: string; question: string; answer: string }>;
  canEdit?: boolean;
  onQuestionChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * MatchingEditor
 *
 * 組み合わせ形式（ID: 4）エディタ
 */
export const MatchingEditor: React.FC<MatchingEditorProps> = ({
  subQuestionNumber,
  questionContent,
  pairs,
  canEdit = false,
  onQuestionChange,
  onQuestionUnsavedChange,
  mode = 'preview',
  id,
}) => {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      {/* 問題本文エディタ */}
      <Box>
        <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
          問題文
        </Typography>
        <QuestionEditorPreview
          value={questionContent}
          onChange={onQuestionChange || (() => { })}
          mode={mode}
          onUnsavedChange={onQuestionUnsavedChange}
          minEditorHeight={120}
          minPreviewHeight={80}
          inputId={id}
        />
      </Box>

      {/* ペア表示 */}
      <Box>
        <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
          組み合わせペア
        </Typography>
        <Stack spacing={1}>
          {pairs.map((pair, index) => (
            <Box
              key={pair.id}
              sx={{
                p: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <Typography variant='body2' sx={{ fontWeight: 'bold', minWidth: 30 }}>
                {index + 1}.
              </Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                  質問
                </Typography>
                <Typography variant='body2'>{pair.question}</Typography>
              </Box>
              <Typography variant='body2'>↔</Typography>
              <Box sx={{ flex: 1 }}>
                <Typography variant='caption' sx={{ color: 'text.secondary' }}>
                  回答
                </Typography>
                <Typography variant='body2'>{pair.answer}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default MatchingEditor;
