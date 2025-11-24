import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { APP_ROUTES } from "@constants/AppRoutes";

export const PendingApprovalPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(APP_ROUTES.LOGIN);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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
      <Typography variant="h1" sx={{ fontSize: "6rem", fontWeight: 600, color: "primary.main" }}>
        ⏳
      </Typography>
      <Typography variant="h4" sx={{ fontSize: "2rem", fontWeight: 500, color: "text.primary", mt: 2 }}>
        Aprobación Pendiente
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "1.25rem", color: "text.secondary", mt: 2, textAlign: "center", maxWidth: "500px" }}>
        Tu cuenta está pendiente de aprobación por parte del administrador.
        Por favor, espera a que tu solicitud sea revisada.
      </Typography>
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{ mt: 3 }}
      >
        Cerrar Sesión
      </Button>
    </Box>
  );
};
