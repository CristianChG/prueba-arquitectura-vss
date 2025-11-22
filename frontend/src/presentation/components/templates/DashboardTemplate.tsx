import React from 'react';
import { Box, Container } from '@mui/material';
import { Navbar } from '../organisms/Navbar';

interface DashboardTemplateProps {
  children: React.ReactNode;
  currentPage?: string;
}

export const DashboardTemplate: React.FC<DashboardTemplateProps> = ({
  children,
  currentPage = 'Dashboard',
}) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Navbar currentPage={currentPage} />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
