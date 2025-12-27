import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProblemViewEditPage from '@/pages/ProblemViewEditPage';

const mockUseServiceHealthContext = vi.fn();
const mockUseExamDetail = vi.fn();

vi.mock('@/contexts/ServiceHealthContext', () => ({
  useServiceHealthContext: () => mockUseServiceHealthContext(),
}));

vi.mock('@/features/content', () => ({
  useExamDetail: (...args: any[]) => mockUseExamDetail(...args),
  useExamEditor: () => ({ updateExam: vi.fn(), isSaving: false }),
}));

describe('ProblemViewEditPage - service health gating', () => {
  beforeEach(() => {
    mockUseExamDetail.mockReturnValue({
      exam: {
        id: 'prob-1',
        examName: '線形代数 期末',
        userId: 'user-1',
        userName: 'Alice',
        examYear: 2024,
        majorType: 0,
        isPublic: true,
        viewCount: 12,
        goodCount: 3,
        badCount: 0,
        commentCount: 0,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        universityName: 'Test University',
        facultyName: 'Engineering',
        subjectName: 'Math',
        questions: [
          {
            id: 'q1',
            question_number: 1,
            question_content: 'This is a sample question',
            question_format: 0,
            sub_questions: [],
          },
        ],
      },
      loading: false,
      error: null,
    });
  });

  it('disables community and share actions when health is not operational', () => {
    mockUseServiceHealthContext.mockReturnValue({
      health: {
        content: 'operational',
        community: 'outage',
        notifications: 'maintenance',
        search: 'operational',
        wallet: 'operational',
        aiGenerator: 'operational',
        lastUpdated: null,
        isLoading: false,
        error: null,
      },
      shouldDisableCTA: (services: string[]) =>
        services.some((s) => s === 'community' || s === 'notifications'),
      refresh: vi.fn(),
      fetchHealthSummary: vi.fn(),
      isServiceOperational: vi.fn(),
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={['/problem/1']} future={{ v7_startTransition: false }}>
        <Routes>
          <Route
            path="/problem/:id"
            element={
              <ProblemViewEditPage
                user={{ id: 'user-1', username: 'Alice' }}
                problemId="prob-1"
                onNavigate={() => {}}
                onLogout={() => {}}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText(/コミュニティ機能に障害/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'いいね' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '共有' })).toBeDisabled();
  });
});
