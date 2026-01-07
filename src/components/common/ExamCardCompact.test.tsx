import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect } from 'vitest';
import ExamCardCompact from './ExamCardCompact';
import i18next from '@/lib/i18n';

describe('ExamCardCompact', () => {
  it('renders all required elements: chips, title, field, stats and buttons', async () => {
    const item = {
      id: 'ex1',
      title: '量子力学基礎 中間試験',
      examType: 1,
      examTypeLabel: i18next.t('enum.exam.class'), // Use i18n translation
      examYear: 2024,
      university: '帝都理工大学',
      faculty: '理学部物理学科',
      majorType: 0, // Science (理系) from academic_track enum
      academicFieldName: '物理学',
      subjectName: '量子力学I',
      durationMinutes: 90,
      views: 312,
      likes: 245,
    };

    const handleView = vi.fn();
    const handleGood = vi.fn();

    render(<ExamCardCompact item={item as any} onView={handleView} onGood={handleGood} />);

    // Row 1: Chips - Expect i18n translated values
    expect(screen.getByText(i18next.t('enum.exam.class'))).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
    expect(screen.getByText('帝都理工大学')).toBeInTheDocument();

    // Row 2: Title (Large, Bold, Centered)
    const title = screen.getByText('量子力学基礎 中間試験');
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H5'); // Changed to H5 in my implementation for better scaling

    // Row 3: Academic field chips
    expect(screen.getByText('理系')).toBeInTheDocument();
    expect(screen.getByText('物理学')).toBeInTheDocument();

    // Row 4: Duration and Subject (Both as Chips)
    expect(screen.getByText('90分')).toBeInTheDocument();
    expect(screen.getByText('量子力学I')).toBeInTheDocument();

    // Row 5: Footer Stats
    expect(screen.getByText('312')).toBeInTheDocument();
    expect(screen.getByText('245')).toBeInTheDocument();

    // Good icon button interaction
    const goodBtn = screen.getByLabelText('good');
    await userEvent.click(goodBtn);
    expect(handleGood).toHaveBeenCalledWith('ex1');
  });
});