import React, { useMemo, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

export type Keyword = { id: string; keyword: string };
type KeywordLike = Keyword | string;

type KeywordEditorProps = {
  keywords?: KeywordLike[];
  onAdd?: (keyword: string) => void;
  onRemove?: (id: string) => void;
  placeholder?: string;
  ariaLabelInput?: string;
  canEdit?: boolean;
  className?: string;
};

export const KeywordEditor: React.FC<KeywordEditorProps> = ({
  keywords = [],
  onAdd,
  onRemove,
  placeholder = 'キーワードを追加...',
  ariaLabelInput,
  canEdit = false,
  className = '',
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  const normalized = useMemo<Keyword[]>(() => {
    return (keywords ?? []).map((kw, idx) => {
      if (typeof kw === 'string') return { id: `kw-${idx}`, keyword: kw };
      if (!kw.id) return { ...kw, id: kw.keyword || `kw-${idx}` };
      return kw;
    });
  }, [keywords]);

  const handleAdd = () => {
    if (!newKeyword.trim()) return;
    onAdd?.(newKeyword.trim());
    setNewKeyword('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
        {normalized.map((kw) => (
          <span
            key={kw.id}
            style={{
      alignItems: "center",
      gap: "0.25rem"
    }}>
            {kw.keyword}
            {canEdit && onRemove && (
              <button
                onClick={() => onRemove(kw.id)}
                className={undefined}
                aria-label="キーワード削除"
              >
                <Trash2 className={undefined} />
              </button>
            )}
          </span>
        ))}
      </div>

      {canEdit && onAdd && (
        <div style={{
      display: "flex",
      gap: "0.5rem"
    }}>
          <input
            aria-label={ariaLabelInput ?? 'キーワード入力'}
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder={placeholder}
            className={undefined}
          />
          <button
            onClick={handleAdd}
            className={undefined}
          >
            <Plus className={undefined} />
          </button>
        </div>
      )}
    </div>
  );
};
