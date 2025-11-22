import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APP_ROUTES } from "@constants/AppRoutes";

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(APP_ROUTES.DASHBOARD);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Typography variant="h1" sx={{ fontSize: "8rem", fontWeight: 600, color: "primary.main" }}>
        404
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "1.25rem", color: "text.secondary", mt: 2 }}>
        Página no encontrada
      </Typography>
      <Button
        variant="contained"
        onClick={handleGoBack}
        sx={{ mt: 3 }}
      >
        Volver
      </Button>
    </Box>
  );
};
