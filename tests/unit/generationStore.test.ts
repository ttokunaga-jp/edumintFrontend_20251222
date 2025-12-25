import { renderHook, act } from '@testing-library/react';
import { useGenerationStore } from '@/features/generation/store';
import type { GenerationStatusResponse } from '@/features/generation/types';

describe('useGenerationStore', () => {
  it('advances state with nextGenerationState logic', () => {
    const { result } = renderHook(() => useGenerationStore());

    // 新しい型定義に合わせたテストデータ
    const queued: GenerationStatusResponse = { 
      jobId: 'job', 
      status: 'queued', 
      currentStep: 'waiting_for_upload',
      progress: 0 
    };
    
    const uploading: GenerationStatusResponse = { 
      jobId: 'job', 
      status: 'processing', 
      currentStep: 'uploading',
      progress: 10 
    };
    
    const completed: GenerationStatusResponse = {
      jobId: 'job',
      status: 'completed',
      currentStep: 'completed',
      progress: 100,
      problemId: 'prob-1',
    };

    // queued ステータス
    act(() => {
      result.current.advance(queued);
    });
    expect(result.current.state.phase).toBe('queued');
    expect(result.current.state.currentStep).toBe('waiting_for_upload');

    // uploading ステータス
    act(() => {
      result.current.advance(uploading);
    });
    expect(result.current.state.phase).toBe('uploading');
    expect(result.current.state.currentStep).toBe('uploading');

    // completed ステータス
    act(() => {
      result.current.advance(completed);
      result.current.setResult(completed);
    });
    expect(result.current.state.phase).toBe('complete');
    expect(result.current.state.currentStep).toBe('completed');
    expect(result.current.result?.problemId).toBe('prob-1');
  });

  it('sets error state', () => {
    const { result } = renderHook(() => useGenerationStore());
    act(() => {
      result.current.setError('oops');
    });
    expect(result.current.state.phase).toBe('error');
    expect(result.current.state.errorMessage).toBe('oops');
  });
});
