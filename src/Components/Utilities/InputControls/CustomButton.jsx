import React from 'react';
import { Button } from '@mui/material';

const CustomButton = ({ name,label, onClick, variant, color, disabled, size, id }) => {
  return (
    <Button
      name={name}
      id={id}      
      onClick={onClick}
      variant={variant || 'contained'} 
      color={color || 'primary'} 
      disabled={disabled}
      size={size || 'medium'}
    >
      {label}
    </Button>
  );
};

export default CustomButton;
