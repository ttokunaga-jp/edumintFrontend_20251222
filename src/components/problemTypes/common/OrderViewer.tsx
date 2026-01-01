import React, { useState } from 'react';
import { Box, Stack, Badge, Checkbox, Typography, Paper } from '@mui/material';
import { RichTextRenderer } from './RichTextRenderer';
import { OptionRow } from './OptionRow';

/**
 * OrderViewer
 * 
 * パターン3：シーケンス型（ID 5=順序並べ替え）
 * 
 * データ構造：
 * {
 *   id: string,
 *   label: string (並べ替える対象テキスト),
 *   value: number (正しい順序番号)
 * }
 * 
 * 機能：
 * - value（順序）でソートして表示
 * - 左側：順序番号バッジ（1, 2, 3...）
 * - 右側：コンテンツ
 * - 編集時：ドラッグハンドル可能（将来実装）
 * - Markdown/LaTeX対応
 */
interface OrderItem {
  id: string;
  label: string;
  value: number; // 正しい順序
}

interface OrderViewerProps {
  items: OrderItem[];
  showAnswer?: boolean;
  currentOrder?: number[]; // 編集時の現在の順序（item idの配列）
  onReorder?: (newOrder: number[]) => void; // 編集時のコールバック（将来のドラッグ対応用）
  className?: string;
  sx?: any;
}

export const OrderViewer: React.FC<OrderViewerProps> = ({
  items,
  showAnswer = false,
  currentOrder,
  onReorder,
  className,
  sx,
}) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  if (!items || items.length === 0) {
    return (
      <Typography color="textSecondary">並べ替え項目がありません</Typography>
    );
  }

  // showAnswer=true の場合、value（順序）でソート
  const displayItems = showAnswer
    ? [...items].sort((a, b) => a.value - b.value)
    : items;

  return (
    <Stack spacing={1} sx={sx} className={className}>
      {displayItems.map((item, displayIndex) => {
        // 表示上の順序（showAnswer時は正解順序、それ以外は現在の順序）
        const orderNumber = showAnswer
          ? item.value
          : displayIndex + 1;
        
        const isSelected = selected.has(item.id);
        const isCorrect = showAnswer && item.value === orderNumber;

        return (
          <OptionRow
            key={item.id}
            isCorrect={isCorrect}
            isSelected={isSelected}
            onClick={() => {
              // 将来のドラッグ対応用
              if (!showAnswer) {
                const newSelected = new Set(selected);
                if (isSelected) {
                  newSelected.delete(item.id);
                } else {
                  newSelected.add(item.id);
                }
                setSelected(newSelected);
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              {/* 左側：順序番号バッジ */}
              <Box
                sx={{
                  minWidth: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCorrect ? '#4caf50' : '#f5f5f5',
                  color: isCorrect ? 'white' : '#333',
                  borderRadius: '50%',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                {orderNumber}
              </Box>

              {/* 右側：コンテンツ */}
              <Box sx={{ flex: 1 }}>
                <RichTextRenderer content={item.label} />
              </Box>

              {/* 正解バッジ */}
              {isCorrect && (
                <Typography
                  variant="caption"
                  sx={{ color: '#4caf50', fontWeight: 'bold', mt: 1 }}
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
