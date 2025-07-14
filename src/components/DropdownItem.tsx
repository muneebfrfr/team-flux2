// components/DropdownItem.tsx
'use client';

import Button  from '@mui/material/Button';
import React from 'react';

interface DropdownItemProps {
  onClick?: () => void;
  children: React.ReactNode;
}

export default function DropdownItem({ onClick, children }: DropdownItemProps) {
  return (
    <Button
      onClick={onClick}
      fullWidth
      variant="text"
      sx={{
        justifyContent: 'flex-start',
        color: 'text.primary',
        px: 2,
        py: 1,
        textTransform: 'none',
        fontSize: '0.875rem',
      }}
    >
      {children}
    </Button>
  );
}
