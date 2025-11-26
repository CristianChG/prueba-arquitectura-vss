import {
  Drawer,
  Box,
  Stack,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Corral, Cow } from '../../../infrastructure/api/GlobalHatosAPI';
import { CowsTable } from '../molecules/CowsTable';

interface CorralDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  corral: Corral | null;
  cows: Cow[];
  loadingCows: boolean;
}

export const CorralDetailsDrawer: React.FC<CorralDetailsDrawerProps> = ({
  open,
  onClose,
  corral,
  cows,
  loadingCows,
}) => {
  if (!corral) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: '80vw', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Typography variant="h5">{corral.nombre_grupo}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider />

        {/* Summary */}
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="caption" color="text.secondary">Total de animales</Typography>
              <Typography variant="h6">{corral.total_animales}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Producción promedio</Typography>
              <Typography variant="h6">{corral.produccion_promedio.toFixed(2)} L/día</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Producción total</Typography>
              <Typography variant="h6">{corral.produccion_total.toFixed(2)} L/día</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Promedio 7 días</Typography>
              <Typography variant="h6">{corral.produccion_promedio_7dias.toFixed(2)} L/día</Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {/* Cows Table */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Vacas del grupo</Typography>
          <CowsTable cows={cows} loading={loadingCows} />
        </Box>
      </Box>
    </Drawer>
  );
};
