import React from 'react';
import type { GenerationPhase } from '@/features/generation/types';
import type {
  CreateStep,
  SourceType,
  ExerciseOptionsState,
  DocumentOptionsState,
} from './hooks/useProblemCreateFlow';
import type { UploadFile } from '@/components/page/ProblemCreatePage/FileUploadQueue';
import type { GenerationStep } from '@/components/page/ProblemCreatePage/GenerationStatusTimeline';
import { ProgressHeader } from '@/components/page/ProblemCreatePage/ProgressHeader';
import { StartPhase } from '@/components/page/ProblemCreatePage/StartPhase';
import { AnalysisPhase } from '@/components/page/ProblemCreatePage/AnalysisPhase';
import { GenerationPhase as GenerationPhaseComponent } from '@/components/page/ProblemCreatePage/GenerationPhase';
import { GenerationProgressBar } from '@/components/generation/GenerationProgressBar';
import { GenerationTimeline } from '@/components/generation/GenerationTimeline';

type Props = {
  step: CreateStep;
  phase: GenerationPhase;
  progress: number;
  sourceType: SourceType;
  setSourceType: (v: SourceType) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileInputClick: () => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  files: UploadFile[];
  isProcessing: boolean;
  isUploading: boolean;
  onRemoveFile: (fileId: string) => void;
  exerciseOptions: ExerciseOptionsState;
  onChangeExerciseOptions: (v: ExerciseOptionsState) => void;
  documentOptions: DocumentOptionsState;
  onChangeDocumentOptions: (v: DocumentOptionsState) => void;
  proceedFromStart: () => void;
  examDraft: any;
  setExamDraft: (v: any) => void;
  goToGeneration: () => void;
  backToStart: () => void;
  backToAnalysis: () => void;
  backFromGeneration: () => void;
  generationStep: GenerationStep;
  jobId?: string | null;
  errorMessage?: string | null;
  onPublish: () => void;
};

export const ProblemCreateView: React.FC<Props> = ({
  step,
  phase,
  progress,
  sourceType,
  setSourceType,
  fileInputRef,
  onFileInputClick,
  onFileSelect,
  files,
  isProcessing,
  isUploading,
  onRemoveFile,
  exerciseOptions,
  onChangeExerciseOptions,
  documentOptions,
  onChangeDocumentOptions,
  proceedFromStart,
  examDraft,
  setExamDraft,
  goToGeneration,
  backToStart,
  backToAnalysis,
  backFromGeneration,
  generationStep,
  jobId,
  errorMessage,
  onPublish,
}) => {
  return (
    <div className="relative">
      <ProgressHeader currentStep={step} />
      <div className="max-w-6xl mx-auto w-full px-4 mt-4 space-y-3">
        <GenerationProgressBar phase={phase} progress={progress} />
        <GenerationTimeline current={phase} />
      </div>
      <div className="h-20 md:h-16" aria-hidden="true" />

      <main className="max-w-6xl mx-auto w-full px-4 py-12 space-y-8">
        {step === 'start' && (
          <StartPhase
            sourceType={sourceType}
            onSourceTypeChange={setSourceType}
            fileInputRef={fileInputRef}
            onFileInputClick={onFileInputClick}
            onFileSelect={onFileSelect}
            files={files}
            isUploading={isProcessing || isUploading}
            onRemoveFile={onRemoveFile}
            exerciseOptions={exerciseOptions}
            onChangeExerciseOptions={onChangeExerciseOptions}
            documentOptions={documentOptions}
            onChangeDocumentOptions={onChangeDocumentOptions}
            onProceed={proceedFromStart}
          />
        )}

        {step === 'analysis' && (
          <AnalysisPhase exam={examDraft} onChange={setExamDraft} onBack={backToStart} onNext={goToGeneration} />
        )}

        {step === 'generation' && (
          <GenerationPhaseComponent
            exam={examDraft}
            onChange={setExamDraft}
            onBack={backFromGeneration}
            currentStep={generationStep}
            progress={progress}
            jobId={jobId}
            errorMessage={errorMessage}
            onPublish={onPublish}
          />
        )}
      </main>
    </div>
  );
};

export default ProblemCreateView;
