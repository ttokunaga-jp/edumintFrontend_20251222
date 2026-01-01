import { createContext, useContext, useState, FC, PropsWithChildren, useMemo, useCallback } from 'react';

/**
 * AppBar 制御用の Context
 * 
 * TopMenuBar の保存・編集・閲覧ボタンの状態を一元管理します。
 * Pages層は「状態」のみを設定し、TopMenuBar が UI を構築します。
 * 
 * ========== 使用方法 ==========
 * 
 * 1. ページ層で useAppBarAction() フックを取得
 * 2. enableAppBarActions を true にして機能を有効化
 * 3. onSave コールバックに保存処理を登録
 * 4. hasUnsavedChanges で未保存フラグを更新
 * 5. isSaving で保存中フラグを管理
 * 
 * 詳細は docs/APPBAR_INTEGRATION_GUIDE.md を参照
 */
interface AppBarActionContextType {
    // 機能の有効/無効
    enableAppBarActions: boolean;
    setEnableAppBarActions: (enable: boolean) => void;

    // 編集・プレビューモード
    isEditMode: boolean;
    setIsEditMode: (isEdit: boolean) => void;

    // 変更検知（未保存内容がある）
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: (hasChanges: boolean) => void;

    // 保存処理（TopMenuBar の SAVE ボタンが押された時に呼ばれる）
    onSave: (() => void | Promise<void>) | null;
    setOnSave: (callback: (() => void | Promise<void>) | null) => void;

    // 保存中フラグ（SAVE ボタンの disabled 状態制御）
    isSaving: boolean;
    setIsSaving: (isSaving: boolean) => void;

    // ページ遷移時の警告処理（TopMenuBar から呼ばれる）
    onNavigateWithCheck: ((path: string) => void) | null;
    setOnNavigateWithCheck: (callback: ((path: string) => void) | null) => void;
}

const AppBarActionContext = createContext<AppBarActionContextType | undefined>(undefined);

export const AppBarActionProvider: FC<PropsWithChildren> = ({ children }) => {
    const [enableAppBarActions, setEnableAppBarActionsState] = useState(false);
    const [isEditMode, setIsEditModeState] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChangesState] = useState(false);
    const [onSave, setOnSaveState] = useState<(() => void | Promise<void>) | null>(null);
    const [isSaving, setIsSavingState] = useState(false);
    const [onNavigateWithCheck, setOnNavigateWithCheckState] = useState<((path: string) => void) | null>(null);

    // Stable setter functions using useCallback
    const setEnableAppBarActions = useCallback((enable: boolean) => {
        setEnableAppBarActionsState(enable);
    }, []);

    const setIsEditMode = useCallback((isEdit: boolean) => {
        setIsEditModeState(isEdit);
    }, []);

    const setHasUnsavedChanges = useCallback((hasChanges: boolean) => {
        setHasUnsavedChangesState(hasChanges);
    }, []);

    const setOnSave = useCallback((callback: (() => void | Promise<void>) | null) => {
        setOnSaveState(() => callback);
    }, []);

    const setIsSaving = useCallback((saving: boolean) => {
        setIsSavingState(saving);
    }, []);

    const setOnNavigateWithCheck = useCallback((callback: ((path: string) => void) | null) => {
        setOnNavigateWithCheckState(() => callback);
    }, []);

    const value = useMemo(() => ({
        enableAppBarActions,
        setEnableAppBarActions,
        isEditMode,
        setIsEditMode,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        onSave,
        setOnSave,
        isSaving,
        setIsSaving,
        onNavigateWithCheck,
        setOnNavigateWithCheck,
    }), [
        enableAppBarActions,
        setEnableAppBarActions,
        isEditMode,
        setIsEditMode,
        hasUnsavedChanges,
        setHasUnsavedChanges,
        onSave,
        setOnSave,
        isSaving,
        setIsSaving,
        onNavigateWithCheck,
        setOnNavigateWithCheck,
    ]);

    return (
        <AppBarActionContext.Provider value={value}>
            {children}
        </AppBarActionContext.Provider>
    );
};

export function useAppBarAction() {
    const context = useContext(AppBarActionContext);
    if (context === undefined) {
        throw new Error('useAppBarAction must be used within an AppBarActionProvider');
    }
    return context;
}
