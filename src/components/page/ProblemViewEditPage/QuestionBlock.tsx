import { useState } from 'react';
import { Box, Card, CardContent, Stack, Divider } from '@mui/material';
import { QuestionBlockHeader } from './QuestionBlock/QuestionBlockHeader';
import { QuestionBlockContent } from './QuestionBlock/QuestionBlockContent';
import { QuestionBlockMeta } from './QuestionBlock/QuestionBlockMeta';
import { QuestionMetaView } from './common/QuestionMetaView';

export type QuestionBlockProps = {
  questionNumber?: number;
  content?: string;
  format?: 0 | 1; // 0: markdown, 1: latex
  difficulty?: number; // 1: 基礎, 2: 応用, 3: 発展
  keywords?: Array<{ id: string; keyword: string }>;
  canEdit?: boolean;
  canSwitchFormat?: boolean;
  onContentChange?: (content: string) => void;
  onFormatChange?: (format: 0 | 1) => void;
  onUnsavedChange?: (hasUnsaved: boolean) => void;
  onKeywordAdd?: (keyword: string) => void;
  onKeywordRemove?: (keywordId: string) => void;
  onDelete?: () => void;
  difficultyOptions?: Array<{ value: number; label: string }>;
  onDifficultyChange?: (value: number) => void;
  question?: any; // optional shorthand input
  viewMode?: 'full' | 'structure';
  mode?: 'preview' | 'edit';
  children?: React.ReactNode;
  id?: string;
};

const difficultyLabels = {
  0: { label: '未設定', color: 'default' },
  1: { label: '基礎', color: 'success' },
  2: { label: '応用', color: 'warning' },
  3: { label: '発展', color: 'error' },
};

export function QuestionBlock({
  questionNumber,
  content,
  format,
  difficulty,
  keywords = [],
  canEdit = false,
  canSwitchFormat = false,
  onContentChange,
  onFormatChange,
  onUnsavedChange,
  onKeywordAdd,
  onKeywordRemove,
  onDelete,
  difficultyOptions = [
    { value: 0, label: '未設定' },
    { value: 1, label: '基礎' },
    { value: 2, label: '応用' },
    { value: 3, label: '発展' },
  ],
  onDifficultyChange,
  viewMode = 'full',
  mode = 'preview',
  question,
  children,
  id,
}: QuestionBlockProps) {
  const derivedContent = content ?? question?.question_content ?? question?.questionContent ?? '';
  const derivedNumber = questionNumber ?? question?.question_number ?? question?.questionNumber ?? 1;
  const derivedFormat = (format ?? question?.question_format ?? question?.questionFormat ?? 0) as 0 | 1;
  const derivedDifficulty = difficulty ?? question?.difficulty ?? 0;
  const derivedKeywords = keywords.length ? keywords : question?.keywords ?? [];

  const [currentFormat, setCurrentFormat] = useState<0 | 1>(derivedFormat);
  const [editContent, setEditContent] = useState(derivedContent);
  const actualId = id || `qblock-${derivedNumber}`;

  return (
    <Card variant="outlined" sx={{ mb: 4 }}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <QuestionBlockHeader
            questionNumber={derivedNumber}
            onDelete={canEdit ? onDelete : undefined}
          />

          <Divider />

          {/* Meta Info (View or Edit) */}
          {canEdit ? (
            <QuestionBlockMeta
              difficulty={derivedDifficulty}
              keywords={derivedKeywords}
              isEditMode={true}
              onDifficultyChange={onDifficultyChange}
              onKeywordsChange={(newKeywords) => {
                // Handle keyword changes
                // This will be connected to the parent component
              }}
              id={`${actualId}-meta`}
            />
          ) : (
            <QuestionMetaView
              difficulty={derivedDifficulty}
              difficultyLabels={difficultyLabels as any}
              keywords={derivedKeywords}
            />
          )}

          {/* Content */}
          {viewMode === 'full' && (
            <QuestionBlockContent
              content={editContent}
              format={currentFormat}
              onContentChange={(v) => {
                setEditContent(v);
                onContentChange?.(v);
              }}
              onFormatChange={(f) => {
                setCurrentFormat(f);
                onFormatChange?.(f);
              }}
              onUnsavedChange={onUnsavedChange}
              mode={mode}
              id={`${actualId}-content`}
            />
          )}

          {children && (
            <Box sx={{ mt: 2, pl: { xs: 0, md: 2 }, borderLeft: { xs: 'none', md: 2 }, borderColor: 'divider' }}>
              {children}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
