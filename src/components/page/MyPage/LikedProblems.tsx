import React from 'react';
import { Box } from '@mui/material';
import { HorizontalScrollSection } from '@/components/common/HorizontalScrollSection';
import { ComingSoon } from '@/components/common/ComingSoon';

export interface LikedProblemsProps {
  /** データは後で接続予定（coming soon） */
}

/**
 * 高評価セクション
 * MyPage で「高評価」の問題を横スクロール表示する
 * HorizontalScrollSection を内部で使用（再利用パターン）
 */
export const LikedProblems: React.FC<LikedProblemsProps> = () => {
  // TODO: useSearch or API call を追加して実際のデータ取得

  return (
    <HorizontalScrollSection
      title="高評価"
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
            title="高評価"
            minHeight="240px"
          />
        </Box>
      )}
      emptyMessage="高評価した問題があります"
    />
  );
};

export default LikedProblems;
