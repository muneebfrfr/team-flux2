// src/components/Project/ColorPickerField.tsx
"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import ColorizeIcon from "@mui/icons-material/Colorize";
import { HexColorPicker } from "react-colorful";
import AppTextField from "@/components/ui/AppTextField";

interface ColorPickerFieldProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
  error?: string;
}

export default function ColorPickerField({
  value,
  onChange,
  error,
}: ColorPickerFieldProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box sx={{ mt: 2, mb: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box sx={{ position: "relative", width: 600 }}>
          <AppTextField
            label="Color"
            value={value}
            disabled
            fullWidth
            InputProps={{
              startAdornment: (
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "4px",
                    backgroundColor: value,
                    border: "1px solid #ccc",
                    mr: 1.5,
                  }}
                />
              ),
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton onClick={handleOpen}>
              <ColorizeIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <HexColorPicker color={value} onChange={onChange} />
        </Box>
      </Popover>
    </Box>
  );
}
