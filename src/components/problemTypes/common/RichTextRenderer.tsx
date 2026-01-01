import React from 'react';
import { MarkdownBlock } from '@/components/common/MarkdownBlock';
import { LatexBlock } from '@/components/common/LatexBlock';
import { Box } from '@mui/material';

/**
 * RichTextRenderer
 * 
 * 共通のテキスト描画コンポーネント
 * Markdown/LaTeX両方に対応し、どの問題形式でも同じ描画ロジックを使用
 * - 自動的にMarkdownとLaTeXを判定して描画
 * - 画像リンクもサポート
 */
interface RichTextRendererProps {
  content: string;
  displayMode?: boolean; // LaTeX display mode (true: $$...$$ / false: $...$)
  sx?: any; // MUI sx prop for styling
}

export const RichTextRenderer: React.FC<RichTextRendererProps> = ({
  content,
  displayMode = false,
  sx,
}) => {
  if (!content) {
    return null;
  }

  // LaTeX判定（バックスラッシュか数式ブロックを含むか）
  const looksLikeLatex = /\\|(\$\$|\$)/.test(content);

  return (
    <Box sx={sx}>
      {looksLikeLatex ? (
        <LatexBlock content={content} displayMode={displayMode} />
      ) : (
        <MarkdownBlock content={content} />
      )}
    </Box>
  );
};
