import { Paper, Tooltip, Typography, Box } from '@mui/material';
import type { Corral } from '../../../infrastructure/api/GlobalHatosAPI';

interface CorralCardProps {
  corral: Corral;
  onClick: (corral: Corral) => void;
}

export const CorralCard: React.FC<CorralCardProps> = ({ corral, onClick }) => {
  return (
    <Tooltip
      title={
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {corral.nombre_grupo}
          </Typography>
          <Typography variant="caption">
            {corral.total_animales} animales
          </Typography>
          <br />
          <Typography variant="caption">
            Producción prom: {corral.produccion_promedio.toFixed(1)} L/día
          </Typography>
        </Box>
      }
      arrow
    >
      <Paper
        onClick={() => onClick(corral)}
        sx={{
          aspectRatio: '4 / 3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'primary.light',
          borderRadius: 2,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: 'primary.main',
            transform: 'scale(1.02)',
            boxShadow: 3,
          },
        }}
      >
        <Typography variant="h6" sx={{ color: 'white', textAlign: 'center', px: 1 }}>
          {corral.nombre_grupo}
        </Typography>
        <Typography variant="body2" sx={{ color: 'white', opacity: 0.9, mt: 0.5 }}>
          {corral.total_animales} animales
        </Typography>
      </Paper>
    </Tooltip>
  );
};
