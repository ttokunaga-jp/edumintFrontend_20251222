import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGenerationStore } from '@/features/generation/stores/generationStore';
import { useConfirmJobMutation } from '@/features/generation/hooks/useGeneration';
import {
  ExamSchema,
  StructureExamSchema,
  createDefaultExam,
  createDefaultQuestion,
  createDefaultSubQuestion,
  DifficultyLabels,
  QuestionTypeLabels,
  type ExamFormValues
} from '@/features/exam/schema';
import { ExamMetaSection } from '@/features/exam/components/ExamMetaSection';
import { QuestionList } from '@/features/exam/components/QuestionList';
// import { StructureMetaSection, StructureQuestionList } from './structure'; // Deleted

export function StructureConfirmation() {
  const { setPhase, structureData, jobId, phase, reset: resetStore } = useGenerationStore();
  const confirmMutation = useConfirmJobMutation();
  const [openBackDialog, setOpenBackDialog] = useState(false);

  // フォーム初期化
  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(StructureExamSchema),
    defaultValues: createDefaultExam(),
    mode: 'onBlur',
  });

  const { reset: resetForm, handleSubmit } = methods;

  // structureData を ExamFormValues に変換
  const initialFormValues = useMemo(() => {
    if (!structureData) return null;

    const defaultExam = createDefaultExam();

    // 基本情報のマッピング
    defaultExam.examName = structureData.title || '';
    if (structureData.subjects && structureData.subjects.length > 0) {
      defaultExam.subjectName = structureData.subjects[0];
    }

    // 問題のマッピング
    if (Array.isArray(structureData.problems)) {
      defaultExam.questions = structureData.problems.map((p: any, idx: number) => {
        const q = createDefaultQuestion(idx);

        // 難易度のマッピング (ラベルからキーを検索)
        const levelEntry = Object.entries(DifficultyLabels).find(([_, label]) => label === p.level);
        if (levelEntry) {
          q.level = levelEntry[0] as any;
        }

        // キーワードのマッピング（大問）
        if (Array.isArray(p.keywords)) {
          q.keywords = p.keywords.map((kw: any, kidx: number) => ({ id: kw.id ?? `kw-${idx}-${kidx}`, keyword: kw.keyword }));
        }

        // 問題形式のマッピング (ラベルからキーを検索)
        // 小問を1つ作成して割り当てる
        const sq = createDefaultSubQuestion(0);
        const typeEntry = Object.entries(QuestionTypeLabels).find(([_, label]) => label === p.type || label === p.questionType);
        if (typeEntry) {
          sq.questionTypeId = Number(typeEntry[0]);
        }

        // 小問キーワードのマッピング
        if (Array.isArray(p.subQuestions) && Array.isArray(p.subQuestions[0]?.keywords)) {
          sq.keywords = p.subQuestions[0].keywords.map((kw: any, kidx: number) => ({ id: kw.id ?? `sqkw-${idx}-${kidx}`, keyword: kw.keyword }));
        }

        q.subQuestions = [sq];
        return q;
      });
    }

    return defaultExam;
  }, [structureData]);

  // データ変更時にフォームをリセット
  useEffect(() => {
    if (initialFormValues) {
      resetForm(initialFormValues);
    }
  }, [initialFormValues, resetForm]);

  if (phase > 3) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          問題を生成しています...
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AIが問題を作成中ですので、そのままお待ちください。
        </Typography>
      </Box>
    );
  }

  const onSubmit = (data: ExamFormValues) => {
    if (!jobId) return;

    // フォームデータをバックエンドが期待する形式に変換して送信
    confirmMutation.mutate({ jobId, structureData: data }, {
      onSuccess: () => {
        setPhase(4); // structure_completed
      },
      onError: (e) => {
        console.error('Failed to confirm structure', e);
      }
    });
  };

  const handleBackClick = () => {
    setOpenBackDialog(true);
  };

  const handleConfirmBack = () => {
    resetStore(); // Reset store state (jobId, data, etc.)
    setOpenBackDialog(false);
    setPhase(0);
  };

  return (
    <FormProvider {...methods}>
      <Container maxWidth="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                構造解析結果の確認
              </Typography>
              <Typography variant="body1" color="text.secondary">
                AIが解析した試験構造を確認・編集してください。
                ここでの設定に基づいて問題文が生成されます。
              </Typography>
            </Box>

            {/* メタデータ編集 */}
            <ExamMetaSection isEditMode={true} />

            {/* 構造編集 */}
            <QuestionList isEditMode={true} structureOnly={true} />

            {/* アクションボタン */}
            <Stack direction="row" spacing={2} sx={{ mt: 4, pb: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleBackClick}
              >
                戻る
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                type="submit"
                disabled={confirmMutation.isPending}
              >
                {confirmMutation.isPending ? '送信中...' : 'この構成で生成を開始'}
              </Button>
            </Stack>
          </Stack>
        </form>

        {/* 戻る確認ダイアログ */}
        <Dialog
          open={openBackDialog}
          onClose={() => setOpenBackDialog(false)}
        >
          <DialogTitle>確認</DialogTitle>
          <DialogContent>
            <DialogContentText>
              この画面を離れると、現在の編集内容は失われます。生成開始画面に戻ってもよろしいですか？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBackDialog(false)}>キャンセル</Button>
            <Button onClick={handleConfirmBack} color="error" autoFocus>
              戻る
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </FormProvider>
  );
}
