import { describe, it, expect } from 'vitest';
import { nextGenerationState, initialGenerationState } from '@/features/generation/stateMachine';
import type { GenerationStatusResponse } from '@/features/generation/types';

describe('generation stateMachine', () => {
  it('walks through all phases from queued to complete', () => {
    const steps: GenerationStatusResponse[] = [
      { jobId: 'job-1', status: 'queued', currentStep: 'waiting_for_upload', progress: 0 },
      { jobId: 'job-1', status: 'processing', currentStep: 'uploading', progress: 10 },
      { jobId: 'job-1', status: 'processing', currentStep: 'upload_verifying', progress: 15 },
      { jobId: 'job-1', status: 'processing', currentStep: 'extracting', progress: 25 },
      { jobId: 'job-1', status: 'processing', currentStep: 'sectioning', progress: 35 },
      { jobId: 'job-1', status: 'processing', currentStep: 'structure_detecting', progress: 45 },
      { jobId: 'job-1', status: 'processing', currentStep: 'structure_review', progress: 50 },
      { jobId: 'job-1', status: 'processing', currentStep: 'waiting_for_slot', progress: 55 },
      { jobId: 'job-1', status: 'processing', currentStep: 'generating', progress: 75 },
      { jobId: 'job-1', status: 'processing', currentStep: 'postprocessing', progress: 90 },
      { jobId: 'job-1', status: 'completed', currentStep: 'completed', progress: 100, problemId: 'prob-1' },
    ];

    let state = initialGenerationState;

    // queued
    state = nextGenerationState(state, steps[0]);
    expect(state.phase).toBe('queued');
    expect(state.currentStep).toBe('waiting_for_upload');
    expect(state.progress).toBeLessThanOrEqual(5);

    // uploading
    state = nextGenerationState(state, steps[1]);
    expect(state.phase).toBe('uploading');
    expect(state.currentStep).toBe('uploading');
    expect(state.progress).toBeGreaterThanOrEqual(5);
    expect(state.progress).toBeLessThanOrEqual(20);

    // upload_verifying (still uploading phase)
    state = nextGenerationState(state, steps[2]);
    expect(state.phase).toBe('uploading');
    expect(state.currentStep).toBe('upload_verifying');

    // extracting (analyzing phase)
    state = nextGenerationState(state, steps[3]);
    expect(state.phase).toBe('analyzing');
    expect(state.currentStep).toBe('extracting');
    expect(state.progress).toBeGreaterThanOrEqual(20);
    expect(state.progress).toBeLessThanOrEqual(40);

    // sectioning (still analyzing)
    state = nextGenerationState(state, steps[4]);
    expect(state.phase).toBe('analyzing');
    expect(state.currentStep).toBe('sectioning');

    // structure_detecting
    state = nextGenerationState(state, steps[5]);
    expect(state.phase).toBe('structure-review');
    expect(state.currentStep).toBe('structure_detecting');

    // structure_review
    state = nextGenerationState(state, steps[6]);
    expect(state.phase).toBe('structure-review');
    expect(state.currentStep).toBe('structure_review');
    expect(state.progress).toBeGreaterThanOrEqual(40);
    expect(state.progress).toBeLessThanOrEqual(50);

    // waiting_for_slot (generating phase)
    state = nextGenerationState(state, steps[7]);
    expect(state.phase).toBe('generating');
    expect(state.currentStep).toBe('waiting_for_slot');

    // generating
    state = nextGenerationState(state, steps[8]);
    expect(state.phase).toBe('generating');
    expect(state.currentStep).toBe('generating');
    expect(state.progress).toBeGreaterThanOrEqual(50);
    expect(state.progress).toBeLessThanOrEqual(85);

    // postprocessing
    state = nextGenerationState(state, steps[9]);
    expect(state.phase).toBe('postprocessing');
    expect(state.currentStep).toBe('postprocessing');
    expect(state.progress).toBeGreaterThanOrEqual(85);
    expect(state.progress).toBeLessThanOrEqual(95);

    // completed
    state = nextGenerationState(state, steps[10]);
    expect(state.phase).toBe('complete');
    expect(state.currentStep).toBe('completed');
    expect(state.progress).toBe(100);
    expect(state.problemId).toBe('prob-1');
  });

  it('maps failed status to error phase with error code and message', () => {
    const errorStatus: GenerationStatusResponse = {
      jobId: 'job-err',
      status: 'failed',
      currentStep: 'extracting',
      progress: 25,
      errorCode: 'ocr_timeout',
      errorMessage: 'OCR処理がタイムアウトしました',
    };

    const state = nextGenerationState(initialGenerationState, errorStatus);
    expect(state.phase).toBe('error');
    expect(state.currentStep).toBe('extracting');
    expect(state.errorCode).toBe('ocr_timeout');
    expect(state.errorMessage).toBe('OCR処理がタイムアウトしました');
  });

  it('handles paused status', () => {
    const pausedStatus: GenerationStatusResponse = {
      jobId: 'job-paused',
      status: 'paused',
      currentStep: 'generating',
      progress: 60,
    };

    const state = nextGenerationState(initialGenerationState, pausedStatus);
    expect(state.phase).toBe('paused');
    expect(state.currentStep).toBe('generating');
    expect(state.progress).toBe(60);
  });
});
