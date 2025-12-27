import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProblemTextEditor from '../ProblemTextEditor';
import { vi } from 'vitest';

describe('ProblemTextEditor', () => {
  it('renders and toggles format and preview', () => {
    const onChange = vi.fn();
    const onFormatChange = vi.fn();
    render(
      <ProblemTextEditor
        value="hello"
        format={0}
        onChange={onChange}
        onFormatChange={onFormatChange}
        ariaLabel="問題文"
        showPreview
      />
    );

    const textarea = screen.getByLabelText('問題文入力') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'updated' } });
    expect(onChange).toHaveBeenCalledWith('updated');

    const toggle = screen.getByLabelText('問題文 フォーマット切替');
    fireEvent.click(toggle);
    expect(onFormatChange).toHaveBeenCalled();
  });
});
