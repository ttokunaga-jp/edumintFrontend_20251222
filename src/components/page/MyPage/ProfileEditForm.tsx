import React, { useState, FC } from 'react';
import {
  TextField,
  Stack,
  Box,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AutocompleteFilterField,
  SelectFilterField,
} from '@/components/common/SearchFilterFields';
import {
  LANGUAGE_ENUM_OPTIONS,
  ACADEMIC_TRACK_ENUM_OPTIONS,
  getEnumLabelKey,
} from '@/lib/enums/enumHelpers';

// マスターデータ（AdvancedSearchPanelと同じ）
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

export interface ProfileEditFormData {
  displayName: string;
  email?: string;
  universities?: string[];
  faculties?: string[];
  academicField?: string;
  academicSystem?: number; // Numeric ID (0 or 1)
  language?: number; // Numeric ID
}

export interface ProfileEditFormProps {
  isEditing: boolean;
  editForm: ProfileEditFormData;
  onFormChange: (form: ProfileEditFormData) => void;
  user?: {
    displayName?: string;
    username: string;
    email: string;
  };
  profile?: {
    university?: string;
    faculty?: string;
    academicField?: string;
    academicSystem?: number;
    language?: number;
  };
}

/**
 * プロフィール編集フォーム
 * MyPage のプロフィール編集 Accordion 内で使用される共通フォーム
 * 共通SearchFilterFieldコンポーネントを使用
 */
export const ProfileEditForm: FC<ProfileEditFormProps> = ({
  isEditing,
  editForm,
  onFormChange,
  user,
  profile,
}) => {
  const [emailError, setEmailError] = useState<string>('');
  const { t } = useTranslation();

  const getLanguageLabel = (languageValue: number | undefined): string => {
    if (languageValue === undefined) return '未設定';
    const labelKey = getEnumLabelKey('language', languageValue);
    return labelKey ? t(labelKey) : '未設定';
  };

  const handleFieldChange = (field: keyof ProfileEditFormData, value: any) => {
    onFormChange({
      ...editForm,
      [field]: value,
    });
  };

  // メールアドレスバリデーション
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid || email === '' ? '' : 'メールアドレスの形式が正しくありません');
    return isValid;
  };

  if (isEditing) {
    // 編集モード
    return (
      <Stack spacing={2}>
        {/* 基本情報 */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 2 }}>
          基本情報
        </Typography>

        <TextField
          id="display-name-input"
          label="表示名"
          value={editForm.displayName || ''}
          onChange={(e) => handleFieldChange('displayName', e.target.value)}
          fullWidth
          variant="outlined"
          size="small"
        />



        <TextField
          id="email-input"
          label="メールアドレス"
          type="email"
          value={editForm.email || user?.email || ''}
          onChange={(e) => {
            handleFieldChange('email', e.target.value);
            validateEmail(e.target.value);
          }}
          onBlur={() => validateEmail(editForm.email || user?.email || '')}
          fullWidth
          variant="outlined"
          size="small"
          error={emailError !== ''}
          helperText={emailError}
        />

        {/* 大学・学部情報 */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 3 }}>
          大学・学部情報
        </Typography>

        <AutocompleteFilterField
          label="大学"
          options={UNIVERSITIES}
          value={editForm.universities || (profile?.university ? [profile.university] : [])}
          multiple={true}
          onChange={(value) => handleFieldChange('universities', value)}
          placeholder="選択または入力"
        />

        <AutocompleteFilterField
          label="学部"
          options={FACULTIES}
          value={editForm.faculties || (profile?.faculty ? [profile.faculty] : [])}
          multiple={true}
          onChange={(value) => handleFieldChange('faculties', value)}
          placeholder="選択または入力"
        />

        <AutocompleteFilterField
          label="学問分野"
          options={FIELDS}
          value={editForm.academicField || profile?.academicField || ''}
          multiple={false}
          onChange={(value) => handleFieldChange('academicField', value)}
          placeholder="選択または入力"
        />

        {/* 学問系統・言語 */}
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 3 }}>
          学問系統・言語
        </Typography>

        <SelectFilterField
          label="学問系統（文系・理系）"
          options={ACADEMIC_TRACK_ENUM_OPTIONS.map(opt => ({ value: opt.value, label: t(opt.labelKey) }))}
          value={editForm.academicSystem ?? profile?.academicSystem ?? ''}
          onChange={(value) => handleFieldChange('academicSystem', Number(value))}
        />

        <SelectFilterField
          label="言語"
          options={LANGUAGE_ENUM_OPTIONS.map(opt => ({ value: opt.value, label: t(opt.labelKey) }))}
          value={editForm.language ?? profile?.language ?? ''}
          onChange={(value) => handleFieldChange('language', Number(value))}
        />
      </Stack>
    );
  }

  // 表示モード
  return (
    <Stack spacing={2}>
      {/* 基本情報 */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        基本情報
      </Typography>

      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          表示名
        </Typography>
        <Typography variant="body2">
          {user?.displayName || '未設定'}
        </Typography>
      </Box>



      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          メールアドレス
        </Typography>
        <Typography variant="body2">
          {user?.email}
        </Typography>
      </Box>

      {/* 大学・学部情報 */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 3 }}>
        大学・学部情報
      </Typography>

      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          大学
        </Typography>
        <Typography variant="body2">
          {profile?.university || '未設定'}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          学部
        </Typography>
        <Typography variant="body2">
          {profile?.faculty || '未設定'}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          学問分野
        </Typography>
        <Typography variant="body2">
          {profile?.academicField || '未設定'}
        </Typography>
      </Box>

      {/* 学問系統・言語 */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mt: 3 }}>
        学問系統・言語
      </Typography>

      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          学問系統（文系・理系）
        </Typography>
        <Typography variant="body2">
          {profile?.academicSystem !== undefined
            ? t(getEnumLabelKey('academic_track', profile.academicSystem) || '')
            : '未設定'}
        </Typography>
      </Box>

      <Box>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
          言語
        </Typography>
        <Typography variant="body2">
          {getLanguageLabel(profile?.language)}
        </Typography>
      </Box>
    </Stack>
  );
};
