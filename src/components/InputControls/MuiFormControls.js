// src/MuiFormControls.js
import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Checkbox,
  Box,
} from '@mui/material';
import dayjs from "dayjs";

// TextInput
export const TextInput = React.memo(({ label, value, onChange, placeholder }) => (

  <TextField
    fullWidth
    margin="normal"
    label={label}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  />
));

// Dropdown
export const Dropdown = React.memo(({ label, value, onChange, options }) => (
  <FormControl fullWidth margin="normal" sx={{ minWidth: 150 }}>
    <Select
      value={value}
      onChange={onChange}
      displayEmpty
      renderValue={value !== '' ? undefined : () => <> {label}</>}
    >
      <menuItem value="">
        <em>{label}</em>
      </menuItem>
      {options.map((opt, idx) => (
        <MenuItem key={idx} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
));
// // DateInput


export const DateInput = React.memo(({ label, value, onChange }) => (
    <TextField
      fullWidth
      margin="normal"
      label={label}
      type="date"
      value={value}
      onChange={onChange}
      InputLabelProps={{ shrink: true }}
    />

));

// RadioGroup
export const MuiRadioGroup = React.memo(({ label, name, value, onChange, options }) => (
  <FormControl component="fieldset" margin="normal">
    <FormLabel component="legend">{label}</FormLabel>
    <RadioGroup name={name} value={value} onChange={onChange}>
      {options.map((opt, idx) => (
        <FormControlLabel
          key={idx}
          value={opt.value}
          control={<Radio />}
          label={opt.label}
        />
      ))}
    </RadioGroup>
  </FormControl>
));

// CheckboxGroup
export const MuiCheckboxGroup = React.memo(({ label, selectedValues, onChange, options }) => (

  <FormControl component="fieldset" margin="normal">
    <FormLabel component="legend">{label}</FormLabel>
    <Box>
      {options.map((opt, idx) => (
        <FormControlLabel
          key={idx}
          control={
            <Checkbox
              checked={selectedValues.includes(opt.value)}
              onChange={() => onChange(opt.value)}
            />
          }
          label={opt.label}
        />
      ))}
    </Box>
  </FormControl>

));
