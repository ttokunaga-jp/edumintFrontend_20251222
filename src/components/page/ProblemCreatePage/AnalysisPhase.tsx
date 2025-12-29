import React from 'react';
import { Button } from '@/components/primitives/button';
import { Card } from '@/components/primitives/card';
import { ProblemMetaBlock } from '@/components/page/ProblemViewEditPage/ProblemMetaBlock';
import { StructureAnalysisEditor } from '../ProblemEditor/StructureAnalysisEditor';

type AnalysisPhaseProps = {
  exam: any;
  onChange: (exam: any) => void;
  onBack: () => void;
  onNext: () => void;
};

export function AnalysisPhase({ exam, onChange, onBack, onNext }: AnalysisPhaseProps) {
  return (
    <div className="space-y-6">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 className="text-2xl font-bold">構造の確認と編集</h2>
          <p className="text-sm text-gray-500 mt-1">
            解析された問題構造を確認し、必要に応じて大問・小問の構成を調整してください。
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="outline" onClick={onBack}>
            戻る
          </Button>
          <Button onClick={onNext}>次へ進む</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <h3 className="text-lg font-semibold">構造ツリー</h3>
            <div className="mt-4">
              <p className="text-sm text-gray-600">大問・小問の構造</p>
              <StructureAnalysisEditor exam={exam} onChange={onChange} />
            </div>
          </Card>
        </div>

        <div>
          <ProblemMetaBlock
            exam={exam}
            isOwner
            onLike={() => {}}
            onDislike={() => {}}
            onBookmark={() => {}}
            onShare={() => {}}
            onReport={() => {}}
            onExportPDF={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
