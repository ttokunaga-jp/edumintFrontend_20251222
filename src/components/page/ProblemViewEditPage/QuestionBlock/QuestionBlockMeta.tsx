import React from 'react';
import { Box, Stack } from '@mui/material';
import DifficultySelect from '@/components/common/selects/DifficultySelect';
import KeywordInput from '@/components/common/inputs/KeywordInput';

export interface QuestionBlockMetaProps {
  difficulty: number;
  keywords: string[];
  isEditMode?: boolean;
  onDifficultyChange?: (difficulty: number) => void;
  onKeywordsChange?: (keywords: string[]) => void;
  id?: string;
}

/**
 * QuestionBlock のメタ情報コンポーネント
 * 
 * 難易度 + キーワード管理
 */
export const QuestionBlockMeta: React.FC<QuestionBlockMetaProps> = ({
  difficulty,
  keywords,
  isEditMode = false,
  onDifficultyChange,
  onKeywordsChange,
  id,
}) => {
  return (
    <Stack spacing={2} sx={{ mt: 2 }}>
      <Box>
        <DifficultySelect
          value={difficulty}
          onChange={onDifficultyChange}
          disabled={!isEditMode}
          id={id ? `${id}-difficulty` : undefined}
          name={id ? `${id}-difficulty` : undefined}
        />
      </Box>
      <Box>
        <KeywordInput
          keywords={keywords}
          onChange={onKeywordsChange}
          disabled={!isEditMode}
          inputId={id ? `${id}-keywords` : undefined}
        />
      </Box>
    </Stack>
  );
};

export default QuestionBlockMeta;
