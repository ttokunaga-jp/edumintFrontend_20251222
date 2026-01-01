import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface EssayEditorProps {
  subQuestionNumber: number;
  questionContent: string;
  sampleAnswer?: string;
  gradingCriteria?: string;
  canEdit?: boolean;
  onQuestionChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * EssayEditor
 *
 * 記述形式（ID: 10-14）エディタ
 * - 記述式（ID: 10）
 * - 証明問題（ID: 11）
 * - コード記述（ID: 12）
 * - 翻訳（ID: 13）
 * - 数値計算（ID: 14）
 */
export const EssayEditor: React.FC<EssayEditorProps> = ({
  subQuestionNumber,
  questionContent,
  sampleAnswer,
  gradingCriteria,
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

      {/* 模範解答（表示のみ） */}
      {(canEdit || sampleAnswer) && (
        <Box>
          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
            模範解答
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'success.lighter',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'success.light',
            }}
          >
            <Typography variant='body2'>{sampleAnswer || '（未入力）'}</Typography>
          </Box>
        </Box>
      )}

      {/* 採点基準（表示のみ） */}
      {(canEdit || gradingCriteria) && (
        <Box>
          <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
            採点基準
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'info.lighter',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'info.light',
            }}
          >
            <Typography variant='body2'>{gradingCriteria || '（未入力）'}</Typography>
          </Box>
        </Box>
      )}
    </Stack>
  );
};

export default EssayEditor;
