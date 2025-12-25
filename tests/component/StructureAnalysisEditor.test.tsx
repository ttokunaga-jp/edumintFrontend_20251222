import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { StructureAnalysisEditor } from '@/components/page/ProblemEditor/StructureAnalysisEditor';
import React from 'react';

// Mock child components that might be complex
vi.mock('../ProblemViewEditPage/QuestionSectionEdit', () => ({
    QuestionSectionEdit: ({ viewMode }: { viewMode: string }) => (
        <div data-testid="question-section-edit" data-viewmode={viewMode}>
            {viewMode === 'structure' ? 'Structure Mode' : 'Full Mode'}
        </div>
    ),
}));

describe('StructureAnalysisEditor', () => {
    const mockExam = {
        questions: [
            { id: '1', question_content: 'Test content', sub_questions: [] }
        ]
    };
    const mockOnChange = vi.fn();

    it('renders in structure mode', () => {
        render(<StructureAnalysisEditor exam={mockExam} onChange={mockOnChange} />);

        const section = screen.getByTestId('question-section-edit');
        expect(section).toHaveAttribute('data-viewmode', 'structure');
        expect(screen.getByText('Structure Mode')).toBeDefined();
    });

    it('renders "Add Question" button', () => {
        render(<StructureAnalysisEditor exam={mockExam} onChange={mockOnChange} />);
        expect(screen.getByText('大問を追加')).toBeDefined();
    });
});
