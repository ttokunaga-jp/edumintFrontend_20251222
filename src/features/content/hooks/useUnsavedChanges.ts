/**
 * useUnsavedChanges hook
 *
 * 未保存変更を追跡するカスタムフック
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseUnsavedChangesReturn {
  hasUnsaved: boolean;
  unsavedFields: Set<string>;
  markAsChanged: (fieldId: string) => void;
  markAsSaved: (fieldId?: string) => void;
  markAllSaved: () => void;
  isFieldChanged: (fieldId: string) => boolean;
}

/**
 * 未保存変更を追跡
 *
 * @param initialState - 初期状態
 * @returns 未保存変更の追跡オブジェクト
 */
export function useUnsavedChanges(
  initialState?: string
): UseUnsavedChangesReturn {
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [unsavedFields, setUnsavedFields] = useState<Set<string>>(new Set());
  const initialValueRef = useRef(initialState);

  const markAsChanged = useCallback((fieldId: string) => {
    setUnsavedFields((prev) => {
      const next = new Set(prev);
      next.add(fieldId);
      return next;
    });
    setHasUnsaved(true);
  }, []);

  const markAsSaved = useCallback((fieldId?: string) => {
    if (fieldId) {
      setUnsavedFields((prev) => {
        const next = new Set(prev);
        next.delete(fieldId);
        return next;
      });
    } else {
      setUnsavedFields(new Set());
      setHasUnsaved(false);
    }
  }, []);

  const markAllSaved = useCallback(() => {
    setUnsavedFields(new Set());
    setHasUnsaved(false);
  }, []);

  const isFieldChanged = useCallback(
    (fieldId: string) => unsavedFields.has(fieldId),
    [unsavedFields]
  );

  return {
    hasUnsaved,
    unsavedFields,
    markAsChanged,
    markAsSaved,
    markAllSaved,
    isFieldChanged,
  };
}
