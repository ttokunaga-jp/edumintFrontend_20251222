import { useEffect, useCallback, ReactNode } from 'react';
import { useAppBarAction } from '@/contexts/AppBarActionContext';

interface UseAppBarEditActionsProps {
  /**
   * 編集・プレビュー・保存ボタンを表示するかどうか
   * true の場合、setActions 経由で AppBar に表示される
   */
  isEnabled: boolean;

  /**
   * 現在のモードが編集モードかどうか
   */
  isEditMode: boolean;

  /**
   * 編集モードを切り替える関数
   */
  onToggleEditMode: (isEdit: boolean) => void;

  /**
   * 保存ボタンが押された時のコールバック
   */
  onSave: () => void | Promise<void>;

  /**
   * 保存中かどうか
   */
  isSaving?: boolean;

  /**
   * 変更があるかどうか（保存ボタンの disabled 状態を制御）
   */
  hasChanges?: boolean;

  /**
   * 既にカスタムの actions を設定している場合、その JSX を渡す
   * undefined の場合は、デフォルトの PreviewEditToggle + Save ボタンを使用
   */
  customActions?: ReactNode;
}

/**
 * AppBar に編集・プレビュー・保存ボタンを管理するカスタムフック
 *
 * 使用方法:
 * ```tsx
 * const { setActions } = useAppBarAction();
 * useAppBarEditActions({
 *   isEnabled: true,
 *   isEditMode,
 *   onToggleEditMode: setIsEditMode,
 *   onSave: handleSave,
 *   isSaving: false,
 *   hasChanges: true,
 * });
 * ```
 *
 * @param props - 設定オプション
 */
export function useAppBarEditActions(props: UseAppBarEditActionsProps) {
  const {
    isEnabled,
    isEditMode,
    onToggleEditMode,
    onSave,
    isSaving = false,
    hasChanges = true,
    customActions,
  } = props;

  const { setActions } = useAppBarAction();

  // cleanup 関数
  useEffect(() => {
    if (!isEnabled) {
      setActions(null);
      return;
    }

    // customActions が指定されている場合はそれを使用
    if (customActions) {
      setActions(customActions);
      return;
    }

    // cleanup 関数を返す
    return () => {
      setActions(null);
    };
  }, [isEnabled, customActions, setActions]);
}

export default useAppBarEditActions;
