import { Fragment } from 'react';
import type { FC, ReactNode, SyntheticEvent, FormEvent } from 'react';
import { FormControl, InputLabel, Select, SelectProps, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface LevelSelectProps extends Omit<SelectProps, 'children'> {
  /** オプションのラベル（デフォルト: 標準） */
  labels?: {
    [key: number]: string;
  };
}

const defaultLabels = {
  0: '基礎',
  1: '標準',
  2: '応用',
};

/**
 * 難易度プルダウンコンポーネント
 * 
 * QuestionBlock/SubQuestionBlock で使用される共通コンポーネント
 * 難易度を選択（基礎、標準、応用）
 * 
 * 注：value が undefined の場合は自動的に 1 (標準) にデフォルト設定される
 */
export const LevelSelect = React.forwardRef<HTMLInputElement, LevelSelectProps>(
  ({ labels, label, size = 'small', fullWidth = true, id, name, ...props }, ref) => {
    const generatedId = React.useId();
    const actualId = id || `level-select-${generatedId}`;
    const labelId = `${actualId}-label`;
    const { t } = useTranslation();

    const resolvedLabels = labels ?? {
      0: t('enum.level.basic'),
      1: t('enum.level.standard'),
      2: t('enum.level.advanced'),
    };

    const resolvedLabel = label ?? t('filters.level');

    // value が undefined の場合は 1 (標準) にデフォルト設定
    const actualValue = props.value ?? 1;

    return (
      <FormControl size={size} sx={{ minWidth: '140px' }}>
        <InputLabel id={labelId}>{resolvedLabel}</InputLabel>
        <Select
          ref={ref}
          labelId={labelId}
          id={actualId}
          name={name || actualId}
          label={resolvedLabel}
          size={size}
          {...props}
          value={actualValue}
        >
          {Object.entries(resolvedLabels).map(([value, labelText]) => (
            <MenuItem key={value} value={Number(value)}>
              {labelText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

LevelSelect.displayName = 'LevelSelect';

export default LevelSelect;
