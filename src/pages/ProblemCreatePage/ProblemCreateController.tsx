import React from 'react';
import type { Page } from '@/types';
import type { GenerationPhase } from '@/features/generation/types';
import type { SourceType } from './hooks/useProblemCreateFlow';
import { useProblemCreateController } from './hooks/useProblemCreateController';
import { useProblemCreateFlow } from './hooks/useProblemCreateFlow';
import ProblemCreateView from './ProblemCreateView';

export interface ProblemCreatePageProps {
  onNavigate: (page: Page, problemId?: string) => void;
  jobId?: string;
  onGenerated?: (problemId: string) => void;
}

export const ProblemCreateController: React.FC<ProblemCreatePageProps> = ({
  onNavigate,
  jobId,
  onGenerated,
}) => {
  const {
    sourceType,
    setSourceType,
    step,
    proceedFromStart,
    goToAnalysis,
    goToGeneration,
    backToStart,
    backToAnalysis,
    backFromGeneration,
    exerciseOptions,
    setExerciseOptions,
    documentOptions,
    setDocumentOptions,
    examDraft,
    setExamDraft,
  } = useProblemCreateFlow();

  const {
    fileInputRef,
    phase,
    files,
    isUploading,
    removeFile,
    handleFileSelect,
    handleStartClick,
    generationStep,
    progress,
    errorMessage,
    activeJobId,
    generatedProblemId,
  } = useProblemCreateController({ onNavigate, onGenerated, jobId });

  const viewPhase: GenerationPhase = phase === 'input' ? 'uploading' : (phase as GenerationPhase);
  const isProcessing = viewPhase === 'generating' || viewPhase === 'uploading';

  return (
    <ProblemCreateView
      step={step as any}
      phase={viewPhase}
      progress={progress}
      sourceType={sourceType}
      setSourceType={(v: SourceType) => setSourceType(v)}
      fileInputRef={fileInputRef}
      onFileInputClick={handleStartClick}
      onFileSelect={handleFileSelect}
      files={files}
      isProcessing={isProcessing}
      isUploading={isUploading}
      onRemoveFile={removeFile}
      exerciseOptions={exerciseOptions}
      onChangeExerciseOptions={setExerciseOptions}
      documentOptions={documentOptions}
      onChangeDocumentOptions={setDocumentOptions}
      proceedFromStart={proceedFromStart}
      examDraft={examDraft}
      setExamDraft={setExamDraft}
      goToGeneration={goToGeneration}
      backToStart={backToStart}
      backToAnalysis={backToAnalysis}
      backFromGeneration={backFromGeneration}
      generationStep={generationStep}
      jobId={activeJobId}
      errorMessage={errorMessage}
      onPublish={() =>
        generatedProblemId ? onNavigate('problem-view', generatedProblemId) : onNavigate('home')
      }
    />
  );
};

export default ProblemCreateController;
