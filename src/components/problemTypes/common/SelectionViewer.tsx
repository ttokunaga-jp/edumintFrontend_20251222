import React from 'react';
import { Box, Stack, Radio, Checkbox, Typography } from '@mui/material';
import { RichTextRenderer } from './RichTextRenderer';
import { OptionRow } from './OptionRow';

/**
 * SelectionViewer
 * 
 * パターン1：選択リスト型（ID 1=単一選択、 ID 2=複数選択、 ID 3=正誤判定）
 * 
 * データ構造：
 * {
 *   id: string,
 *   label: string (表示テキスト),
 *   value: boolean (正解か否か)
 * }
 * 
 * 機能：
 * - Radio（単一選択）またはCheckbox（複数選択）を表示
 * - 正解をハイライト（showAnswer=true時）
 * - Markdown/LaTeX対応
 */
interface SelectionItem {
  id: string;
  label: string;
  value: boolean;
}

interface SelectionViewerProps {
  items: SelectionItem[];
  showAnswer?: boolean;
  isSingleSelect?: boolean; // true: Radio / false: Checkbox
  selectedIds?: Set<string>; // 編集時の選択状態
  onSelect?: (id: string) => void; // 編集時のコールバック
  className?: string;
  sx?: any;
}

export const SelectionViewer: React.FC<SelectionViewerProps> = ({
  items,
  showAnswer = false,
  isSingleSelect = false,
  selectedIds,
  onSelect,
  className,
  sx,
}) => {
  if (!items || items.length === 0) {
    return (
      <Typography color="textSecondary">選択肢がありません</Typography>
    );
  }

  return (
    <Stack spacing={0} sx={sx} className={className}>
      {items.map((item) => {
        const isAnswerCorrect = item.value === true;
        const isSelected = selectedIds?.has(item.id);

        return (
          <OptionRow
            key={item.id}
            isCorrect={showAnswer && isAnswerCorrect}
            isSelected={isSelected}
            onClick={() => onSelect?.(item.id)}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              {/* マーカー（Radio/Checkbox） */}
              {isSingleSelect ? (
                <Radio
                  id={`radio-${item.id}`}
                  name={`selection-${item.id}`}
                  checked={isSelected ?? false}
                  disabled={!onSelect}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              ) : (
                <Checkbox
                  id={`checkbox-${item.id}`}
                  name={`selection-${item.id}`}
                  checked={isSelected ?? false}
                  disabled={!onSelect}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              )}

              {/* コンテンツ */}
              <Box sx={{ flex: 1 }}>
                <RichTextRenderer content={item.label} />
              </Box>

              {/* 正解バッジ */}
              {showAnswer && isAnswerCorrect && (
                <Typography
                  variant="caption"
                  sx={{ color: '#4caf50', fontWeight: 'bold', mt: 0.5 }}
                >
                  ✓ 正解
                </Typography>
              )}
            </Box>
          </OptionRow>
        );
      })}
    </Stack>
  );
};
