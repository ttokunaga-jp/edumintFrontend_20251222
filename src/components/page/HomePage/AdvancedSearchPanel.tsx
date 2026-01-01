import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Stack,
  Button,
  Typography,
  Chip,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AutocompleteFilterField,
  SelectFilterField,
  CheckboxGroupField,
  YearInputField,
} from '../../common/SearchFilterFields';

export interface SearchFilters {
  keyword?: string;
  universities?: string[];
  faculties?: string[];
  academicField?: string;
  professor?: string;
  year?: string;
  fieldType?: string;
  level?: string;
  formats?: string[];
  duration?: string;
  period?: string;
  academicSystem?: 'liberal-arts' | 'science';
  sortBy?: 'recommended' | 'newest' | 'popular' | 'views';
  isLearned?: boolean;
  isHighRating?: boolean;
  isCommented?: boolean;
  isPosted?: boolean;
  language?: string;
}

export interface AdvancedSearchPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  isOpen?: boolean;
  userProfile?: {
    university?: string;
    faculty?: string;
    academicField?: string;
    academicSystem?: 'liberal-arts' | 'science';
    language?: 'ja' | 'en' | 'zh' | 'ko' | 'other';
  };
}

// マスターデータ
const UNIVERSITIES = [
  '東京大学',
  '京都大学',
  '大阪大学',
  '東北大学',
  '慶應義塾大学',
  '早稲田大学',
  '岡山大学',
  '北海道大学',
];

const FACULTIES = [
  '工学部',
  '理学部',
  '医学部',
  '文学部',
  '経済学部',
  '法学部',
  '教育学部',
  '農学部',
];

const ACADEMIC_FIELDS = [
  { value: 'liberal-arts', label: '文系' },
  { value: 'science', label: '理系' },
  { value: 'all', label: 'すべて' },
];

const ACADEMIC_SYSTEMS = [
  { value: 'liberal-arts', label: '文系' },
  { value: 'science', label: '理系' },
];

const CUSTOM_SEARCH_OPTIONS = ['学習済', '高評価', 'コメント', '投稿'];

const SUBJECTS = [
  '数学',
  '物理',
  '化学',
  '生物',
  '英語',
  '国語',
  '地理',
  '歴史',
  '情報',
];

const FIELDS = [
  '微分積分',
  '線形代数',
  '力学',
  '電磁気学',
  '有機化学',
  '無機化学',
  '細胞生物学',
  'アルゴリズム',
];

const LEVELS = [
  { value: 'basic', label: '基礎' },
  { value: 'standard', label: '標準' },
  { value: 'advanced', label: '応用' },
  { value: 'expert', label: '難関' },
];

// 新規問題形式（ID 1-5, 10-14）
// パターンA：選択・構造化データ系 (ID 1-5)
// パターンB：自由記述・テキスト系 (ID 10-14)
const PROBLEM_FORMATS = [
  // パターンA：選択系
  '単一選択',
  '複数選択',
  '正誤判定',
  '組み合わせ',
  '順序並べ替え',
  // パターンB：記述系
  '記述式',
  '証明問題',
  'コード記述',
  '翻訳',
  '数値計算',
];

const DURATIONS = [
  { value: 'short', label: '5分以内' },
  { value: 'medium', label: '15分以内' },
  { value: 'long', label: '30分以上' },
];

const PERIODS = [
  { value: 'none', label: '指定なし' },
  { value: '1day', label: '1日以内' },
  { value: '1week', label: '1週間以内' },
  { value: '1month', label: '1ヶ月以内' },
  { value: '1year', label: '1年以内' },
  { value: 'custom', label: '期間指定' },
];

const LANGUAGES = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: '英語' },
  { value: 'zh', label: '中国語' },
  { value: 'ko', label: '韓国語' },
  { value: 'other', label: 'その他' },
];

const CURRENT_YEARS = ['2025', '2024', '2023', '2022', '2021'];

/**
 * HomePage の詳細検索パネル
 * 大学、学部、科目、教授、試験年度、分野、レベル、問題形式、期間などのフィルターを提供する
 */
