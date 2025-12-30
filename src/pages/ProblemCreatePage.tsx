import { Box, Container, LinearProgress, Stack, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGenerationStore } from '@/features/generation/stores/generationStore';
import { StartPhase } from '@/components/page/ProblemCreatePage/StartPhase';
import { StructureConfirmation } from '@/components/page/ProblemCreatePage/StructureConfirmation';
import { ResultEditor } from '@/components/page/ProblemCreatePage/ResultEditor';

/**
 * 問題作成ページ
 * 3フェーズのシンプルなフロー:
 * 1. start - ファイルアップロード、生成モード選択、設定
 * 2. structure_confirmed - 構造解析結果確認
 * 3. completed - 最終結果編集
 */
export default function ProblemCreatePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { phase, reset } = useGenerationStore();

  // 3フェーズに統合
  const displayPhase = 
    phase === 'analyzing' ? 'start' :
    phase === 'generating' ? 'structure_confirmed' :
    phase;

  const phaseOrder = ['start', 'structure_confirmed', 'completed'] as const;
  const displayPhaseIndex = phaseOrder.indexOf(displayPhase as any);
  const progress = ((displayPhaseIndex + 1) / phaseOrder.length) * 100;

  return (
    <>
      {/* 固定プログレスバー */}
      <Box sx={{ 
        position: 'sticky', 
        top: 64, // TopMenuBar の高さ
        zIndex: 99, 
        backgroundColor: 'background.paper', 
        borderBottom: `1px solid ${theme.palette.divider}` 
      }}>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 6,
            background: theme.palette.mode === 'dark' ? '#303030' : '#e0e0e0',
            '& .MuiLinearProgress-bar': {
              backgroundImage: `linear-gradient(90deg, #00bcd4, #4dd0e1)`,
              borderRadius: '3px',
            },
          }} 
        />
      </Box>

      <Container maxWidth="md">
        <Box sx={{ py: 2 }}>
          {/* フェーズコンテンツ */}
          <Stack sx={{ mb: 4 }}>
            {phase === 'start' && <StartPhase />}
            {phase === 'analyzing' && <StartPhase />}
            {phase === 'structure_confirmed' && <StructureConfirmation />}
            {phase === 'generating' && <StructureConfirmation />}
            {phase === 'completed' && <ResultEditor />}
          </Stack>
        </Box>
      </Container>
    </>
  );
}
