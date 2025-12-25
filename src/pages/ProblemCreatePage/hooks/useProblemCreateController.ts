import { useRef, useState } from 'react';
import type { Page } from '@/types';
import type { GenerationStep } from '@/components/page/ProblemCreatePage/GenerationStatusTimeline';
import { useFileUpload } from '@/features/content/hooks/useFileUpload';
import { useGenerationStatus } from '@/features/content/hooks/useGenerationStatus';
import type { ProblemSettings } from '@/components/page/ProblemCreatePage/ProblemSettingsBlock';

const defaultProblemSettings: ProblemSettings = {
  autoGenerateQuestions: true,
  questionCount: 5,
  includeAnswers: true,
  includeSolutions: true,
  difficultyLevel: 2,
  questionTypes: [1, 2],
  extractKeywords: true,
  isPublic: true,
};

export const useProblemCreateController = ({
  onNavigate,
  onGenerated,
  jobId,
}: {
  onNavigate: (page: Page, problemId?: string) => void;
  onGenerated?: (problemId: string) => void;
  jobId?: string;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [problemSettings, setProblemSettings] = useState<ProblemSettings>(defaultProblemSettings);
  const [generatedProblemId, setGeneratedProblemId] = useState<string | undefined>();
  const [localError, setLocalError] = useState<string | null>(null);

  const { files, isUploading, uploadFiles, clearFiles, lastUploadJobId, removeFile } = useFileUpload();
  const {
    jobId: activeJobId,
    phase: generationPhase,
    currentStep,
    progress,
    errorMessage,
    errorCode,
    startGeneration,
    trackExistingJob,
  } = useGenerationStatus({
    initialJobId: jobId,
    onComplete: (status) => {
      const problemId = status.problemId || status.data?.problemId;
      if (problemId) {
        setGeneratedProblemId(problemId);
        onGenerated?.(problemId);
      }
    },
    onError: (msg, code) => {
      setLocalError(msg);
      console.error(`Generation error [${code}]:`, msg);
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    if (!selected.length) return;

    const uploadJobId = await uploadFiles(selected);
    if (!uploadJobId) {
      setLocalError('アップロードに失敗しました');
      return;
    }

    const startedJobId = await startGeneration(uploadJobId);
    if (!startedJobId) {
      setLocalError('生成の開始に失敗しました');
    }
  };

  const handleStartClick = () => fileInputRef.current?.click();

  const handleReset = () => {
    clearFiles();
    setLocalError(null);
  };

  if (jobId) {
    trackExistingJob(jobId);
  }

  const uiPhase =
    files.length === 0 && !isUploading ? 'input' : generationPhase || 'uploading';

  return {
    fileInputRef,
    phase: uiPhase,
    problemSettings,
    setProblemSettings,
    files,
    isUploading,
    lastUploadJobId,
    activeJobId,
    generationStep: generationPhase,
    detailedStep: currentStep,
    progress,
    errorMessage: localError || errorMessage,
    errorCode,
    generatedProblemId,
    removeFile,
    handleFileSelect,
    handleStartClick,
    handleReset,
  };
};
