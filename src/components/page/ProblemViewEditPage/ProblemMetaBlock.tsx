import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { Exam } from '@/features/content/models';

interface ProblemMetaBlockProps {
  exam?: Exam;
  examName?: string;
  school?: string;
  universityName?: string;
  teacherName?: string;
  subjectName?: string;
  examYear?: number;
  level?: string;
  questionCount?: number;
  durationMinutes?: number;
  fieldType?: string;
  majorType?: number;
  canEdit?: boolean;
  onEdit?: () => void;
}

export const ProblemMetaBlock: React.FC<ProblemMetaBlockProps> = ({
  exam,
  examName: propExamName,
  school: propSchool,
  universityName: propUniversityName,
  teacherName: propTeacherName,
  subjectName: propSubjectName,
  examYear: propExamYear,
  level: propLevel,
  questionCount: propQuestionCount,
  durationMinutes: propDurationMinutes,
  fieldType: propFieldType,
  majorType: propMajorType,
  canEdit = false,
  onEdit,
}) => {
  const examName = propExamName ?? exam?.examName;
  const school = propSchool ?? exam?.school;
  const universityName = propUniversityName ?? exam?.universityName;
  const teacherName = propTeacherName ?? exam?.teacherName;
  const subjectName = propSubjectName ?? exam?.subjectName;
  const examYear = propExamYear ?? exam?.examYear;
  const level = propLevel ?? exam?.level;
  const questionCount = propQuestionCount ?? exam?.questionCount;
  const durationMinutes = propDurationMinutes ?? exam?.durationMinutes;
  const fieldType = propFieldType ?? exam?.fieldType;
  const majorType = propMajorType ?? exam?.majorType;

  const levelLabels: Record<string, string> = {
    basic: '基礎',
    standard: '標準',
    advanced: '上級',
  };

  const fieldLabels: Record<string, string> = {
    science: '理系',
    humanities: '文系',
  };

  const majorLabels: Record<number, string> = {
    0: '理系',
    1: '文系',
  };

  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
      <Stack spacing={2}>
        <Typography variant="h6" component="h2">
          {examName || '問題集情報'}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {school && (
            <Chip label={`学校: ${school}`} size="small" variant="outlined" />
          )}
          {universityName && (
            <Chip label={`大学: ${universityName}`} size="small" variant="outlined" />
          )}
          {teacherName && (
            <Chip label={`講師: ${teacherName}`} size="small" variant="outlined" />
          )}
          {subjectName && (
            <Chip label={`科目: ${subjectName}`} size="small" variant="outlined" />
          )}
          {examYear && (
            <Chip label={`年度: ${examYear}`} size="small" variant="outlined" />
          )}
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {level && (
            <Chip
              label={`レベル: ${levelLabels[level] || level}`}
              size="small"
              color="primary"
            />
          )}
          {fieldType && (
            <Chip
              label={`分野: ${fieldLabels[fieldType] || fieldType}`}
              size="small"
              color="secondary"
            />
          )}
          {majorType !== undefined && (
            <Chip
              label={`系統: ${majorLabels[majorType] || majorType}`}
              size="small"
              color="info"
            />
          )}
          {questionCount && (
            <Chip label={`問題数: ${questionCount}`} size="small" />
          )}
          {durationMinutes && (
            <Chip label={`時間: ${durationMinutes}分`} size="small" />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};
