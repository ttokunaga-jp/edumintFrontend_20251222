import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGenerationStatus } from '@/features/content/hooks/useGenerationStatus';

const mockGetGenerationStatus = vi.fn();
const mockStartStructureGeneration = vi.fn();

vi.mock('@/services/api/gateway/generation', () => ({
  getGenerationStatus: (...args: any[]) => mockGetGenerationStatus(...args),
  startStructureGeneration: (...args: any[]) => mockStartStructureGeneration(...args),
}));

describe('useGenerationStatus', () => {
  beforeEach(() => {
    mockGetGenerationStatus.mockReset();
    mockStartStructureGeneration.mockReset();
  });

  it('starts generation and progresses through all phases', async () => {
    mockStartStructureGeneration.mockResolvedValue({ jobId: 'job-1' });
    
    // バックエンドの詳細なステップを模倣（より現実的なフロー）
    mockGetGenerationStatus
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'uploading', 
        progress: 10 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'upload_verifying', 
        progress: 15 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'extracting', 
        progress: 25 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'sectioning', 
        progress: 35 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'structure_detecting', 
        progress: 45 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'waiting_for_slot', 
        progress: 55 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'generating', 
        progress: 75 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'processing', 
        currentStep: 'postprocessing', 
        progress: 90 
      })
      .mockResolvedValueOnce({ 
        jobId: 'job-1',
        status: 'completed', 
        currentStep: 'completed', 
        progress: 100, 
        problemId: 'problem-123' 
      })
      // 以降のポーリングは完了状態を返し続ける
      .mockResolvedValue({ 
        jobId: 'job-1',
        status: 'completed', 
        currentStep: 'completed', 
        progress: 100, 
        problemId: 'problem-123' 
      });

    const onComplete = vi.fn();

    // ポーリング間隔を長めに設定（バックエンドの処理時間を考慮）
    const { result } = renderHook(() => 
      useGenerationStatus({ onComplete, pollIntervalMs: 100 })
    );

    // ジョブ開始
    await act(async () => {
      await result.current.startGeneration('structure-1');
    });

    // ジョブIDが設定されることを確認
    await waitFor(() => expect(result.current.jobId).toBe('job-1'), { timeout: 3000 });
    
    // 初期フェーズは uploading
    expect(result.current.phase).toBe('uploading');

    // analyzing フェーズに遷移（extracting, sectioning）
    await waitFor(() => expect(result.current.phase).toBe('analyzing'), { timeout: 3000 });
    expect(['extracting', 'sectioning']).toContain(result.current.currentStep);

    // structure-review フェーズに遷移
    await waitFor(() => expect(result.current.phase).toBe('structure-review'), { timeout: 3000 });

    // generating フェーズに遷移
    await waitFor(() => expect(result.current.phase).toBe('generating'), { timeout: 3000 });
    expect(['waiting_for_slot', 'generating']).toContain(result.current.currentStep);

    // postprocessing フェーズに遷移
    await waitFor(() => expect(result.current.phase).toBe('postprocessing'), { timeout: 3000 });

    // 完了を確認
    await waitFor(() => expect(result.current.phase).toBe('complete'), { timeout: 3000 });
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({ 
        problemId: 'problem-123',
        status: 'completed',
        currentStep: 'completed'
      })
    );
  }, 15000); // テスト全体のタイムアウトを15秒に設定

  it('tracks existing job without restarting generation', async () => {
    const { result } = renderHook(() => 
      useGenerationStatus({ initialJobId: 'existing-job' })
    );

    expect(result.current.jobId).toBe('existing-job');
    expect(result.current.phase).toBe('generating');
    expect(result.current.currentStep).toBe('generating');
  });
});
