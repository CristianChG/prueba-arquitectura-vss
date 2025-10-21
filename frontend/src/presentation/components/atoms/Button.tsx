import {
  Button as MuiButton,
  type ButtonProps as MuiButtonProps,
  CircularProgress,
} from "@mui/material";

interface ButtonProps extends MuiButtonProps {
  label: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
}

export const Button: React.FC<ButtonProps> = ({
  label,
  isLoading = false,
  disabled,
  icon,
  iconPosition = "start",
  startIcon,
  endIcon,
  ...props
}) => {
  const computedStartIcon = iconPosition === "start" ? icon : startIcon;
  const computedEndIcon = iconPosition === "end" ? icon : endIcon;

  return (
    <MuiButton
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
