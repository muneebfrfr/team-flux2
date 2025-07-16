"use client";

import { ReactNode } from "react";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

type AppTextFieldProps = TextFieldProps & {
  icon?: ReactNode;
};

export default function AppTextField({ icon, ...props }: AppTextFieldProps) {
  return (
    <TextField
      {...props}
      InputProps={{
        ...props.InputProps,
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : props.InputProps?.startAdornment,
        sx: {
          borderRadius: 2,
          backgroundColor: "#f0f4ff",
          ...(props.InputProps?.sx || {}),
        },
      }}
    />
  );
}
