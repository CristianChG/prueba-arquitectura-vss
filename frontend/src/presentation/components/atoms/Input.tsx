import {
  TextField,
  type TextFieldProps as MuiTextFieldProps,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { forwardRef, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface InputProps extends Omit<MuiTextFieldProps, "variant"> {
  label?: string;
  error?: boolean;
  helperText?: React.ReactNode;
  isPassword?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "standard" | "outlined" | "filled";
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
      variant = "outlined",
      size = "small",
      InputProps: inputProps,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordField = type === "password" || isPassword;

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
    };

    const passwordToggleIcon = isPasswordField ? (
      <InputAdornment position="end">
        <IconButton
          onClick={handleTogglePassword}
          edge="end"
          tabIndex={-1}
          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ) : undefined;

    return (
      <TextField
        ref={ref}
        label={label}
        error={error}
        helperText={helperText}
        type={isPasswordField && !showPassword ? "password" : "text"}
        variant={variant}
        size={size}
        fullWidth
        InputProps={{
          startAdornment: leftIcon ? (
            <InputAdornment position="start">{leftIcon}</InputAdornment>
          ) : undefined,
          endAdornment: rightIcon || passwordToggleIcon,
          ...inputProps,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
