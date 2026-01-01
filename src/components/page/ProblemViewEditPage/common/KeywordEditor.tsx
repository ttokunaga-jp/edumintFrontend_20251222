import React, { useMemo, useState } from 'react';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Box, IconButton, TextField, Chip } from '@mui/material'; export type Keyword = { id?: string; keyword: string };

type KeywordLike = Keyword | string;

type KeywordEditorProps = {
  keywords?: KeywordLike[];
  onAdd?: (keyword: string) => void;
  onRemove?: (id: string) => void;
  placeholder?: string;
  ariaLabelInput?: string;
  canEdit?: boolean;
  inputId?: string;
}; export const KeywordEditor: React.FC<KeywordEditorProps> = ({ keywords = [], onAdd, onRemove, placeholder = 'キーワードを追加...', ariaLabelInput, canEdit = false, inputId = 'keyword-input',
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  const normalized = useMemo<Keyword[]>(() => {
    return (keywords ?? []).map((kw, idx) => {
      if (typeof kw === 'string') return { id: String(idx), keyword: kw };
      if (!kw.id) return { ...kw, id: kw.keyword || String(idx) };
      return kw;
    });
  }, [keywords]);

  const handleAdd = () => {
    if (!newKeyword.trim()) return;
    onAdd?.(newKeyword.trim());
    setNewKeyword('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
        {normalized.map((kw) => (
          <Chip
            key={kw.id}
            label={kw.keyword}
            onDelete={canEdit && onRemove ? () => onRemove(kw.id) : undefined}
            deleteIcon={<DeleteIcon />}
            size="small"
          />
        ))}
      </Box>

      {canEdit && onAdd && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            id={inputId}
            name={inputId}
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
            size="small"
            fullWidth
          />
          <IconButton onClick={handleAdd} aria-label="キーワード追加">
            <AddIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};
