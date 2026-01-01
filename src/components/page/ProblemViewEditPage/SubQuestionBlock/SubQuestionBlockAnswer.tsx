import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Collapse, IconButton, Paper, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import { QuestionEditorPreview } from '@/components/common/editors';

export interface SubQuestionBlockAnswerProps {
  answerContent?: string;
  showAnswer?: boolean;
  canEdit?: boolean;
  onAnswerChange?: (content: string) => void;
  id?: string;
}

/**
 * SubQuestionBlock の解答セクションコンポーネント
 * 
 * 解答内容表示/編集 + 展開/折畳み
 * - Markdown/LaTeX 自動解析のみ（形式切り替えなし）
 */
export const SubQuestionBlockAnswer: React.FC<SubQuestionBlockAnswerProps> = ({
  answerContent,
  showAnswer = false,
  canEdit = false,
  onAnswerChange,
  id,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(showAnswer);
  const [isEditing, setIsEditing] = useState(false);

  if (!answerContent) return null;

  const handleSave = (content: string) => {
    onAnswerChange?.(content);
    setIsEditing(false);
  };

  return (
    <Box>
      <Button
        startIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ mb: 1 }}
      >
        解答を{isExpanded ? '隠す' : '表示'}
      </Button>

      <Collapse in={isExpanded}>
        <Paper variant='outlined' sx={{ p: 2, bgcolor: 'action.hover' }}>
          {isEditing ? (
            <Stack spacing={1}>
              <QuestionEditorPreview
                value={answerContent}
                onChange={handleSave}
                minEditorHeight={150}
                minPreviewHeight={150}
                inputId={id ? `${id}-edit` : undefined}
                name={id ? `${id}-edit` : undefined}
              />
              <Stack direction='row' spacing={1}>
                <Button
                  variant='outlined'
                  size='small'
                  onClick={() => setIsEditing(false)}
                >
                  {t('common.cancel')}
                </Button>
              </Stack>
            </Stack>
          ) : (
            <Box>
              <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{ mb: 1 }}>
                <Typography variant='subtitle2'>解答</Typography>
                {canEdit && (
                  <IconButton onClick={() => setIsEditing(true)} size='small'>
                    <EditIcon fontSize='small' />
                  </IconButton>
                )}
              </Stack>
              <QuestionEditorPreview
                value={answerContent}
                onChange={() => { }}
                previewDisabled={false}
                inputId={id ? `${id}-preview` : undefined}
                name={id ? `${id}-preview` : undefined}
              />
            </Box>
          )}
        </Paper>
      </Collapse>
    </Box>
  );
};

export default SubQuestionBlockAnswer;
