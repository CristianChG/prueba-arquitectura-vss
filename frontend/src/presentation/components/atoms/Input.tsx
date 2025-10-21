import {
  TextField,
  type TextFieldProps as MuiTextFieldProps,
  InputAdornment,
} from "@mui/material";
import { forwardRef } from "react";

interface InputProps extends Omit<MuiTextFieldProps, "variant"> {
  label?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLDivElement, InputProps>(
  (
    {
      label,
      error = false,
      helperText,
      isPassword = false,
      leftIcon,
      rightIcon,
      type,
      InputProps: inputProps,
      ...props
    },
    ref
  ) => {
    return (
      <TextField
        ref={ref}
        label={label}
        error={error}
        helperText={helperText}
        type={isPassword ? "password" : type}
        variant="outlined"
        fullWidth
        InputProps={{
          startAdornment: leftIcon ? (
            <InputAdornment position="start">{leftIcon}</InputAdornment>
          ) : undefined,
          endAdornment: rightIcon ? (
            <InputAdornment position="end">{rightIcon}</InputAdornment>
          ) : undefined,
          ...inputProps,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
