import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import type { Cow } from '../../../infrastructure/api/GlobalHatosAPI';

interface CowsTableProps {
  cows: Cow[];
  loading: boolean;
}

export const CowsTable: React.FC<CowsTableProps> = ({ cows, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
      }}
    >
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'transparent' }}>
            <TableCell sx={{ fontWeight: 600, width: '20%' }}>Número</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '20%' }}>Producción ayer (L)</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '20%' }}>Promedio 7 días (L)</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '25%' }}>Estado reproducción</TableCell>
            <TableCell sx={{ fontWeight: 600, width: '15%' }}>Días ordeño</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No hay vacas en este grupo
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            cows.map((cow) => (
              <TableRow key={cow.id} hover>
                <TableCell>{cow.numero_animal}</TableCell>
                <TableCell>
                  {cow.produccion_leche_ayer != null ? Number(cow.produccion_leche_ayer).toFixed(2) : '-'}
                </TableCell>
                <TableCell>
                  {cow.produccion_media_7dias != null ? Number(cow.produccion_media_7dias).toFixed(2) : '-'}
                </TableCell>
                <TableCell>{cow.estado_reproduccion || '-'}</TableCell>
                <TableCell>{cow.dias_ordeno || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
