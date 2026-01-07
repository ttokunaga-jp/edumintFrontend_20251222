import { Fragment } from 'react';
import type { FC, ReactNode, SyntheticEvent, FormEvent } from 'react';
import { Card, CardContent, Box, Typography, Chip, Stack, IconButton, useTheme } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { useTranslation } from 'react-i18next';
import { EXAM_TYPE_COLORS } from '@/constants/fixedVariables';
import { getEnumLabelKey } from '@/lib/enums/enumHelpers';
import DEFAULT_ENUM_MAPPINGS from '@/lib/enums/enumMappings';

export interface ExamCompactItem {
  id: string;
  title: string;
  examType?: number; // 0: 定期試験, 1: 授業内試験, 2: 小テスト
  examTypeLabel?: string;
  examYear?: string | number;
  university?: string;
  faculty?: string;
  majorType?: number; // academic_track: 0=science (理系), 1=humanities (文系)
  academicFieldName?: string; // 試験分野
  academicFieldId?: number; // Numeric ID for localization
  subjectName?: string;
  durationMinutes?: number;
  views?: number;
  likes?: number;
}

/**
 * Utility to map raw problem data (from API) to ExamCompactItem
 */
export const mapProblemToCompactItem = (problem: any): ExamCompactItem => {
  // Infer examTypeLabel if missing
  const examTypeLabel = problem.examTypeLabel;

  // Extract majorType (academic_track) as numeric ID
  // Priority: problem.majorType > problem.academicFieldId > undefined
  const majorType = problem.majorType !== undefined
    ? problem.majorType
    : problem.academicFieldId;

  return {
    id: problem.id,
    title: problem.title || problem.examName || '',
    examType: problem.examType,
    examTypeLabel,
    examYear: problem.examYear,
    university: problem.university || problem.universityName,
    faculty: problem.faculty || problem.facultyName,
    majorType, // Numeric ID: 0=science, 1=humanities
    academicFieldName: problem.academicFieldName || problem.academicField,
    academicFieldId: problem.academicFieldId,
    subjectName: problem.subjectName || problem.subject || '',
    durationMinutes: problem.durationMinutes,
    views: problem.views ?? (problem.viewCount !== undefined ? problem.viewCount : 312), // Fallback for mock data consistency
    likes: problem.likes ?? (problem.goodCount !== undefined ? problem.goodCount : 84), // Fallback for mock data consistency
  };
};

export interface ExamCardCompactProps {
  item: ExamCompactItem;
  onView?: (id: string) => void;
  onGood?: (id: string) => void;
}

export const ExamCardCompact: FC<ExamCardCompactProps> = ({ item, onView, onGood }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleView = () => onView?.(item.id);
  const handleGood = () => onGood?.(item.id);

  // Resolve exam type color: prefer numeric `examType`, otherwise try to infer from `examTypeLabel`
  // Use canonical `EXAM_TYPE_LABELS` from constants

  const getExamTypeColor = () => {
    // direct numeric mapping
    if (typeof item.examType === 'number' && EXAM_TYPE_COLORS[item.examType]) {
      return EXAM_TYPE_COLORS[item.examType];
    }

    // try to infer from numeric id using unified enums
    if (item.examType !== undefined) {
      return EXAM_TYPE_COLORS[item.examType] ?? null;
    }

    return null;
  };

  const examTypeColor = getExamTypeColor();

  return (
    <Card
      onClick={handleView}
      sx={{
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
          {/* チップ順: 試験種別, 年, 大学 */}
          {item.examType !== undefined && (
            <Chip
              label={t(getEnumLabelKey('examType', item.examType) || '')}
              size="small"
              sx={{
                ...(examTypeColor && {
                  backgroundColor: examTypeColor.bg,
                  color: examTypeColor.text,
                  fontWeight: 600,
                }),
              }}
            />
          )}
          {item.examYear && (
            <Chip
              label={String(item.examYear)}
              size="small"
              variant="outlined"
              sx={{ backgroundColor: (t) => t.palette.action.hover }}
            />
          )}
          {item.university && (
            <Chip
              label={item.university}
              size="small"
              variant="outlined"
              sx={{ backgroundColor: (t) => t.palette.action.hover }}
            />
          )}
        </Stack>

        {/* タイトル 大きく 太字 中央揃え */}
        <Box sx={{ textAlign: 'center', my: 1, width: '100%' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              display: 'block',
              width: '100%',
              textAlign: 'center'
            }}
          >
            {item.title}
          </Typography>
        </Box>

        {/* 学問系統、学問分野をチップで表示 */}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-start', alignItems: 'center', mt: 0.5 }}>
          {item.majorType !== undefined && (
            <Chip
              label={t(getEnumLabelKey('academic_track', item.majorType) || '')}
              size="small"
              variant="outlined"
              sx={{ backgroundColor: (t) => t.palette.action.hover }}
            />
          )}
          {(item.academicFieldId !== undefined || item.academicFieldName) && (
            <Chip
              label={item.academicFieldId !== undefined
                ? t(getEnumLabelKey('academic_field', item.academicFieldId) || '')
                : item.academicFieldName}
              size="small"
              variant="outlined"
              sx={{ backgroundColor: (t) => t.palette.action.hover }}
            />
          )}
        </Stack>

        {/* 科目名、所要時間をチップで表示 */}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-start', alignItems: 'center', mt: 0.5 }}>
          {item.subjectName && (
            <Chip
              label={item.subjectName}
              size="small"
              sx={{ backgroundColor: (t) => t.palette.action.hover }}
            />
          )}
          {item.durationMinutes != null && (
            <Chip
              label={`${item.durationMinutes}分`}
              size="small"
              variant="outlined"
              sx={{ backgroundColor: (t) => t.palette.action.hover }}
            />
          )}
        </Stack>
      </CardContent>

      {/* Footer: Good + count (left aligned), VIEW count next to it */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', px: 2, pb: 1, gap: 2 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <IconButton
            aria-label="good"
            size="small"
            onClick={(e) => { e.stopPropagation(); handleGood(); }}
            sx={{ color: 'text.secondary' }}
          >
            <ThumbUpOffAltIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <Typography variant="caption" color="text.secondary">{item.likes ?? 0}</Typography>
        </Stack>

        <Stack direction="row" spacing={0.5} alignItems="center">
          <VisibilityIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">{item.views ?? 0}</Typography>
        </Stack>
      </Box>
    </Card>
  );
};

export default ExamCardCompact;
