import React from 'react';
import { FormControl, InputLabel, Select, SelectProps, MenuItem } from '@mui/material';

export interface DifficultySelectProps extends Omit<SelectProps, 'children'> {
  /** オプションのラベル（デフォルト: 標準） */
  labels?: {
    [key: number]: string;
  };
}

const defaultLabels = {
  0: '未設定',
  1: '基礎',
  2: '応用',
  3: '発展',
};

/**
 * 難易度プルダウンコンポーネント
 * 
 * QuestionBlock/SubQuestionBlock で使用される共通コンポーネント
 * 難易度を選択（未設定、基礎、応用、発展）
 */
export const DifficultySelect = React.forwardRef<HTMLInputElement, DifficultySelectProps>(
  ({ labels = defaultLabels, label = '難易度', size = 'small', fullWidth = true, id, name, ...props }, ref) => {
    const generatedId = React.useId();
    const actualId = id || `difficulty-select-${generatedId}`;
    const labelId = `${actualId}-label`;

    return (
      <FormControl fullWidth={fullWidth} size={size}>
        <InputLabel id={labelId}>{label}</InputLabel>
        <Select
          ref={ref}
          labelId={labelId}
          id={actualId}
          name={name || actualId}
          label={label}
          size={size}
          {...props}
        >
          {Object.entries(labels).map(([value, labelText]) => (
            <MenuItem key={value} value={Number(value)}>
              {labelText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

DifficultySelect.displayName = 'DifficultySelect';

export default DifficultySelect;
