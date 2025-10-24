import { Box, Container, Paper, Typography, Link } from "@mui/material";

interface AuthTemplateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footerText?: string;
  footerLinkText?: string;
  footerLinkHref?: string;
  onFooterLinkClick?: () => void;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title = "Autenticación",
  subtitle = "Gestión Inteligente de Ganado",
  footerText,
  footerLinkText,
  footerLinkHref,
  onFooterLinkClick,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: "white",
                  fontWeight: 700,
                }}
              >
                🪐
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          </Box>

          {/* Content */}
          {children}

          {/* Footer Link */}
          {footerText && (
            <Box
              sx={{
                textAlign: "center",
                mt: 3,
                pt: 3,
                borderTop: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {footerText}{" "}
                {footerLinkText && (
                  <Link
                    type="button"
                    variant="body2"
                    onClick={(e) => {
                      e.preventDefault();
                      onFooterLinkClick?.();
                    }}
                    href={footerLinkHref || "#"}
                    sx={{
                      cursor: "pointer",
                      fontWeight: 700,
                      textDecoration: "none",
                      color: "#667eea",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {footerLinkText}
                  </Link>
                )}
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Additional Info */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 3,
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          © 2024 Gestión Inteligente de Ganado. Todos los derechos reservados.
        </Typography>
      </Container>
    </Box>
  );
};
