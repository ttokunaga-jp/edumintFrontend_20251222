import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface OptionBlockProps {
  optionId: string;
  optionNumber: number;
  content: string;
  isCorrect: boolean;
  canEdit?: boolean;
  onContentChange?: (content: string) => void;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * OptionBlock
 *
 * 個別選択肢のエディタブロック
 */
export const OptionBlock: React.FC<OptionBlockProps> = ({
  optionNumber,
  content,
  isCorrect,
  canEdit = false,
  onContentChange,
  onUnsavedChange,
  mode = 'preview',
  id,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        bgcolor: 'background.paper',
        border: `1px solid ${isCorrect ? 'green' : '#ccc'}`,
        borderRadius: 1,
        borderLeft: `4px solid ${isCorrect ? 'green' : 'gray'}`,
      }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
            選択肢 {String.fromCharCode(64 + optionNumber)}
          </Typography>
          {isCorrect && (
            <Typography variant='caption' sx={{ color: 'success.main', fontWeight: 'bold' }}>
              正解
            </Typography>
          )}
        </Box>

        {/* 選択肢テキストエディタ */}
        <QuestionEditorPreview
          value={content}
          onChange={onContentChange || (() => { })}
          mode={mode}
          onUnsavedChange={onUnsavedChange}
          minEditorHeight={80}
          minPreviewHeight={60}
          inputId={id}
        />
      </Stack>
    </Box>
  );
};

export default OptionBlock;