export function AdvancedSearchPanel({
  filters,
  onFiltersChange,
  isOpen = false,
  userProfile,
}: AdvancedSearchPanelProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(isOpen);

  // デフォルト値を決定する関数
  const getDefaultYear = (): string => {
    return (new Date().getFullYear() - 1).toString();
  };

  // ローカル状態管理（プロフィール値がある場合はデフォルトに設定）
  const [localFilters, setLocalFilters] = useState<SearchFilters>(() => {
    // プロフィール値を優先的に使用（ユーザーが明示的に変更しない限り）
    return {
      ...filters,
      universities: filters.universities && filters.universities.length > 0 
        ? filters.universities 
        : (userProfile?.university ? [userProfile.university] : []),
      faculties: filters.faculties && filters.faculties.length > 0 
        ? filters.faculties 
        : (userProfile?.faculty ? [userProfile.faculty] : []),
      academicField: filters.academicField || userProfile?.academicField || '',
      year: filters.year || getDefaultYear(),
      level: filters.level || '',
      formats: filters.formats || [],
      period: filters.period || '',
      duration: filters.duration || '',
      academicSystem: filters.academicSystem || userProfile?.academicSystem || '',
      language: filters.language || userProfile?.language || '',
      professor: filters.professor || '',
      fieldType: filters.fieldType || '',
      sortBy: filters.sortBy,
      isLearned: filters.isLearned || false,
      isHighRating: filters.isHighRating || false,
      isCommented: filters.isCommented || false,
      isPosted: filters.isPosted || false,
    };
  });

  const handleFilterChange = useCallback(
    (key: keyof SearchFilters, value: string | string[] | boolean) => {
      const updated = {
        ...localFilters,
        [key]: value,
      };
      setLocalFilters(updated);
    },
    [localFilters]
  );

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      keyword: localFilters.keyword,
      sortBy: localFilters.sortBy,
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  // 適用中のフィルターを取得
  const getActiveFilters = (): {
    label: string;
    key: keyof SearchFilters;
    value: string | string[] | boolean;
  }[] => {
    const active = [];

    if (filters.universities && filters.universities.length > 0) {
      active.push({
        label: `大学: ${filters.universities.join(', ')}`,
        key: 'universities',
        value: filters.universities,
      });
    }

    if (filters.faculties && filters.faculties.length > 0) {
      active.push({
        label: `学部: ${filters.faculties.join(', ')}`,
        key: 'faculties',
        value: filters.faculties,
      });
    }

    if (filters.academicField) {
      const fieldLabel = ACADEMIC_FIELDS.find((f) => f.value === filters.academicField)?.label || filters.academicField;
      active.push({
        label: `学問系統: ${fieldLabel}`,
        key: 'academicField',
        value: filters.academicField,
      });
    }

    if (filters.professor) {
      active.push({
        label: `教授: ${filters.professor}`,
        key: 'professor',
        value: filters.professor,
      });
    }

    if (filters.year) {
      active.push({
        label: `試験年度: ${filters.year}`,
        key: 'year',
        value: filters.year,
      });
    }

    if (filters.fieldType) {
      active.push({
        label: `分野: ${filters.fieldType}`,
        key: 'fieldType',
        value: filters.fieldType,
      });
    }

    if (filters.level) {
      const levelLabel = LEVELS.find((l) => l.value === filters.level)?.label || filters.level;
      active.push({
        label: `レベル: ${levelLabel}`,
        key: 'level',
        value: filters.level,
      });
    }

    if (filters.academicSystem) {
      const systemLabel = ACADEMIC_SYSTEMS.find((s) => s.value === filters.academicSystem)?.label || filters.academicSystem;
      active.push({
        label: `学問系統: ${systemLabel}`,
        key: 'academicSystem',
        value: filters.academicSystem,
      });
    }

    if (filters.formats && filters.formats.length > 0) {
      active.push({
        label: `問題形式: ${filters.formats.join(', ')}`,
        key: 'formats',
        value: filters.formats,
      });
    }

    if (filters.period) {
      const periodLabel = PERIODS.find((p) => p.value === filters.period)?.label || filters.period;
      active.push({
        label: `期間: ${periodLabel}`,
        key: 'period',
        value: filters.period,
      });
    }

    if (filters.duration) {
      const durationLabel =
        DURATIONS.find((d) => d.value === filters.duration)?.label || filters.duration;
      active.push({
        label: `所要時間: ${durationLabel}`,
        key: 'duration',
        value: filters.duration,
      });
    }

    if (filters.isLearned) {
      active.push({
        label: '学習済',
        key: 'isLearned',
        value: true,
      });
    }

    if (filters.isHighRating) {
      active.push({
        label: '高評価',
        key: 'isHighRating',
        value: true,
      });
    }

    if (filters.isCommented) {
      active.push({
        label: 'コメント',
        key: 'isCommented',
        value: true,
      });
    }

    if (filters.isPosted) {
      active.push({
        label: '投稿',
        key: 'isPosted',
        value: true,
      });
    }

    if (filters.language) {
      const langLabel = LANGUAGES.find((l) => l.value === filters.language)?.label || filters.language;
      active.push({
        label: `言語: ${langLabel}`,
        key: 'language',
        value: filters.language,
      });
    }

    return active;
  };

  const activeFilters = getActiveFilters();

  const handleRemoveFilter = (key: keyof SearchFilters) => {
    const updated = { ...filters };
    delete updated[key];
    onFiltersChange(updated);
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* 詳細検索アコーディオン */}
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        sx={{
          mb: 2,
          '&:before': { display: 'none' },
          boxShadow: 'none',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: '8px !important',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: expanded ? 'action.hover' : 'transparent',
            borderRadius: '8px',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {t('search.advanced_search')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              maxHeight: '50vh',
              overflowY: 'auto',
            }}
          >
            <Stack spacing={3}>
              {/* Row 1: 大学 | 学部 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <AutocompleteFilterField
                    label="大学"
                    options={UNIVERSITIES}
                    value={localFilters.universities || []}
                    multiple={true}
                    onChange={(value) => handleFilterChange('universities', value)}
                    placeholder="選択または入力"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AutocompleteFilterField
                    label="学部"
                    options={FACULTIES}
                    value={localFilters.faculties || []}
                    multiple={true}
                    onChange={(value) => handleFilterChange('faculties', value)}
                    placeholder="選択または入力"
                  />
                </Grid>
              </Grid>

              {/* Row 2: 学問分野 | 教授 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <AutocompleteFilterField
                    label="学問分野"
                    options={FIELDS}
                    value={localFilters.academicField || ''}
                    multiple={false}
                    onChange={(value) => handleFilterChange('academicField', value)}
                    placeholder="選択または入力"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <AutocompleteFilterField
                    label="教授"
                    options={[]}
                    value={localFilters.professor || ''}
                    multiple={false}
                    onChange={(value) => handleFilterChange('professor', typeof value === 'string' ? value : value[0] || '')}
                    placeholder="教授名を入力"
                  />
                </Grid>
              </Grid>

              {/* Row 3: 試験年度 | 難易度 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <YearInputField
                    label="試験年度"
                    value={localFilters.year || ''}
                    defaultValue={getDefaultYear()}
                    onChange={(value) => handleFilterChange('year', value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectFilterField
                    label="難易度"
                    options={LEVELS}
                    value={localFilters.level || ''}
                    onChange={(value) => handleFilterChange('level', value)}
                  />
                </Grid>
              </Grid>

              {/* Row 4: 問題形式 (Full width, checkbox format) */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  問題形式
                </Typography>
                <CheckboxGroupField
                  options={PROBLEM_FORMATS}
                  value={localFilters.formats || []}
                  onChange={(value) => handleFilterChange('formats', value)}
                  columns={{ xs: 12, sm: 6, md: 4 }}
                />
              </Box>

              {/* Row 5: 更新日時 | 所要時間 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <SelectFilterField
                    label="更新日時"
                    options={PERIODS}
                    value={localFilters.period || ''}
                    onChange={(value) => handleFilterChange('period', value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectFilterField
                    label="所要時間"
                    options={DURATIONS}
                    value={localFilters.duration || ''}
                    onChange={(value) => handleFilterChange('duration', value)}
                  />
                </Grid>
              </Grid>

              {/* Row 6: 学問系統（文系・理系） | 言語 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <SelectFilterField
                    label="学問系統（文系・理系）"
                    options={ACADEMIC_SYSTEMS}
                    value={localFilters.academicSystem || ''}
                    onChange={(value) => handleFilterChange('academicSystem', value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SelectFilterField
                    label="言語"
                    options={LANGUAGES}
                    value={localFilters.language || ''}
                    onChange={(value) => handleFilterChange('language', value)}
                  />
                </Grid>
              </Grid>

              {/* Row 7: Custom Search (Full width, checkbox format) */}
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Custom Search
                </Typography>
                <CheckboxGroupField
                  options={CUSTOM_SEARCH_OPTIONS}
                  value={[
                    ...(localFilters.isLearned ? ['学習済'] : []),
                    ...(localFilters.isHighRating ? ['高評価'] : []),
                    ...(localFilters.isCommented ? ['コメント'] : []),
                    ...(localFilters.isPosted ? ['投稿'] : []),
                  ]}
                  onChange={(values) => {
                    handleFilterChange('isLearned', values.includes('学習済'));
                    handleFilterChange('isHighRating', values.includes('高評価'));
                    handleFilterChange('isCommented', values.includes('コメント'));
                    handleFilterChange('isPosted', values.includes('投稿'));
                  }}
                  columns={{ xs: 6, sm: 3, md: 3 }}
                />
              </Box>

              {/* ボタンセクション */}
              <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleApplyFilters}
                  sx={{ minWidth: 120 }}
                >
                  {t('common.search')}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  sx={{ minWidth: 120 }}
                >
                  リセット
                </Button>
              </Stack>
            </Stack>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* 適用中のフィルター表示エリア */}
      {activeFilters.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            適用中のフィルター:
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={`${filter.key}-${JSON.stringify(filter.value)}`}
                label={filter.label}
                onDelete={() => handleRemoveFilter(filter.key)}
                variant="outlined"
                size="small"
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
