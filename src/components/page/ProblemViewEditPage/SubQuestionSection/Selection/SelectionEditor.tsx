import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface SelectionEditorProps {
  subQuestionNumber: number;
  questionContent: string;
  options: Array<{ id: string; content: string; isCorrect: boolean }>;
  canEdit?: boolean;
  onQuestionChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * SelectionEditor
 *
 * 選択肢形式（ID: 1,2,3）エディタ
 * - 単一選択（ID: 1）
 * - 複数選択（ID: 2）
 * - 正誤判定（ID: 3）
 */
export const SelectionEditor: React.FC<SelectionEditorProps> = ({
  subQuestionNumber,
  questionContent,
  options,
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

      {/* 選択肢表示 */}
      <Box>
        <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
          選択肢
        </Typography>
        <Stack spacing={1}>
          {options.map((option, index) => (
            <Box
              key={option.id}
              sx={{
                p: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                borderLeft: `3px solid ${option.isCorrect ? 'green' : 'gray'}`,
              }}
            >
              <Typography variant='body2'>
                {String.fromCharCode(65 + index)}.{' '}
                {option.content}
                {option.isCorrect && (
                  <Typography component='span' sx={{ color: 'success.main', ml: 1 }}>
                    ✓ 正解
                  </Typography>
                )}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default SelectionEditor;
