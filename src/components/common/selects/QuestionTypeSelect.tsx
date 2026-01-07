import { Fragment } from 'react';
import type { FC, ReactNode, SyntheticEvent, FormEvent } from 'react';
import { FormControl, InputLabel, Select, SelectProps, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getEnumOptions } from '@/lib/i18nHelpers';

export interface QuestionTypeSelectProps extends Omit<SelectProps, 'children'> {
  /** オプション */
  options?: Array<{ value: number; label: string }>;
}


/**
 * 問題形式プルダウンコンポーネント
 * 
 * SubQuestionBlock で使用される共通コンポーネント
 * 問題形式を選択（単一選択、複数選択、正誤判定など）
 */
export const QuestionTypeSelect = React.forwardRef<HTMLInputElement, QuestionTypeSelectProps>(
  ({ options, label, size = 'small', fullWidth = true, id, name, ...props }, ref) => {
    const { t } = useTranslation();
    const generatedId = React.useId();
    const actualId = id || `question-type-select-${generatedId}`;
    const labelId = `${actualId}-label`;

    const resolvedLabel = label ?? t('filters.questionType');
    const resolvedOptions = options ?? getEnumOptions('questionType', t);

    return (
      <FormControl fullWidth={fullWidth} size={size}>
        <InputLabel id={labelId}>{resolvedLabel}</InputLabel>
        <Select
          ref={ref}
          labelId={labelId}
          id={actualId}
          name={name || actualId}
          label={resolvedLabel}
          size={size}
          {...props}
        >
          {resolvedOptions.map(({ value, label: labelText }) => (
            <MenuItem key={value} value={value}>
              {labelText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

QuestionTypeSelect.displayName = 'QuestionTypeSelect';

export default QuestionTypeSelect;
