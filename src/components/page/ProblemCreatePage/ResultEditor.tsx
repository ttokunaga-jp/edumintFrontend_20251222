import {
  Box,
  Stack,
  Divider,
  Button,
  FormControlLabel,
  Switch,
  Container,
} from '@mui/material';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useGenerationStore } from '@/features/generation/stores/generationStore';
import { useConfirmJobMutation } from '@/features/generation/hooks/useGeneration';

import {
  ExamSchema,
  createDefaultExam,
  createDefaultQuestion,
  createDefaultSubQuestion,
  DifficultyLabels,
  type ExamFormValues,
} from '@/features/exam/schema';
import { ExamMetaSection } from '@/features/exam/components/ExamMetaSection';
import { QuestionList } from '@/features/exam/components/QuestionList';

// 仮のデータ型定義 (generationStoreやbackendの定義に合わせて調整してください)
interface GeneratedProblem {
  id: string;
  title: string;
  content: string;
  answer: string;
  explanation: string;
  level: string;
  subject: string;
}

export function ResultEditor() {
  const { setPhase, generatedProblems, structureData, reset: resetStore, jobId, phase } = useGenerationStore();
  const { t } = useTranslation();
  const confirmMutation = useConfirmJobMutation();
  const navigate = useNavigate();

  // Local state for Edit/Preview mode
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // フォーム初期化
  const methods = useForm<ExamFormValues>({
    resolver: zodResolver(ExamSchema),
    defaultValues: createDefaultExam(),
    mode: 'onBlur',
  });
  const { reset, handleSubmit, getValues, trigger } = methods;

  // generatedProblems / structureData をフォーム初期値に変換 (初回のみ)
  const initialFormValues = useMemo(() => {
    // データがない場合はデフォルト
    if (!generatedProblems || generatedProblems.length === 0) {
      // 構造データがあればそれを使う、なければ完全デフォルト
      if (structureData) {
        const defaultExam = createDefaultExam();
        defaultExam.examName = structureData.title || '';
        if (structureData.subjects && structureData.subjects.length > 0) {
          defaultExam.subjectName = structureData.subjects[0];
        }
        return defaultExam;
      }
      return createDefaultExam();
    }

    const defaultExam = createDefaultExam();

    // 基本情報（structureDataがあれば優先、なければ推論）
    if (structureData) {
      defaultExam.examName = structureData.title || '';
      if (structureData.subjects && structureData.subjects.length > 0) {
        defaultExam.subjectName = structureData.subjects[0];
      }
    } else {
      defaultExam.examName = '生成された試験';
    }

    // 問題のマッピング
    // generatedProblems は GeneratedProblem[] と仮定
    defaultExam.questions = generatedProblems.map((p: any, idx: number) => {
      const q = createDefaultQuestion(idx);

      // 大問レベルのマッピング
      // 難易度: ラベル('basic'等)からEnum値を逆引き、なければデフォルト
      const levelEntry = Object.entries(DifficultyLabels).find(([_, label]) => label === p.level || label.toLowerCase() === p.level?.toLowerCase());
      if (levelEntry) {
        q.level = levelEntry[0] as any;
      }

      // キーワードなどはあればマッピング (大問)
      if (Array.isArray(p.keywords)) {
        q.keywords = p.keywords.map((kw: any, kidx: number) => ({ id: kw.id ?? `gk-${idx}-${kidx}`, keyword: kw.keyword }));
      }

      // 小問の作成 (1つの問題を1つの小問として扱う簡易マッピング)
      const sq = createDefaultSubQuestion(0);
      sq.questionContent = p.content || p.question || '';
      sq.answerContent = p.answer || '';

      // explanation and answer combining
      if (p.answer && p.explanation) {
        sq.answerContent = `【解答】\n${p.answer}\n\n【解説】\n${p.explanation}`;
      } else if (p.explanation) {
        sq.answerContent = p.explanation;
      } else {
        sq.answerContent = p.answer || '';
      }

      // 小問キーワードのマッピング
      if (Array.isArray(p.subQuestions) && Array.isArray(p.subQuestions[0]?.keywords)) {
        sq.keywords = p.subQuestions[0].keywords.map((kw: any, kidx: number) => ({ id: kw.id ?? `gsk-${idx}-${kidx}`, keyword: kw.keyword }));
        // Also map content if subquestions exist specifically in the generation output?
        // Current mock handlers seem to return flat list of problems or problems with subquestions.
        // If p has subQuestions array, we should probably map them instead of creating one default subQuestion.
        // For now, retaining existing logic where 1 generated problem = 1 question with 1 subquestion.
      }

      q.subQuestions = [sq];
      return q;
    });

    return defaultExam;
  }, [generatedProblems, structureData]);

  // 初期値反映
  useEffect(() => {
    if (initialFormValues) {
      reset(initialFormValues);
    }
  }, [initialFormValues, reset]);


  // 保存（公開）ハンドラ
  const handlePublish = async () => {
    try {
      setIsSaving(true);
      const isValid = await trigger();
      if (!isValid) {
        console.warn('Form validation failed');
        // Optionally show a snackbar or alert here
        return;
      }

      const formData = getValues();
      await confirmMutation.mutateAsync({ jobId: jobId!, structureData: formData as any });

      resetStore();
      navigate('/mypage');

    } catch (e) {
      console.error('Failed to publish', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        {/* Top Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <FormControlLabel
            control={
              <Switch
                id="mode-switch"
                name="modeSwitch"
                checked={isEditMode}
                onChange={(e: any) => setIsEditMode(e.target.checked)}
              />
            }
            label={isEditMode ? "編集モード" : "プレビュー"}
          />
        </Box>

        <Stack spacing={3}>
          {/* メタデータ編集/表示 */}
          <ExamMetaSection isEditMode={isEditMode} />

          <Divider />

          {/* 問題リスト編集/表示 */}
          <QuestionList isEditMode={isEditMode} />
        </Stack>

        {/* Footer Action Bar */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
            zIndex: 1100,
            display: 'flex',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <Button variant="outlined" onClick={() => setPhase(0)}>
            キャンセル
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePublish}
            disabled={isSaving}
            size="large"
            sx={{ px: 4 }}
          >
            {isSaving ? '保存中...' : '試験を作成する'}
          </Button>
        </Box>
      </Container>
    </FormProvider>
  );
}
