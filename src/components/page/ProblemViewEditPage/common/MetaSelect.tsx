import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

type Option = { value: number; label: string };

type MetaSelectProps = {
  label: string;
  value: number;
  options: Option[];
  onChange?: (value: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
};

export const MetaSelect: React.FC<MetaSelectProps> = ({ label, value, options, onChange, disabled = false, ariaLabel }) => {
  const handleChange = (event: SelectChangeEvent<number>) => {
    onChange?.(Number(event.target.value));
  };

  return (
    <FormControl size="small" sx={{ minWidth: 120, my: 1 }}>
      <InputLabel id={`meta-select-label-${label}`}>{label}</InputLabel>
      <Select
        labelId={`meta-select-label-${label}`}
        id={`meta-select-${label}`}
        name={`meta-select-${label}`}
        value={value}
        label={label}
        disabled={disabled}
        onChange={handleChange}
        aria-label={ariaLabel ?? label}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
