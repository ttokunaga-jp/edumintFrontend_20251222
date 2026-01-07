import React, { useState } from 'react';
import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
import {
  Paper,
  Box,
  TextField,
  Stack,
  Divider,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ExamQuestionMeta } from './ExamQuestionMeta';

import { QuestionTypeLabels } from '../schema';
import { FormatRegistry } from './formats/FormatRegistry';
import { useTranslation } from 'react-i18next';
import { getEnumOptions } from '@/lib/i18nHelpers';
import { ExamContentField } from './inputs/ExamContentField';
import type { ExamFormValues } from '../schema';

interface SubQuestionItemProps {
  questionIndex: number;
  subQuestionIndex: number;
  isEditMode: boolean;
  structureOnly?: boolean;
  onDelete?: () => void;
  canDelete: boolean;
}

export const SubQuestionItem: FC<SubQuestionItemProps> = ({
  questionIndex,
  subQuestionIndex,
  isEditMode,
  structureOnly,
  onDelete,
  canDelete,
}) => {
  const { control, watch, formState: { errors } } = useFormContext<ExamFormValues>();
  const basePath = `questions.${questionIndex}.subQuestions.${subQuestionIndex}`;

  // アコーディオン展開状態
  const [expandedSections, setExpandedSections] = useState<{
    answer: boolean;
    format: boolean;
  }>({
    answer: false,
    format: false,
  });

  const handleAccordionChange = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const questionTypeId = watch(`${basePath}.questionTypeId`);
  const { t } = useTranslation();
  const questionTypeOptions = getEnumOptions('questionType', t).map(o => ({ value: Number(o.value), label: o.label }));

  // キーワード管理
  const { fields: keywordFields, append, remove } = useFieldArray({
    control,
    name: `${basePath}.keywords` as any,
  });

  // BlockMeta用にキーワード変形
  const formattedKeywords = keywordFields.map((field: any) => ({
    id: field.id,
    keyword: field.keyword,
  }));

  const handleKeywordAdd = (keyword: string) => {
    append({ keyword });
  };

  const handleKeywordRemove = (id: string) => {
    const index = keywordFields.findIndex((f) => f.id === id);
    if (index !== -1) {
      remove(index);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
      data-testid={`subquestion-item-${subQuestionIndex}`}
    >
      <Stack spacing={2}>
        {/* Header + Meta Info (BlockMeta) */}
        <Controller
          name={`${basePath}.questionTypeId`}
          control={control}
          render={({ field }) => (
            <ExamQuestionMeta
              level="minor"
              number={subQuestionIndex + 1}
              metaType="questionType"
              metaValue={Number(field.value)}
              metaOptions={questionTypeOptions}
              keywords={formattedKeywords}
              isEditMode={isEditMode}
              onMetaChange={(val) => field.onChange(Number(val))}
              onKeywordAdd={handleKeywordAdd}
              onKeywordRemove={handleKeywordRemove}
              errorMessage={errors.questions?.[questionIndex]?.subQuestions?.[subQuestionIndex]?.keywords?.message}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          )}
        />

        {!structureOnly && <Divider />}

        {/* 問題セクション */}
        {!structureOnly && (
          <Box>
            <ExamContentField
              name={`${basePath}.questionContent`}
              label="問題文"
              isEditMode={isEditMode}
              placeholder="問題文を入力してください（Markdown/LaTeX対応）"
            />
          </Box>
        )}

        {/* 形式別エディタセクション（ID 1-5のみ、アコーディオンなし） */}
        {!structureOnly && [1, 2, 3, 4, 5].includes(Number(questionTypeId)) && (
          <Box sx={{ mt: 2 }}>
            <FormatRegistry
              questionTypeId={String(questionTypeId)}
              basePath={basePath}
              isEditMode={isEditMode}
            />
          </Box>
        )}

        {/* 解答解説セクション */}
        {!structureOnly && (
          isEditMode ? (
            // Editモード: 常時表示 (アコーディオンなし)
            <Box sx={{ mt: 2 }}>
              <ExamContentField
                name={`${basePath}.answerContent`}
                label="解答解説"
                isEditMode={true}
                placeholder="解答や解説を入力してください"
              />
            </Box>
          ) : (
            // Viewモード: アコーディオン
            <Accordion
              expanded={expandedSections.answer}
              onChange={() => handleAccordionChange('answer')}
              sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                '&:before': { display: 'none' },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: 'action.hover',
                  '&.Mui-expanded': { backgroundColor: 'action.focus' },
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  解答解説
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 2 }}>
                <ExamContentField
                  name={`${basePath}.answerContent`}
                  isEditMode={false}
                />
              </AccordionDetails>
            </Accordion>
          )
        )}
      </Stack>
    </Paper>
  );
};

