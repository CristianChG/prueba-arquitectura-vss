import {
  Alert,
  type AlertProps as MuiAlertProps,
  Collapse,
} from "@mui/material";
import { useState, useEffect, useCallback } from "react";

interface AlertBoxProps extends Omit<MuiAlertProps, "title"> {
  message: string;
  onClose?: () => void;
  autoCloseDuration?: number | null;
  title?: string;
}

export const AlertBox: React.FC<AlertBoxProps> = ({
  message,
  onClose,
  severity = "info",
  autoCloseDuration = null,
  title,
  sx,
  ...alertProps
}) => {
  const [open, setOpen] = useState(true);

  const handleClose = useCallback(() => {
    setOpen(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (autoCloseDuration && autoCloseDuration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [autoCloseDuration, handleClose]);

  return (
    <Collapse in={open} sx={{ mb: 2 }}>
      <Alert
        onClose={handleClose}
        severity={severity}
        sx={{
          borderRadius: 1,
          ...sx,
        }}
        {...alertProps}
      >
        {title && <strong>{title}</strong>}
        {title && message && " — "}
        {message}
      </Alert>
    </Collapse>
  );
};
