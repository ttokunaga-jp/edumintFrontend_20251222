import React, { useEffect, useState } from 'react';
import PreviewBlock from './PreviewBlock';

type Props = {
  value: string;
  format: 0 | 1;
  onChange: (v: string) => void;
  onFormatChange?: (next: 0 | 1) => void;
  ariaLabel: string;
  placeholder?: string;
  showPreview?: boolean;
  className?: string;
};

export default function ProblemTextEditor({
  value,
  format,
  onChange,
  onFormatChange,
  ariaLabel,
  placeholder,
  showPreview = true,
  className,
}: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  const toggleFormat = () => {
    const next = format === 0 ? 1 : 0;
    onFormatChange?.(next);
  };

  return (
    <div className={className}>
      <div className="mb-1 flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{ariaLabel}</label>
        <button
          type="button"
          onClick={toggleFormat}
          aria-label={`${ariaLabel} フォーマット切替`}
          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
        >
          {format === 0 ? 'MD' : 'LaTeX'}
        </button>
      </div>

      <textarea
        value={local}
        onChange={(e) => {
          setLocal(e.target.value);
          onChange(e.target.value);
        }}
        aria-label={`${ariaLabel}入力`}
        className="w-full min-h-[120px] rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        placeholder={placeholder ?? (format === 0 ? 'Markdown 形式で入力...' : 'LaTeX 形式で入力...')}
      />

      {showPreview && (
        <div className="mt-3 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
          <div className="mb-2 text-xs font-semibold text-gray-600">プレビュー</div>
          <PreviewBlock content={local} format={format} />
        </div>
      )}
    </div>
  );
}
