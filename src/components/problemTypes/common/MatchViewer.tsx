import React from 'react';
import { Box, Stack, Select, MenuItem, Typography, FormControl } from '@mui/material';
import { RichTextRenderer } from './RichTextRenderer';
import { OptionRow } from './OptionRow';

/**
 * MatchViewer
 * 
 * パターン2：ペアリング型（ID 4=組み合わせ）
 * 
 * データ構造：
 * {
 *   id: string,
 *   label: string (問題側のテキスト),
 *   value: string (答え側のテキスト)
 * }
 * 
 * 機能：
 * - 左側：問題（Stem）
 * - 矢印（→）
 * - 右側：答え（Match）
 * - 編集時：プルダウンで答えを選択可能
 * - Markdown/LaTeX対応
 */
interface MatchItem {
  id: string;
  label: string;
  value: string;
}

interface MatchViewerProps {
  items: MatchItem[];
  showAnswer?: boolean;
  matchOptions?: string[]; // 編集時に利用可能な選択肢
  selectedMatches?: Record<string, string>; // 編集時の選択状態 { itemId: selectedValue }
  onMatchSelect?: (itemId: string, selectedValue: string) => void; // 編集時のコールバック
  className?: string;
  sx?: any;
}

export const MatchViewer: React.FC<MatchViewerProps> = ({
  items,
  showAnswer = false,
  matchOptions,
  selectedMatches,
  onMatchSelect,
  className,
  sx,
}) => {
  if (!items || items.length === 0) {
    return (
      <Typography color="textSecondary">マッチング項目がありません</Typography>
    );
  }

  return (
    <Stack spacing={1} sx={sx} className={className}>
      {items.map((item) => {
        const selectedValue = selectedMatches?.[item.id] ?? item.value;
        const isCorrect = showAnswer && selectedValue === item.value;

        return (
          <OptionRow
            key={item.id}
            isCorrect={isCorrect}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                width: '100%',
              }}
            >
              {/* 左側：問題 */}
              <Box sx={{ flex: 1, minWidth: '40%' }}>
                <RichTextRenderer content={item.label} />
              </Box>

              {/* 矢印 */}
              <Typography sx={{ color: '#999', fontWeight: 'bold' }}>
                →
              </Typography>

              {/* 右側：答え（編集可能または表示のみ） */}
              {onMatchSelect && matchOptions ? (
                <FormControl sx={{ flex: 1, minWidth: '40%' }}>
                  <Select
                    value={selectedValue}
                    onChange={(e) => onMatchSelect(item.id, e.target.value)}
                    size="small"
                  >
                    {matchOptions.map((opt) => (
                      <MenuItem key={opt} value={opt}>
                        {opt}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Box sx={{ flex: 1, minWidth: '40%' }}>
                  <RichTextRenderer content={selectedValue} />
                </Box>
              )}

              {/* 正解バッジ */}
              {isCorrect && (
                <Typography
                  variant="caption"
                  sx={{ color: '#4caf50', fontWeight: 'bold' }}
                >
                  ✓
                </Typography>
              )}
            </Box>
          </OptionRow>
        );
      })}
    </Stack>
  );
};
