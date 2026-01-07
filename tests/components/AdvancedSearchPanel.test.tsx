import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedSearchPanel, SearchFilters } from '@/components/page/HomePage/AdvancedSearchPanel';
import i18next from '@/lib/i18n';
import { PROBLEM_FORMAT_OPTIONS } from '@/features/ui/selectionOptions';

describe('AdvancedSearchPanel - QuestionType filter', () => {
  it('renders problem question types and applies selection', () => {
    const onFiltersChange = vi.fn();
    const filters: SearchFilters = {};

    render(
      <AdvancedSearchPanel
        filters={filters}
        onFiltersChange={onFiltersChange}
        isOpen={true}
      />
    );

    // Ensure the questionType section is present
    expect(screen.getByText(i18next.t('filters.questionType'))).toBeInTheDocument();

    // Toggle the first format checkbox (localized label)
    const firstFormat = screen.getByLabelText(i18next.t(PROBLEM_FORMAT_OPTIONS[0].labelKey));
    fireEvent.click(firstFormat);

    // Click the search/apply button (use positional lookup to avoid i18n issues)
    const buttons = screen.getAllByRole('button');
    // The apply and reset buttons are rendered last in the panel; pick the apply one
    const applyButton = buttons[buttons.length - 2];
    fireEvent.click(applyButton);

    // onFiltersChange should be called with questionType including the value for the first option
    expect(onFiltersChange).toHaveBeenCalled();
    const calledWith = onFiltersChange.mock.calls[0][0];
    expect(calledWith.questionType).toBeDefined();
    expect(Array.isArray(calledWith.questionType)).toBe(true);
    expect(calledWith.questionType).toContain(PROBLEM_FORMAT_OPTIONS[0].value);
  });
});
