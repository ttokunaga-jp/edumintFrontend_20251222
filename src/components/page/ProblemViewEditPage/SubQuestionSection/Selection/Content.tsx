import React from 'react';
import { Box, Stack } from '@mui/material';
import { SelectionEditor } from './SelectionEditor';
import { OptionBlock } from './OptionBlock';

export interface SelectionContentProps {
  subQuestionNumber: number;
  questionContent: string;
  options: Array<{ id: string; content: string; isCorrect: boolean }>;
  canEdit?: boolean;
  showAnswer?: boolean;
  onQuestionChange?: (content: string) => void;
  onQuestionUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

/**
 * SelectionContent
 *
 * 選択肢形式の全体レイアウト
 */
export const SelectionContent: React.FC<SelectionContentProps> = ({
  subQuestionNumber,
  questionContent,
  options,
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
      <SelectionEditor
        subQuestionNumber={subQuestionNumber}
        questionContent={questionContent}
        options={options}
        canEdit={canEdit}
        onQuestionChange={onQuestionChange}
        onQuestionUnsavedChange={onQuestionUnsavedChange}
        mode={mode}
        id={id}
      />

      {/* 選択肢の詳細エディタ */}
      {canEdit && (
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #ddd' }}>
          <Stack spacing={2}>
            {options.map((option, index) => (
              <OptionBlock
                key={option.id}
                optionId={option.id}
                optionNumber={index + 1}
                content={option.content}
                isCorrect={option.isCorrect}
                canEdit={canEdit}
                mode={mode}
                id={`${id}-option-${option.id}`}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

export default SelectionContent;
