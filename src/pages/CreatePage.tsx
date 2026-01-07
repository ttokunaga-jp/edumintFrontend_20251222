import { Box, Container, Stepper, Step, StepLabel, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { useNavigate } from 'react-router-dom';
import { useGenerationStore } from '@/features/generation/stores/generationStore';
import { zIndex } from '@/theme/zIndex';
import { StartPhase } from '@/components/page/ProblemCreatePage/StartPhase';
import { StructureConfirmation } from '@/components/page/ProblemCreatePage/StructureConfirmation';
import { ResultEditor } from '@/components/page/ProblemCreatePage/ResultEditor';
import { useEffect } from 'react';
import { useJobStatusQuery } from '@/features/generation/hooks/useGeneration';

/**
 * カスタムステッパーコネクタ
 * 進行状況に合わせて青色のラインを表示
 */
const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976d2', // Primary Blue
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: '#1976d2', // Primary Blue
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

/**
 * 問題作成ページ
 * 3フェーズのシンプルなフロー:
 * 1. start - ファイルアップロード、生成モード選択、設定
 * 2. structure_confirmed - 構造解析結果確認
 * 3. completed - 最終結果編集
 */
export default function CreatePage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { phase, setPhase, jobId, setStructureData, setGeneratedProblems } = useGenerationStore();

  // Polling logic using TanStack Query
  // Stop polling if waiting for user or completed
  const isPolling = !!jobId && !(phase === 3 || phase === 13 || phase === 21);
  const { data: statusData } = useJobStatusQuery(jobId, isPolling);

  useEffect(() => {
    if (statusData) {
      const { phase: newPhase, data } = statusData;
      if (newPhase !== phase) {
        setPhase(newPhase);
        if (data) {
          // Update data based on phase
          if (newPhase === 3) setStructureData(data);
          if (newPhase === 13) setGeneratedProblems(data.generatedContent ? [data.generatedContent] : []);
        }
      }
    }
  }, [statusData, phase, setPhase, setStructureData, setGeneratedProblems]);

  // Map numeric phase to display step index
  // 0-2: Start (0)
  // 3-12: Structure Confirmed / Generating (1)
  // 13+: Completed (2)
  const displayPhaseIndex = phase < 3 ? 0 : phase < 13 ? 1 : 2;

  const phaseLabels = ['1. 生成開始', '2. 構造解析', '3. 生成完了'];

  return (
    <>
      {/* 固定 Stepper（MUI Stepper） */}
      <Box sx={{
        position: 'sticky',
        top: 0, // TopMenuBar の直下に配置（.app-mainがすでにオフセットを持っているため0でOK）
        zIndex: zIndex.appBar,
        backgroundColor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Stepper
          activeStep={displayPhaseIndex}
          alternativeLabel
          connector={<ColorlibConnector />}
          sx={{ py: 2, px: { xs: 1, sm: 2 } }}
        >
          {phaseLabels.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Container maxWidth="md">
        <Box sx={{ py: 3 }}>
          {/* フェーズコンテンツ */}
          <Box>
            {phase < 3 && <StartPhase />}
            {phase >= 3 && phase < 13 && <StructureConfirmation />}
            {phase >= 13 && <ResultEditor />}
          </Box>
        </Box>
      </Container>
    </>
  );
}
