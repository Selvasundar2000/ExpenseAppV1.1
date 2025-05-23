import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function Dropdown({
  id,
  label,
  options,
  value,
  onChange,
  width = 200, // default width in px, but can be overridden
  sx = {},     // additional sx if needed
}) {
  return (
    <FormControl sx={{ width, ...sx }}>
      <InputLabel>{label}</InputLabel>
      <Select
        id={id}
        value={value}
        onChange={onChange}
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default Dropdown;
