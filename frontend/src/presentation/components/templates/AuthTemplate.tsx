import { Box, Typography, Link } from "@mui/material";

interface AuthTemplateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footerText?: string;
  footerLinkText?: string;
  onFooterLinkClick?: () => void;
}

export const AuthTemplate: React.FC<AuthTemplateProps> = ({
  children,
  title = "Iniciar sesión",
  subtitle = "Bienvenido a saturno",
  footerText,
  footerLinkText,
  onFooterLinkClick,
}) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left side - Form */}
      <Box
        sx={{
          flex: { xs: "1", md: "0 0 60%" },
          backgroundColor: "#F2F0EF",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          px: { xs: 3, sm: 6, md: 8, lg: 12 },
          py: { xs: 4, md: 6 },
          minHeight: { xs: "auto", md: "100vh" },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 400,
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            SATURNO 🪐🌾
          </Typography>
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 400,
            mb: 3,
            color: "text.primary",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 400,
            mb: 4,
            color: "text.primary",
          }}
        >
          {subtitle}
        </Typography>

        {/* Form Content */}
        <Box sx={{ mb: 3 }}>{children}</Box>

        {/* Footer Link */}
        {footerText && footerLinkText && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              {footerText}{" "}
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  onFooterLinkClick?.();
                }}
                sx={{
                  cursor: "pointer",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "#71873F",
                  background: "none",
                  border: "none",
                  padding: 0,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                {footerLinkText}
              </Link>
            </Typography>
          </Box>
        )}
      </Box>

      {/* Right side - Background Image */}
      <Box
        sx={{
          flex: { xs: "0", md: "0 0 40%" },
          minHeight: { xs: "200px", md: "100vh" },
          backgroundImage:
            "url(/auth_banner_vertical.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: { xs: "none", md: "block" },
        }}
      />
    </Box>
  );
};
