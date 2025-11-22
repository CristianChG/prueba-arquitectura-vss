import { Box, Typography } from '@mui/material';

export const TableroContent = () => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Contenido del Tablero
      </Typography>
      <Typography color="text.secondary">
        Aquí irá el contenido del tablero (estadísticas, gráficos, cards, etc.)
      </Typography>
    </Box>
  );
};
