import { TextField, FormHelperText, Box } from '@mui/material';
import { useState, useEffect } from 'react';

export interface YearInputFieldProps {
  label: string;
  value: string;
  defaultValue?: string; // 前年の西暦
  onChange: (value: string) => void;
}

/**
 * 試験年度の特殊入力フィールド
 * - スピナー（↑↓）ボタン付き
 * - 4桁バリデーション
 * - 全角→半角自動変換
 */
export function YearInputField({
  label,
  value,
  defaultValue,
  onChange,
}: YearInputFieldProps) {
  const [error, setError] = useState<string>('');

  // 全角→半角変換
  const normalizeInput = (input: string): string => {
    return input.replace(/[０-９]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0xFEE0)
    );
  };

  // バリデーション
  const validateYear = (input: string): boolean => {
    const normalized = normalizeInput(input);

    // 空文字列は許可
    if (normalized === '') {
      setError('');
      return true;
    }

    // 数値チェック
    if (!/^\d+$/.test(normalized)) {
      setError('数値のみ入力してください');
      return false;
    }

    // 4桁チェック
    if (normalized.length !== 4) {
      setError('4桁の西暦を入力してください');
      return false;
    }

    // 年の範囲チェック
    const year = parseInt(normalized, 10);
    if (year < 1900 || year > 2099) {
      setError('1900～2099年の範囲で入力してください');
      return false;
    }

    setError('');
    return true;
  };

  const handleChange = (newValue: string) => {
    const normalized = normalizeInput(newValue);
    onChange(normalized);
    if (normalized !== '') {
      validateYear(normalized);
    } else {
      setError('');
    }
  };

  const handleIncrement = () => {
    const currentYear = parseInt(value || new Date().getFullYear().toString(), 10);
    const newYear = Math.min(currentYear + 1, 2099).toString();
    handleChange(newYear);
  };

  const handleDecrement = () => {
    const currentYear = parseInt(value || new Date().getFullYear().toString(), 10);
    const newYear = Math.max(currentYear - 1, 1900).toString();
    handleChange(newYear);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label={label}
        type="text"
        placeholder="例: 2025"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => validateYear(value)}
        error={error !== ''}
        slotProps={{
          input: {
            // Material-UIの型バージョンによって異なる場合があります
            type: 'number',
          },
        }}
      />
      {error && (
        <FormHelperText error={true}>{error}</FormHelperText>
      )}
    </Box>
  );
}
