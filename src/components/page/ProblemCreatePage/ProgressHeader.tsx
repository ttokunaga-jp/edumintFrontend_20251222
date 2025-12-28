import React from 'react';
import { cn } from '@/shared/utils';
import type { CreateStep } from '@/pages/ProblemCreatePage/hooks/useProblemCreateFlow';

const steps: { id: CreateStep; label: string }[] = [
  { id: 'start', label: '生成開始' },
  { id: 'analysis', label: '構造解析' },
  { id: 'generation', label: '生成完了' },
];

type ProgressHeaderProps = {
  currentStep: CreateStep;
  progress?: number; // 0-100
};

function ProgressHeaderComponent({ currentStep, progress }: ProgressHeaderProps) {
  const currentIndex = steps.findIndex((step) => step.id === currentStep);
  const clampedProgress = progress === undefined ? undefined : Math.max(0, Math.min(100, progress));
  const lineWidth = clampedProgress !== undefined
    ? clampedProgress
    : (currentIndex / (steps.length - 1)) * 100;

  return (
    <div
      style={{
      paddingLeft: "1rem",
      paddingRight: "1rem"
    }}>
      <div className={undefined}>
        <div style={{
      display: "flex"
    }}>
          {/* Background Line - aligned with center of 32px (h-8) circles */}
          <div className={undefined} />

          {/* Progress Line */}
          <div
            className={undefined}
            style={{ width: `${lineWidth}%` }} />

          {steps.map((step, index) => (
            <div key={step.id} style={{
      display: "flex",
      alignItems: "center"
    }}>
              <div
                className={undefined}
              >
                {index < currentIndex ? '✓' : index + 1}
              </div>
              <span
                className={undefined}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const ProgressHeader = React.memo(ProgressHeaderComponent);
