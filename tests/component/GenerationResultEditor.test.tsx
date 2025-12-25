import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GenerationResultEditor } from '@/components/page/ProblemEditor/GenerationResultEditor';
import React from 'react';

// Mock child components
vi.mock('../ProblemViewEditPage/QuestionSectionEdit', () => ({
    QuestionSectionEdit: ({ viewMode }: { viewMode?: string }) => (
        <div data-testid="question-section-edit" data-viewmode={viewMode || 'full'}>
            {viewMode === 'structure' ? 'Structure Mode' : 'Full Mode'}
        </div>
    ),
}));

describe('GenerationResultEditor', () => {
    const mockExam = {
        questions: [
            { id: '1', question_content: 'Test content', sub_questions: [] }
        ]
    };
    const mockOnChange = vi.fn();

    it('renders in full mode by default', () => {
        render(<GenerationResultEditor exam={mockExam} onChange={mockOnChange} />);

        const section = screen.getByTestId('question-section-edit');
        // In GenerationResultEditor, viewMode is omitted so it defaults to 'full' in children
        expect(section).toHaveAttribute('data-viewmode', 'full');
        expect(screen.getByText('Full Mode')).toBeDefined();
    });
});
