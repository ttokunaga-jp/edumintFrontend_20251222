/**
 * Editor Component Types
 */

export interface QuestionEditorPreviewProps {
  value: string;
  onChange: (value: string) => void;
  onSave?: (value: string) => Promise<void>;
  isSaving?: boolean;
  placeholder?: string;
  minEditorHeight?: number;
  minPreviewHeight?: number;
  previewDisabled?: boolean;
  disableFolding?: boolean;
  disableUndo?: boolean;
  autoSaveDelay?: number;
  mode?: 'preview' | 'edit';
  onUnsavedChange?: (hasUnsaved: boolean) => void;
  inputId?: string;
  name?: string;
}

export interface EditorPreviewPanelProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minEditorHeight?: number;
  minPreviewHeight?: number;
  previewDisabled?: boolean;
  disableFolding?: boolean;
  mode?: 'preview' | 'edit';
  id?: string;
  name?: string;
}

export interface FormEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  hasLatex?: boolean;
  readOnly?: boolean;
  id?: string;
  name?: string;
}

export interface LaTeXPreviewProps {
  content: string;
}
