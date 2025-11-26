import { useState, useMemo } from 'react';
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
  TableSortLabel,
} from '@mui/material';
import type { Cow } from '../../../infrastructure/api/GlobalHatosAPI';

interface CowsTableProps {
  cows: Cow[];
  loading: boolean;
}

type OrderBy = 'numero_animal' | 'produccion_leche_ayer' | 'produccion_media_7dias' | 'estado_reproduccion' | 'dias_ordeno';

export const CowsTable: React.FC<CowsTableProps> = ({ cows, loading }) => {
  const [orderBy, setOrderBy] = useState<OrderBy>('numero_animal');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort cows array based on orderBy and order
  const sortedCows = useMemo(() => {
    return [...cows].sort((a, b) => {
      let aValue = a[orderBy];
      let bValue = b[orderBy];

      // Handle null/undefined values
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Convert to numbers for numeric fields
      if (orderBy === 'produccion_leche_ayer' || orderBy === 'produccion_media_7dias' || orderBy === 'dias_ordeno') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      // Compare values
      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [cows, orderBy, order]);

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
            <TableCell sx={{ fontWeight: 600, width: '20%' }}>
              <TableSortLabel
                active={orderBy === 'numero_animal'}
                direction={orderBy === 'numero_animal' ? order : 'asc'}
                onClick={() => handleRequestSort('numero_animal')}
              >
                Número
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, width: '20%' }}>
              <TableSortLabel
                active={orderBy === 'produccion_leche_ayer'}
                direction={orderBy === 'produccion_leche_ayer' ? order : 'asc'}
                onClick={() => handleRequestSort('produccion_leche_ayer')}
              >
                Producción ayer (L)
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, width: '20%' }}>
              <TableSortLabel
                active={orderBy === 'produccion_media_7dias'}
                direction={orderBy === 'produccion_media_7dias' ? order : 'asc'}
                onClick={() => handleRequestSort('produccion_media_7dias')}
              >
                Promedio 7 días (L)
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, width: '25%' }}>
              <TableSortLabel
                active={orderBy === 'estado_reproduccion'}
                direction={orderBy === 'estado_reproduccion' ? order : 'asc'}
                onClick={() => handleRequestSort('estado_reproduccion')}
              >
                Estado reproducción
              </TableSortLabel>
            </TableCell>
            <TableCell sx={{ fontWeight: 600, width: '15%' }}>
              <TableSortLabel
                active={orderBy === 'dias_ordeno'}
                direction={orderBy === 'dias_ordeno' ? order : 'asc'}
                onClick={() => handleRequestSort('dias_ordeno')}
              >
                Días ordeño
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedCows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography color="text.secondary" sx={{ py: 2 }}>
                  No hay vacas en este grupo
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            sortedCows.map((cow) => (
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
