import React from 'react';
import { FormControl, InputLabel, Select, SelectProps, MenuItem } from '@mui/material';

export interface QuestionFormatSelectProps extends Omit<SelectProps, 'children'> {
  /** フォーマットオプション */
  formats?: Array<{ value: 0 | 1; label: string }>;
}

const defaultFormats = [
  { value: 0, label: 'Markdown' },
  { value: 1, label: 'LaTeX' },
] as const;

/**
 * 問題形式プルダウンコンポーネント
 * 
 * QuestionBlock/SubQuestionBlock で使用される共通コンポーネント
 * 問題形式を選択（Markdown, LaTeX）
 */
export const QuestionFormatSelect = React.forwardRef<HTMLInputElement, QuestionFormatSelectProps>(
  ({ formats = defaultFormats, label = '問題形式', size = 'small', fullWidth = true, ...props }, ref) => {
    return (
      <FormControl fullWidth={fullWidth} size={size}>
        <InputLabel>{label}</InputLabel>
        <Select
          ref={ref}
          label={label}
          size={size}
          {...props}
        >
          {formats.map((format) => (
            <MenuItem key={format.value} value={format.value}>
              {format.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

QuestionFormatSelect.displayName = 'QuestionFormatSelect';

export default QuestionFormatSelect;
