import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface ItemBlockProps {
  itemId: string;
  itemNumber: number;
  text: string;
  canEdit?: boolean;
  onTextChange?: (text: string) => void;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * ItemBlock
 *
 * 個別アイテムのエディタブロック
 */
export const ItemBlock: React.FC<ItemBlockProps> = ({
  itemNumber,
  text,
  canEdit = false,
  onTextChange,
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
        borderLeft: '4px solid #2196f3',
      }}
    >
      <Stack spacing={2}>
        <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
          アイテム {itemNumber}
        </Typography>

        {/* アイテムテキストエディタ */}
        <QuestionEditorPreview
          value={text}
          onChange={onTextChange || (() => { })}
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

export default ItemBlock;
