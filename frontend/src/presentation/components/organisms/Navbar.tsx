import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/hooks/useAuth';
import { APP_ROUTES } from '@constants/AppRoutes';
import { ROLES } from '@constants/roles';
import HomeIcon from '@mui/icons-material/Home';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';

interface NavbarProps {
  currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage = 'Dashboard' }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate(APP_ROUTES.LOGIN);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: <HomeIcon />, path: APP_ROUTES.DASHBOARD },
    { label: 'Archivos', icon: <FolderIcon />, path: APP_ROUTES.ARCHIVOS },
    { label: 'Roles y Personas', icon: <PeopleIcon />, path: '/roles', adminOnly: true },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        borderBottom: 'none',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', py: 2 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 400,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            SATURNO 🪐🌾
          </Typography>

          {/* Navigation Links + Logout Button */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            {navItems
              .filter((item) => !item.adminOnly || user?.role === ROLES.ADMIN)
              .map((item) => (
                <Button
                  key={item.label}
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: currentPage === item.label ? 'primary.main' : 'text.secondary',
                    textTransform: 'none',
                    fontWeight: currentPage === item.label ? 600 : 400,
                    fontSize: '0.95rem',
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}

            {/* Logout Button */}
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                textTransform: 'none',
                fontWeight: 500,
                px: 3,
                borderRadius: 1,
                ml: 1,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
