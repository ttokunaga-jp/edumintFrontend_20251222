import React from 'react';
import { Box } from '@mui/material';
import { HorizontalScrollSection } from '@/components/common/HorizontalScrollSection';
import { ComingSoon } from '@/components/common/ComingSoon';

export interface CompletedProblemsProps {
  /** データは後で接続予定（coming soon） */
}

/**
 * 学習済セクション
 * MyPage で「学習済」の問題を横スクロール表示する
 * HorizontalScrollSection を内部で使用（再利用パターン）
 */
export const CompletedProblems: React.FC<CompletedProblemsProps> = () => {
  // TODO: useSearch or API call を追加して実際のデータ取得

  return (
    <HorizontalScrollSection
      title="学習済"
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
            title="学習済み"
            minHeight="240px"
          />
        </Box>
      )}
      emptyMessage="学習済みの問題があります"
    />
  );
};

export default CompletedProblems;
