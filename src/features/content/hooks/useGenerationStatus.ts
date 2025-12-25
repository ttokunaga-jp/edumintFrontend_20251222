import { useEffect, useRef, useState } from 'react';
import type { GenerationStatusResponse } from '@/services/api/gateway/generation';
import { getGenerationStatus, startStructureGeneration } from '@/features/generation/api';
import { initialGenerationState, nextGenerationState, seedAfterStart } from '@/features/generation/stateMachine';
import { useGenerationStore } from '@/features/generation/store';

export type { GenerationPhase } from '@/features/generation/stateMachine';

type Params = {
  initialJobId?: string;
  onComplete?: (result: GenerationStatusResponse) => void;
  onError?: (message: string, errorCode?: string) => void;
  pollIntervalMs?: number;
};

export const useGenerationStatus = ({
  initialJobId,
  onComplete,
  onError,
  pollIntervalMs = 2000,
}: Params) => {
  const [jobId, setJobId] = useState<string | null>(initialJobId ?? null);
  const { state, result, reset: resetStore, setState, advance, setError, setResult } = useGenerationStore(
    initialJobId ? { phase: 'generating', currentStep: 'generating', progress: 60 } : initialGenerationState,
  );

  const stateRef = useRef(state);
  const lastStablePhaseRef = useRef(state.phase);

  useEffect(() => {
    stateRef.current = state;
    // フェーズが変わったときのみ更新
    if (state.phase !== lastStablePhaseRef.current) {
      lastStablePhaseRef.current = state.phase;
    }
  }, [state]);

  const setErrorState = (message: string, errorCode?: string) => {
    setError(message);
    onError?.(message, errorCode);
  };

  const startGeneration = async (structureId: string) => {
    try {
      const { jobId: newJobId } = await startStructureGeneration(structureId);
      setResult(null);
      setJobId(newJobId);
      setState(seedAfterStart);
      stateRef.current = seedAfterStart;
      lastStablePhaseRef.current = seedAfterStart.phase;
      return newJobId;
    } catch (error) {
      console.error('Failed to start generation', error);
      setErrorState('生成ジョブの開始に失敗しました');
      return null;
    }
  };

  const trackExistingJob = (existingJobId: string) => {
    setJobId(existingJobId);
    const initialState = { phase: 'generating' as const, currentStep: 'generating' as const, progress: 60 };
    setState(initialState);
    stateRef.current = initialState;
    lastStablePhaseRef.current = 'generating';
  };

  const reset = () => {
    setJobId(null);
    setResult(null);
    lastStablePhaseRef.current = initialGenerationState.phase;
    resetStore();
  };

  useEffect(() => {
    if (!jobId) return;

    let isMounted = true;

    const interval = setInterval(async () => {
      try {
        const status = await getGenerationStatus(jobId);
        if (!isMounted) return;

        // 次の状態を計算
        const nextState = nextGenerationState(stateRef.current, status);
        
        // ステータスに応じて処理
        if (status.status === 'completed') {
          setState(nextState);
          stateRef.current = nextState;
          setResult(status);
          onComplete?.(status);
          clearInterval(interval);
          return;
        }

        if (status.status === 'failed') {
          setState(nextState);
          stateRef.current = nextState;
          setErrorState(status.errorMessage || '生成に失敗しました', status.errorCode);
          clearInterval(interval);
          return;
        }

        // 通常の状態更新
        advance(status);
        stateRef.current = nextState;
      } catch (error) {
        console.error('Failed to poll generation status', error);
        if (isMounted) {
          setErrorState('生成ステータスの取得に失敗しました');
        }
      }
    }, pollIntervalMs);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [jobId, onComplete, onError, pollIntervalMs]);

  return {
    jobId,
    phase: state.phase,
    currentStep: state.currentStep,
    progress: state.progress,
    errorMessage: state.errorMessage ?? null,
    errorCode: state.errorCode,
    result,
    startGeneration,
    trackExistingJob,
    reset,
  };
};
