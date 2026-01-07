import { Fragment } from 'react';
import type { FC, ReactNode, SyntheticEvent, FormEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  TextField,
  Paper,
  Stack,
  Typography,
  Grid,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
  FormControlLabel,
  Switch,
} from '@mui/material';
import type { ExamFormValues } from '../schema';
import React, { useEffect, useState, useMemo } from 'react';
import { getLookup, searchLookup, type LookupItem } from '@/services/api/gateway/lookups';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import {
  EXAM_TYPE_ENUM_OPTIONS,
  ACADEMIC_TRACK_ENUM_OPTIONS,
  ACADEMIC_FIELD_ENUM_OPTIONS,
  getEnumLabelKey
} from '@/lib/enums/enumHelpers';

/**
 * 試験メタデータセクション
 *
 * 試験名、実施年など、Exam スキーマのトップレベルメタデータを編集します。
 * ReadOnly フラグで編集/閲覧モードを自動切り替え。
 */
interface ExamMetaSectionProps {
  isEditMode: boolean;
}

export const ExamMetaSection: FC<ExamMetaSectionProps> = ({ isEditMode }: ExamMetaSectionProps) => {
  const { control, watch, setValue, getValues } = useFormContext<ExamFormValues>();

  const examName = watch('examName');
  const examYear = watch('examYear');
  const universityName = watch('universityName');
  const facultyName = watch('facultyName');
  const teacherName = watch('teacherName');
  const subjectName = watch('subjectName');
  const durationMinutes = watch('durationMinutes');
  const examType = watch('examType');
  const majorType = watch('majorType');
  const academicFieldName = watch('academicFieldName');
  const academicFieldId = watch('academicFieldId');

  // --- LookupAutocomplete component (small helper) ---
  const LookupAutocomplete: FC<{ entity: string; nameField: string; idField: string; label: string }> = ({ entity, nameField, idField, label }) => {
    const nameValue = watch(nameField as any) as string;
    const [options, setOptions] = useState<LookupItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');

    // On mount, try fetching full list; if size <=15 keep as full options, else use search
    useEffect(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        try {
          const all = await getLookup(entity);
          if (!mounted) return;
          if (all.length <= 15) {
            setOptions(all);
          } else {
            setOptions([]); // force search mode
          }
        } catch (err) {
          console.warn('[LookupAutocomplete] getLookup failed', entity, err);
        } finally {
          if (mounted) setLoading(false);
        }
      })();
      return () => { mounted = false; };
    }, [entity]);

    // Search when input changes and options is empty (large dataset)
    useEffect(() => {
      if (inputValue.length < 2) return;
      if (options.length > 0) return; // small dataset already loaded
      let mounted = true;
      const id = setTimeout(async () => {
        try {
          setLoading(true);
          const res = await searchLookup(entity, inputValue, 10, 0);
          if (!mounted) return;
          setOptions(res.items || []);
        } catch (err) {
          console.warn('[LookupAutocomplete] searchLookup failed', entity, err);
        } finally {
          if (mounted) setLoading(false);
        }
      }, 250);
      return () => { mounted = false; clearTimeout(id); };
    }, [inputValue, entity, options.length]);

    return (
      <Controller
        name={nameField as any}
        control={control}
        render={({ field }: { field: any }) => (
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(opt: any) => (typeof opt === 'string' ? opt : opt.name || '')}
            value={(options.find(o => o.name === field.value) as any) || null}
            onChange={(_: any, value: any) => {
              if (typeof value === 'string') {
                field.onChange(value);
                setValue(idField as any, undefined);
              } else if (value && typeof value === 'object') {
                field.onChange(value.name);
                setValue(idField as any, value.id);
              } else {
                field.onChange('');
                setValue(idField as any, undefined);
              }
            }}
            inputValue={inputValue}
            onInputChange={(_: any, newInput: string) => {
              setInputValue(newInput);
              field.onChange(newInput);
              // clear id when user types
              setValue(idField as any, undefined);
            }}
            renderInput={(params: any) => (
              <TextField
                {...params}
                label={label}
                size="small"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            isOptionEqualToValue={(option: any, value: any) => option.id === (value as any)?.id}
          />
        )}
      />
    );
  };


  // 統計情報（読み取り専用）
  const viewCount = watch('viewCount' as any) || 0;
  const goodCount = watch('goodCount' as any) || 0;
  const badCount = watch('badCount' as any) || 0;
  const commentCount = watch('commentCount' as any) || 0;

  const { t } = useTranslation();

  const MetaField = ({ label, value }: { label: string; value?: string | number | boolean }) => {
    if (!value && value !== 0 && value !== '') return null;
    return (
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 4,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: (theme: any) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack spacing={3}>
        {/* ヘッダー・タイトルセクション */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
              {isEditMode ? (
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Controller
                    name="examType"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <InputLabel id="exam-type-label">種別</InputLabel>
                        <Select
                          {...field}
                          labelId="exam-type-label"
                          id="exam-type-select"
                          label="種別"
                          onChange={(e: any) => field.onChange(Number(e.target.value))}
                        >
                          {EXAM_TYPE_ENUM_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {t(opt.labelKey)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="examName"
                    control={control}
                    render={({ field, fieldState: { error } }: any) => (
                      <TextField
                        {...field}
                        label="試験名"
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  />
                </Stack>
              ) : (
                <>
                  {examType !== undefined && (
                    <Typography variant="caption" sx={{
                      backgroundColor: (theme: any) => {
                        switch (examType) {
                          case 0: return '#1565c0'; // 定期試験：濃青
                          case 1: return '#c62828'; // 授業内試験：濃赤
                          case 2: return '#2e7d32'; // 小テスト：濃緑
                          default: return theme.palette.action.hover;
                        }
                      },
                      color: (theme: any) => {
                        const backgroundColor =
                          examType === 0 ? '#1565c0' :
                            examType === 1 ? '#c62828' :
                              examType === 2 ? '#2e7d32' :
                                theme.palette.background.paper;
                        return theme.palette.getContrastText(backgroundColor);
                      },
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 700,
                    }}>
                      【{t(getEnumLabelKey('examType', examType) || '') || '不明'}】
                    </Typography>
                  )}
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    {examName || '試験情報'}
                  </Typography>
                </>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1, flexWrap: 'wrap' }}>
              {isEditMode ? (
                <>

                  <Controller
                    name="majorType"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <InputLabel id="major-type-label">系統</InputLabel>
                        <Select
                          {...field}
                          labelId="major-type-label"
                          id="major-type-select"
                          label="系統"
                          onChange={(e: any) => field.onChange(Number(e.target.value))}
                        >
                          {ACADEMIC_TRACK_ENUM_OPTIONS.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {t(opt.labelKey)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="academicFieldName"
                    control={control}
                    render={({ field }: { field: any }) => (
                      <Autocomplete
                        freeSolo
                        options={ACADEMIC_FIELD_ENUM_OPTIONS.map(opt => t(opt.labelKey))}
                        value={field.value || ''}
                        onChange={(_: any, newValue: any) => {
                          field.onChange(newValue);
                          if (newValue && typeof newValue === 'string') {
                            const matchedOption = ACADEMIC_FIELD_ENUM_OPTIONS.find(opt => t(opt.labelKey) === newValue);
                            if (matchedOption) {
                              setValue('academicFieldId', matchedOption.value);
                            } else {
                              setValue('academicFieldId', undefined);
                            }
                          } else {
                            setValue('academicFieldId', undefined);
                          }
                        }}
                        onInputChange={(_: any, newInputValue: string) => field.onChange(newInputValue)}
                        renderInput={(params: any) => (
                          <TextField
                            {...params}
                            label="学問分野"
                            size="small"
                            sx={{ minWidth: 200 }}
                            variant="outlined"
                          />
                        )}
                      />
                    )}
                  />
                </>
              ) : (
                <>
                  {majorType !== undefined && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t(getEnumLabelKey('academic_track', majorType) || '')}
                    </Typography>
                  )}
                  {majorType !== undefined && (academicFieldId !== undefined || academicFieldName) && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      :
                    </Typography>
                  )}
                  {(academicFieldId !== undefined) ? (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {t(getEnumLabelKey('academic_field', academicFieldId) || '')}
                    </Typography>
                  ) : academicFieldName && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {academicFieldName}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Box>

          {/* Top Right Action: Publish Toggle */}
          {isEditMode && (
            <Box>
              <Controller
                name="isPublic"
                control={control}
                render={({ field }: { field: any }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value ?? false}
                        onChange={(e: any) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={field.value ? '公開' : '非公開'}
                    labelPlacement="start"
                  />
                )}
              />
            </Box>
          )}
        </Box>

        <Divider />

        {/* グリッド: 大学名、学部、教授、年度、科目、時間 */}
        <Box>
          <Grid container spacing={3}>
            {/* 大学名 */}
            <Grid item xs={12} sm={6} md={4}>
              {isEditMode ? (
                <LookupAutocomplete entity="universities" nameField="universityName" idField="universityId" label="大学名" />
              ) : (
                <MetaField label="大学名" value={universityName} />
              )}
            </Grid>
            {/* 学部 */}
            <Grid item xs={12} sm={6} md={4}>
              {isEditMode ? (
                <LookupAutocomplete entity="faculties" nameField="facultyName" idField="facultyId" label="学部" />
              ) : (
                <MetaField label="学部" value={facultyName} />
              )}
            </Grid>
            {/* 教授 */}
            <Grid item xs={12} sm={6} md={4}>
              {isEditMode ? (
                <LookupAutocomplete entity="teachers" nameField="teacherName" idField="teacherId" label="教授" />
              ) : (
                <MetaField label="教授" value={teacherName} />
              )}
            </Grid>
            {/* 実施年 */}
            <Grid item xs={12} sm={6} md={4}>
              {isEditMode ? (
                <Controller
                  name="examYear"
                  control={control}
                  render={({ field }: { field: any }) => (
                    <TextField
                      {...field}
                      label="試験年度"
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      onChange={(e: any) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              ) : (
                <MetaField label="試験年度" value={examYear} />
              )}
            </Grid>
            {/* 科目名 */}
            <Grid item xs={12} sm={6} md={4}>
              {isEditMode ? (
                <Controller
                  name="subjectName"
                  control={control}
                  render={({ field }: { field: any }) => (
                    <TextField {...field} label="科目名" fullWidth variant="outlined" size="small" />
                  )}
                />
              ) : (
                <MetaField label="科目名" value={subjectName} />
              )}
            </Grid>
            {/* 所要時間 */}
            <Grid item xs={12} sm={6} md={4}>
              {isEditMode ? (
                <Controller
                  name="durationMinutes"
                  control={control}
                  render={({ field }: { field: any }) => (
                    <TextField
                      {...field}
                      label="所要時間 (分)"
                      fullWidth
                      type="number"
                      variant="outlined"
                      size="small"
                      onChange={(e: any) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />
              ) : (
                <MetaField label="所要時間" value={durationMinutes ? `${durationMinutes}分` : undefined} />
              )}
            </Grid>
          </Grid>
        </Box>

        {/* 閲覧情報・統計情報 */}
        {!isEditMode && (
          <>
            <Divider />
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={6} sm={4} md={3}>
                  <MetaField label="閲覧数" value={`${viewCount}回`} />
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <MetaField label="高評価数" value={`${goodCount}件`} />
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <MetaField label="低評価数" value={`${badCount}件`} />
                </Grid>
                <Grid item xs={6} sm={4} md={3}>
                  <MetaField label="コメント数" value={`${commentCount}件`} />
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};
