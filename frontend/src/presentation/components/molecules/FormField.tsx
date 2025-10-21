import { Box, type BoxProps, type TextFieldProps } from "@mui/material";
import { Label } from "@atoms/Label";
import { Input } from "@atoms/Input";

interface FormFieldProps extends Omit<BoxProps, "children"> {
  label: string;
  inputProps: Omit<TextFieldProps, "label" | "variant">;
  required?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  optional?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  inputProps,
  required = false,
  optional = false,
  error = false,
  helperText,
  sx,
  ...boxProps
}) => (
  <Box
    sx={{ display: "flex", flexDirection: "column", gap: 1, ...sx }}
    {...boxProps}
  >
    <Label text={label} required={required} optional={optional} error={error} />
    <Input error={error} helperText={helperText} {...inputProps} />
  </Box>
);
