import React from 'react';
import { Box } from '@mui/material';
import { HorizontalScrollSection } from '@/components/common/HorizontalScrollSection';
import { ComingSoon } from '@/components/common/ComingSoon';

export interface CommentedProblemsProps {
  /** データは後で接続予定（coming soon） */
}

/**
 * コメントセクション
 * MyPage で「コメント」した問題を横スクロール表示する
 * HorizontalScrollSection を内部で使用（再利用パターン）
 */
export const CommentedProblems: React.FC<CommentedProblemsProps> = () => {
  // TODO: useSearch or API call を追加して実際のデータ取得

  return (
    <HorizontalScrollSection
      title="コメント"
      items={[]}
      renderItem={() => (
        <Box
          sx={{
            minWidth: '240px',
            flexShrink: 0,
            borderRadius: 1,
            bgcolor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <ComingSoon
            title="コメント"
            minHeight="240px"
          />
        </Box>
      )}
      emptyMessage="コメントした問題があります"
    />
  );
};

export default CommentedProblems;
