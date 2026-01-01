import React, { useState } from 'react';
import { Box, TextField, Chip, Stack, Typography } from '@mui/material';

export interface KeywordInputProps {
  /** 既存のキーワード */
  keywords?: Array<{ id: string; keyword: string }>;
  /** キーワード追加時のコールバック */
  onAdd?: (keyword: string) => void;
  /** キーワード削除時のコールバック */
  onRemove?: (keywordId: string) => void;
  /** ラベル */
  label?: string;
  /** 読み取り専用モード */
  readOnly?: boolean;
  /** ヘルパーテキスト */
  helperText?: string;
  /** 入力フィールドの一意な ID */
  inputId?: string;
}

/**
 * キーワード入力コンポーネント
 * 
 * キーワード追加用の入力フォーム + 既存キーワードをChipで表示
 * QuestionBlock/SubQuestionBlock で使用される共通コンポーネント
 */
export const KeywordInput: React.FC<KeywordInputProps> = ({
  keywords = [],
  onAdd,
  onRemove,
  label = 'キーワード',
  readOnly = false,
  helperText = 'キーワードを入力して Enter キーを押す',
  inputId,
}) => {
  const [inputValue, setInputValue] = useState('');
  const generatedId = React.useId();
  const actualId = inputId || `keyword-input-${generatedId}`;

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && !readOnly) {
      e.preventDefault();
      onAdd?.(inputValue.trim());
      setInputValue('');
    }
  };

  const handleDelete = (keywordId: string) => {
    onRemove?.(keywordId);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      {/* 入力フォーム */}
      {!readOnly && (
        <TextField
          id={actualId}
          name={actualId}
          label={label}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="キーワードを入力..."
          size="small"
          fullWidth
          helperText={helperText}
          variant="outlined"
        />
      )}

      {/* キーワードチップ表示 */}
      {keywords.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {keywords.map((kw) => (
            <Chip
              key={kw.id}
              label={kw.keyword}
              onDelete={readOnly ? undefined : () => handleDelete(kw.id)}
              size="small"
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      {/* 空状態メッセージ */}
      {keywords.length === 0 && !readOnly && (
        <Typography variant="caption" color="textSecondary">
          キーワードはまだ追加されていません
        </Typography>
      )}
    </Box>
  );
};

export default KeywordInput;
