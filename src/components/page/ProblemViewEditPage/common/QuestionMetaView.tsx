import React from 'react';
import { Box, Chip, Stack } from '@mui/material';
import { KeywordEditor, Keyword } from './KeywordEditor';

type DifficultyMeta = { label: string; color: string };

type QuestionMetaViewProps = {
  difficulty?: number | null;
  difficultyLabels: Record<number, DifficultyMeta>;
  keywords?: Keyword[];
};

export const QuestionMetaView: React.FC<QuestionMetaViewProps> = ({
  difficulty,
  difficultyLabels,
  keywords = [],
}) => {
  const effectiveDifficulty = difficulty ?? 0;
  const meta = difficultyLabels[effectiveDifficulty] ?? difficultyLabels[0];

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {meta && (
        <Chip
          label={meta.label}
          color={(meta.color as any) || 'default'}
          size="small"
          variant="outlined"
        />
      )}
      <KeywordEditor keywords={keywords} canEdit={false} />
    </Stack>
  );
};
