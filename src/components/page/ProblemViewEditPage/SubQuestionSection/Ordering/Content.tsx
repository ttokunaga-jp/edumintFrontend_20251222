import React from 'react';
import { Box, Stack } from '@mui/material';
import { OrderingEditor } from './OrderingEditor';
import { ItemBlock } from './ItemBlock';

export interface OrderingContentProps {
  subQuestionNumber: number;
  questionContent: string;
  items: Array<{ id: string; text: string }>;
  canEdit?: boolean;
  showAnswer?: boolean;
  onQuestionChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * OrderingContent
 *
 * 順序並べ替え形式の全体レイアウト
 */
export const OrderingContent: React.FC<OrderingContentProps> = ({
  subQuestionNumber,
  questionContent,
  items,
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
      <OrderingEditor
        subQuestionNumber={subQuestionNumber}
        questionContent={questionContent}
        items={items}
        canEdit={canEdit}
        onQuestionChange={onQuestionChange}
        onQuestionUnsavedChange={onQuestionUnsavedChange}
        mode={mode}
        id={id}
      />

      {/* アイテムの詳細エディタ */}
      {canEdit && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
          <Stack spacing={2}>
            {items.map((item, index) => (
              <ItemBlock
                key={item.id}
                itemId={item.id}
                itemNumber={index + 1}
                text={item.text}
                canEdit={canEdit}
                mode={mode}
                id={`${id}-item-${item.id}`}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default OrderingContent;
