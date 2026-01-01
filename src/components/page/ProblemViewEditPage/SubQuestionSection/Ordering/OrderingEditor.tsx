import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface OrderingEditorProps {
  subQuestionNumber: number;
  questionContent: string;
  items: Array<{ id: string; text: string }>;
  canEdit?: boolean;
  onQuestionChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * OrderingEditor
 *
 * 順序並べ替え形式（ID: 5）エディタ
 */
export const OrderingEditor: React.FC<OrderingEditorProps> = ({
  subQuestionNumber,
  questionContent,
  items,
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

      {/* アイテム表示 */}
      <Box>
        <Typography variant='subtitle2' sx={{ mb: 1, fontWeight: 'bold' }}>
          並べ替え対象
        </Typography>
        <Stack spacing={1}>
          {items.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                p: 1,
                bgcolor: 'action.hover',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Typography variant='body2' sx={{ fontWeight: 'bold', minWidth: 30 }}>
                {index + 1}.
              </Typography>
              <Typography variant='body2'>{item.text}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
};

export default OrderingEditor;
