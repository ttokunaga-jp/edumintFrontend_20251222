import React from 'react';
import { Eye, Edit } from 'lucide-react';
import { Button } from '@/components/primitives/button';

export interface PreviewEditToggleProps {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function PreviewEditToggle({ isEditMode, setIsEditMode, disabled = false, disabledReason }: PreviewEditToggleProps) {
  return (
    <div className="flex bg-white rounded-lg p-1 border border-gray-200 shadow-sm">
      <Button
        variant={!isEditMode ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setIsEditMode(false)}
        className="flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        プレビュー
      </Button>
      <Button
        variant={isEditMode ? 'default' : 'ghost'}
        size="sm"
        onClick={() => !disabled && setIsEditMode(true)}
        disabled={disabled}
        className="flex items-center gap-2"
        title={disabled ? disabledReason || '編集権限が必要です' : undefined}
      >
        <Edit className="w-4 h-4" />
        編集モード
      </Button>
    </div>
  );
}
