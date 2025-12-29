import { http, HttpResponse } from 'msw';

// Simple in-memory progression for generation status to make tests deterministic
const steps = [
  { status: 'queued', currentStep: 'waiting_for_upload', progress: 0 },
  { status: 'processing', currentStep: 'uploading', progress: 10 },
  { status: 'processing', currentStep: 'generating', progress: 75 },
  { status: 'completed', currentStep: 'completed', progress: 100, problemId: 'p-generated-123' },
];

const jobProgress = new Map<string, number>();

export const generationHandlers = [
  http.get('/generation/status/:jobId', ({ params }) => {
    const jobId = String(params.jobId);
    const idx = jobProgress.get(jobId) || 0;
    const entry = steps[Math.min(idx, steps.length - 1)];
    // advance for next call (up to completed)
    jobProgress.set(jobId, Math.min(idx + 1, steps.length - 1));
    return HttpResponse.json({ jobId, ...entry });
  }),
  http.post('/generation/start', () => {
    const jobId = `job-${Date.now()}`;
    jobProgress.set(jobId, 1); // set to uploading
    return HttpResponse.json({ jobId, status: 'processing', currentStep: 'uploading', progress: 10 });
  }),
];


