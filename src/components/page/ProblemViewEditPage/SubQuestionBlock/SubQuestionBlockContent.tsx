import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button, Stack } from '@mui/material';
import { QuestionEditorPreview } from '@/components/common/editors';
import ProblemTypeRegistry from '@/components/problemTypes/ProblemTypeRegistry';
import MultipleChoiceView from '@/components/problemTypes/MultipleChoiceView';
import { ProblemTypeViewProps } from '@/types/problemTypes';
import { SubQuestionFormData } from '@/features/content/types';

export interface SubQuestionBlockContentProps {
  subQuestionNumber: number;
  questionTypeId: number;
  questionContent: string;
  answerContent?: string;
  options?: Array<{ id: string; content: string; isCorrect: boolean }>;
  pairs?: Array<{ id: string; question: string; answer: string }>;
  items?: Array<{ id: string; text: string; correctOrder: number }>;
  answers?: Array<{ id: string; sampleAnswer: string; gradingCriteria: string; pointValue: number }>;
  keywords?: Array<{ id: string; keyword: string }>;
  canEdit?: boolean;
  showAnswer?: boolean;
  onQuestionChange?: (content: string) => void;
  onAnswerChange?: (content: string) => void;
  onContentUpdate?: (data: Partial<SubQuestionFormData>) => Promise<void>;
  onQuestionsUnsavedChange?: (hasUnsaved: boolean) => void;
  onAnswersUnsavedChange?: (hasUnsaved: boolean) => void;
  mode?: 'preview' | 'edit';
  id?: string;
}

export const SubQuestionBlockContent: React.FC<SubQuestionBlockContentProps> = ({
  subQuestionNumber,
  questionTypeId,
  questionContent,
  answerContent,
  options = [],
  pairs = [],
  items = [],
  answers = [],
  keywords = [],
  canEdit = false,
  showAnswer = false,
  onQuestionChange,
  onAnswerChange,
  onContentUpdate,
  onQuestionsUnsavedChange,
  onAnswersUnsavedChange,
  mode = 'preview',
  id,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    ProblemTypeRegistry.registerDefaults();
  }, []);

  const handleSave = (content: string) => {
    onQuestionChange?.(content);
    setIsEditing(false);
  };

  const actualId = id || `sub-q-content-${subQuestionNumber}`;

  return (
    <Box>
      {isEditing ? (
        <Stack spacing={1}>
          <QuestionEditorPreview
            value={questionContent}
            onChange={handleSave}
            onUnsavedChange={onQuestionsUnsavedChange}
            minEditorHeight={150}
            minPreviewHeight={150}
            mode="edit"
            inputId={`${actualId}-editor`}
            name={`${actualId}-editor`}
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
          {(() => {
            const viewProps: ProblemTypeViewProps = {
              subQuestionNumber,
              questionContent,
              questionFormat: 0, // Default to Markdown
              answerContent,
              answerFormat: 0, // Default to Markdown
              options,
              keywords,
              showAnswer: answerContent ? showAnswer : false,
            };

            // ProblemTypeEditPropsにmodeと未保存コールバックを追加
            const editProps = {
              ...viewProps,
              onQuestionChange,
              onAnswerChange,
              onContentUpdate,
              onQuestionsUnsavedChange,
              onAnswersUnsavedChange,
              mode,
            };

            const registryView = ProblemTypeRegistry.getProblemTypeView?.(questionTypeId);
            if (registryView) {
              return React.createElement(registryView, viewProps);
            }

            if (questionTypeId === 2) {
              return <MultipleChoiceView {...viewProps} />;
            }

            return (
              <QuestionEditorPreview
                value={questionContent}
                onChange={() => { }}
                onUnsavedChange={onQuestionsUnsavedChange}
                previewDisabled={false}
                mode={mode}
                inputId={`${actualId}-preview`}
                name={`${actualId}-preview`}
              />
            );
          })()}
        </Box>
      )}
    </Box>
  );
};

export default SubQuestionBlockContent;
