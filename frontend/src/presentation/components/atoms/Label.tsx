import { Typography, type TypographyProps, Box } from "@mui/material";

interface LabelProps extends TypographyProps {
  text: string;
  required?: boolean;
  optional?: boolean;
  error?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  text,
  required = false,
  optional = false,
  error = false,
  variant = "subtitle2",
  sx,
  ...props
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    <Typography
      variant={variant}
      component="label"
      sx={{
        fontWeight: 600,
        color: error ? "#d32f2f" : "text.primary",
        ...sx,
      }}
      {...props}
    >
      {text}
    </Typography>
    {required && <span style={{ color: "#d32f2f", fontSize: "1.2em" }}>*</span>}
    {optional && (
      <Typography
        variant="caption"
        sx={{ color: "text.secondary", fontStyle: "italic" }}
      >
        (Opcional)
      </Typography>
    )}
  </Box>
);
