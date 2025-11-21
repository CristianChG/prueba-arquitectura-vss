import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";

type ColorVariant = "primary" | "secondary" | "success" | "warning" | "info" | "error";

interface ButtonProps extends Omit<MuiButtonProps, "color" | "variant"> {
  label: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  variant?: "text" | "outlined" | "contained";
  color?: ColorVariant;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  isLoading = false,
  disabled,
  icon,
  iconPosition = "start",
  startIcon,
  endIcon,
  variant = "contained",
  color = "primary",
  ...props
}) => {
  const computedStartIcon = iconPosition === "start" ? icon : startIcon;
  const computedEndIcon = iconPosition === "end" ? icon : endIcon;

  return (
    <MuiButton
      variant={variant}
      color={color}
      disabled={disabled || isLoading}
      startIcon={
        isLoading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          computedStartIcon
        )
      }
      endIcon={computedEndIcon}
      {...props}
    >
      {label}
    </MuiButton>
  );
};
