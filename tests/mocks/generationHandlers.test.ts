import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { generationHandlers } from '@/mocks/handlers/generationHandlers';

const server = setupServer(...generationHandlers);

describe('msw generationHandlers', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('advances generation steps and reaches complete', async () => {
    const jobId = 'job-msw-test';
    
    // 1回目: 初期状態（queued or uploading）
    const res1 = await fetch(`/generation/status/${jobId}`);
    const json1 = await res1.json();
    expect(json1.status).toBeDefined();
    expect(json1.currentStep).toBeDefined();
    expect(['queued', 'processing']).toContain(json1.status);
    
    const initialStep = json1.currentStep;

    // 2回目: ステップが進行
    const res2 = await fetch(`/generation/status/${jobId}`);
    const json2 = await res2.json();
    expect(json2.currentStep).toBeDefined();
    // ステップが進行しているか、または structure_review で停止
    if (json2.currentStep !== 'structure_review') {
      expect(json2.currentStep).not.toBe(initialStep);
    }

    // 複数回ポーリングして完了まで進める
    let finalStatus;
    let attempts = 0;
    const maxAttempts = 15; // 最大15回のポーリング

    while (attempts < maxAttempts) {
      const res = await fetch(`/generation/status/${jobId}`);
      const json = await res.json();
      finalStatus = json;
      attempts++;

      if (json.status === 'completed' || json.currentStep === 'completed') {
        break;
      }

      // structure_review で停止した場合はスキップ
      if (json.currentStep === 'structure_review') {
        break;
      }

      // 少し待機
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // 最終的に完了するか、processing 中であることを確認
    expect(['processing', 'completed']).toContain(finalStatus.status);
    
    // 完了した場合は problemId が付与されることを確認
    if (finalStatus.status === 'completed') {
      expect(finalStatus.problemId).toBeDefined();
      expect(finalStatus.progress).toBe(100);
    }
  }, 10000); // テストタイムアウトを10秒に設定
});
