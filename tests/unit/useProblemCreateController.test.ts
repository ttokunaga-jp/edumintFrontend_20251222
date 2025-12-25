import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProblemCreateController } from '@/pages/ProblemCreatePage/hooks/useProblemCreateController';

// Mock dependencies
vi.mock('@/features/content/hooks/useFileUpload', () => ({
    useFileUpload: () => ({
        files: [],
        isUploading: false,
        uploadFiles: vi.fn(),
        clearFiles: vi.fn(),
        lastUploadJobId: null,
        removeFile: vi.fn(),
    }),
}));

vi.mock('@/features/content/hooks/useGenerationStatus', () => ({
    useGenerationStatus: ({ onComplete }: { onComplete: (s: any) => void }) => ({
        jobId: 'mock-job-id',
        phase: 'generating',
        currentStep: 'generating',
        progress: 45,
        errorMessage: null,
        errorCode: undefined,
        startGeneration: vi.fn().mockResolvedValue('mock-job-id'),
        trackExistingJob: vi.fn(),
        // Simulate completion helper
        simulateComplete: (problemId: string) => onComplete({ 
          problemId, 
          status: 'completed',
          currentStep: 'completed'
        }),
    }),
}));

describe('useProblemCreateController', () => {
    const mockOnNavigate = vi.fn();
    const mockOnGenerated = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes with correct default phase', () => {
        const { result } = renderHook(() => useProblemCreateController({
            onNavigate: mockOnNavigate,
            onGenerated: mockOnGenerated
        }));
        expect(result.current.phase).toBe('input');
    });

    it('exposes currentStep and errorCode from useGenerationStatus', () => {
        const { result } = renderHook(() => useProblemCreateController({
            onNavigate: mockOnNavigate,
            onGenerated: mockOnGenerated
        }));
        
        // 新しいフィールドが公開されていることを確認
        expect(result.current.detailedStep).toBeDefined();
        expect(result.current.errorCode).toBeUndefined();
        expect(result.current.generationStep).toBe('generating');
    });
});
