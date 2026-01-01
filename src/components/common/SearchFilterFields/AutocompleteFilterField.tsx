import { Autocomplete, TextField } from '@mui/material';

export interface AutocompleteFilterFieldProps {
  label: string;
  options: string[];
  value: string | string[];
  multiple?: boolean;
  defaultValue?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
}

/**
 * 大学、学部、学問分野などのオートコンプリート入力フィールド
 * 複数選択または単一選択に対応
 */
export function AutocompleteFilterField({
  label,
  options,
  value,
  multiple = false,
  defaultValue,
  onChange,
  placeholder = '選択または入力',
}: AutocompleteFilterFieldProps) {
  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      value={value}
      onChange={(e, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
        />
      )}
    />
  );
}
