import { Checkbox, FormControlLabel, Grid } from '@mui/material';

export interface CheckboxGroupFieldProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  columns?: {
    xs?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  };
}

/**
 * 問題形式やCustom Searchなどの複数選択チェックボックスグループ
 */
export function CheckboxGroupField({
  options,
  value,
  onChange,
  columns = { xs: 12, sm: 6, md: 4 },
}: CheckboxGroupFieldProps) {
  const handleChange = (option: string) => {
    const newValue = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValue);
  };

  return (
    <Grid container spacing={1}>
      {options.map((option) => (
        <Grid
          item
          xs={columns.xs}
          sm={columns.sm}
          md={columns.md}
          key={option}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={value.includes(option)}
                onChange={() => handleChange(option)}
              />
            }
            label={option}
          />
        </Grid>
      ))}
    </Grid>
  );
}
