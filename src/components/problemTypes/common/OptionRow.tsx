import React from 'react';
import { Box, Fade } from '@mui/material';

/**
 * OptionRow
 * 
 * 選択肢1つ分を表示する共通ラッパーコンポーネント
 * すべての選択形式（ID 1〜5）で共通使用
 * 
 * 機能：
 * - ホバー時の背景色変化
 * - 正解時のハイライト（緑枠）
 * - 不正解時のスタイル
 * - アクセシビリティ対応（role, aria-*）
 */
interface OptionRowProps {
  children: React.ReactNode;
  isCorrect?: boolean; // 正解を示す場合true
  isSelected?: boolean; // 選択状態（編集時のみ使用）
  onClick?: () => void;
  className?: string;
  sx?: any; // MUI sx prop
}

export const OptionRow: React.FC<OptionRowProps> = ({
  children,
  isCorrect,
  isSelected,
  onClick,
  className,
  sx,
}) => {
  return (
    <Fade in timeout={300}>
      <Box
        onClick={onClick}
        role="listitem"
        aria-selected={isSelected}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          padding: 2,
          marginBottom: 1,
          border: isCorrect ? '2px solid #4caf50' : '1px solid #ddd',
          borderRadius: 1,
          backgroundColor: isCorrect
            ? 'rgba(76, 175, 80, 0.05)'
            : 'transparent',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease-in-out',
          '&:hover': onClick
            ? {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderColor: '#999',
              }
            : {},
          ...sx,
        }}
        className={className}
      >
        {children}
      </Box>
    </Fade>
  );
};
