import React from 'react';
import { Button } from '@/components/primitives/button';
import { Card } from '@/components/primitives/card';
import { ProblemMetaBlock } from '@/components/page/ProblemViewEditPage/ProblemMetaBlock';
import { GenerationStatusTimeline, type GenerationStep } from './GenerationStatusTimeline';
import { GenerationResultEditor } from '../ProblemEditor/GenerationResultEditor';

type GenerationPhaseProps = {
  exam: any;
  onChange: (exam: any) => void;
  onBack: () => void;
  onPublish: () => void;
  currentStep?: GenerationStep;
  progress?: number;
  jobId?: string | null;
  errorMessage?: string | null;
};

export function GenerationPhase({
  exam,
  onChange,
  onBack,
  onPublish,
  currentStep = 'generating',
  progress = 0,
  jobId,
  errorMessage,
}: GenerationPhaseProps) {
  const isComplete = currentStep === 'complete';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          {isComplete ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900">最終確認と微調整</h2>
              <p className="text-gray-600 font-medium">全自動で生成された問題と解答を微調整し、公開してください。</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900">問題生成中</h2>
              <p className="text-gray-600 font-medium">AIが問題と解答を生成しています。しばらくお待ちください。</p>
            </>
          )}
        </div>
        {!isComplete && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="rounded-xl px-6">
              キャンセル
            </Button>
          </div>
        )}
        {isComplete && (
          <div className="flex gap-3">
            <Button variant="outline" onClick={onBack} className="rounded-xl px-6">
              戻る
            </Button>
            <Button onClick={onPublish} className="rounded-xl px-8 bg-indigo-600">
              公開して保存
            </Button>
          </div>
        )}
      </div>

      {!isComplete && (
        <GenerationStatusTimeline
          currentStep={currentStep}
          progress={progress}
          jobId={jobId ?? undefined}
          errorMessage={errorMessage ?? undefined}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        />
      )}

      {isComplete && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-8 rounded-2xl shadow-xl bg-white border-none">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">問題本文・解答</h3>
              <GenerationResultEditor exam={exam} onChange={onChange} />
            </Card>
          </div>
          <div className="lg:col-span-1">
            <ProblemMetaBlock
              exam={exam}
              isOwner
              onLike={() => { }}
              onDislike={() => { }}
              onBookmark={() => { }}
              onShare={() => { }}
              onReport={() => { }}
              onExportPDF={() => { }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
