import { useState, useMemo, useCallback, useEffect } from 'react';
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
  TextField,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { Cow } from '../../../infrastructure/api/GlobalHatosAPI';

interface CowsTableProps {
  cows: Cow[];
  loading: boolean;
}

type OrderBy = 'numero_animal' | 'produccion_leche_ayer' | 'produccion_media_7dias' | 'estado_reproduccion' | 'dias_ordeno' | 'recomendacion';

export const CowsTable: React.FC<CowsTableProps> = ({ cows, loading }) => {
  const [orderBy, setOrderBy] = useState<OrderBy>('numero_animal');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [estadoReproductivoFilter, setEstadoReproductivoFilter] = useState<string>('');
  const [recomendacionFilter, setRecomendacionFilter] = useState<string>('');
  const [page, setPage] = useState(0); // MUI uses 0-based indexing
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Reset state when cows data changes (e.g., switching groups)
  useEffect(() => {
    setPage(0);
    setSearch('');
    setEstadoReproductivoFilter('');
    setRecomendacionFilter('');
  }, [cows]);

  const handleRequestSort = useCallback((property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0); // Reset to first page when sorting
  }, [orderBy, order]);

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); // Reset to first page when searching
  }, []);

  const handleEstadoReproductivoChange = useCallback((event: any) => {
    setEstadoReproductivoFilter(event.target.value);
    setPage(0); // Reset to first page when filtering
  }, []);

  const handleRecomendacionChange = useCallback((event: any) => {
    setRecomendacionFilter(event.target.value);
    setPage(0); // Reset to first page when filtering
  }, []);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  }, []);

  // Get unique reproductive states for the dropdown
  const uniqueEstadosReproductivos = useMemo(() => {
    const estados = new Set<string>();
    cows.forEach(cow => {
      if (cow.estado_reproduccion) {
        estados.add(cow.estado_reproduccion);
      }
    });
    return Array.from(estados).sort();
  }, [cows]);

  // Process cows: filter, sort, and paginate
  const processedCows = useMemo(() => {
    // Step 1: Filter by search and reproductive state
    let filtered = cows;

    // Filter by animal number search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(cow =>
        cow.numero_animal.toLowerCase().includes(searchLower)
      );
    }

    // Filter by reproductive state
    if (estadoReproductivoFilter) {
      filtered = filtered.filter(cow =>
        cow.estado_reproduccion === estadoReproductivoFilter
      );
    }

    // Filter by recommendation
    if (recomendacionFilter !== '') {
      filtered = filtered.filter(cow =>
        cow.recomendacion === Number(recomendacionFilter)
      );
    }

    // Step 2: Sort (existing logic)
    const sorted = [...filtered].sort((a, b) => {
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

    // Step 3: Paginate
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return {
      data: sorted.slice(startIndex, endIndex),
      total: filtered.length,
    };
  }, [cows, search, estadoReproductivoFilter, recomendacionFilter, orderBy, order, page, rowsPerPage]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* Search and Filter */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar por número de animal..."
          value={search}
          onChange={handleSearchChange}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="estado-reproductivo-label">Estado reproductivo</InputLabel>
          <Select
            labelId="estado-reproductivo-label"
            value={estadoReproductivoFilter}
            onChange={handleEstadoReproductivoChange}
            label="Estado reproductivo"
          >
            <MenuItem value="">
              <em>Todos</em>
            </MenuItem>
            {uniqueEstadosReproductivos.map((estado) => (
              <MenuItem key={estado} value={estado}>
                {estado}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="recomendacion-label">Recomendación</InputLabel>
          <Select
            labelId="recomendacion-label"
            value={recomendacionFilter}
            onChange={handleRecomendacionChange}
            label="Recomendación"
          >
            <MenuItem value="">
              <em>Todas</em>
            </MenuItem>
            <MenuItem value="0">Producción</MenuItem>
            <MenuItem value="1">Monitorear</MenuItem>
            <MenuItem value="2">Secar</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>
                <TableSortLabel
                  active={orderBy === 'numero_animal'}
                  direction={orderBy === 'numero_animal' ? order : 'asc'}
                  onClick={() => handleRequestSort('numero_animal')}
                >
                  Número
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>
                Núm. Selección
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '18%' }}>
                <TableSortLabel
                  active={orderBy === 'produccion_leche_ayer'}
                  direction={orderBy === 'produccion_leche_ayer' ? order : 'asc'}
                  onClick={() => handleRequestSort('produccion_leche_ayer')}
                >
                  Producción ayer (L)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '18%' }}>
                <TableSortLabel
                  active={orderBy === 'produccion_media_7dias'}
                  direction={orderBy === 'produccion_media_7dias' ? order : 'asc'}
                  onClick={() => handleRequestSort('produccion_media_7dias')}
                >
                  Promedio 7 días (L)
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>
                <TableSortLabel
                  active={orderBy === 'estado_reproduccion'}
                  direction={orderBy === 'estado_reproduccion' ? order : 'asc'}
                  onClick={() => handleRequestSort('estado_reproduccion')}
                >
                  Estado reproducción
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '14%' }}>
                <TableSortLabel
                  active={orderBy === 'dias_ordeno'}
                  direction={orderBy === 'dias_ordeno' ? order : 'asc'}
                  onClick={() => handleRequestSort('dias_ordeno')}
                >
                  Días ordeño
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '18%' }}>
                <TableSortLabel
                  active={orderBy === 'recomendacion'}
                  direction={orderBy === 'recomendacion' ? order : 'asc'}
                  onClick={() => handleRequestSort('recomendacion')}
                >
                  <Box
                    component="span"
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* Base Content */}
                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                      <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.5, color: 'inherit' }} /> Recomendación
                    </Box>

                    {/* Shimmer Overlay - Clipped to text */}
                    <Box
                      component="span"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)',
                        backgroundSize: '200% 100%',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        animation: 'shine 3s infinite linear',
                        pointerEvents: 'none',
                        '@keyframes shine': {
                          '0%': { backgroundPosition: '-100% 0' },
                          '100%': { backgroundPosition: '200% 0' }
                        },
                        // Ensure icon inherits transparent color to show background
                        '& .MuiSvgIcon-root': {
                          color: 'inherit',
                        }
                      }}
                    >
                      <AutoAwesomeIcon sx={{ fontSize: 16, mr: 0.5 }} /> Recomendación
                    </Box>
                  </Box>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedCows.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    {search || estadoReproductivoFilter
                      ? 'No se encontraron vacas con los filtros aplicados'
                      : 'No hay vacas en este grupo'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              processedCows.data.map((cow) => (
                <TableRow key={cow.id} hover>
                  <TableCell>{cow.numero_animal}</TableCell>
                  <TableCell>{cow.numero_seleccion ?? '-'}</TableCell>
                  <TableCell>
                    {cow.produccion_leche_ayer != null ? Number(cow.produccion_leche_ayer).toFixed(2) : '-'}
                  </TableCell>
                  <TableCell>
                    {cow.produccion_media_7dias != null ? Number(cow.produccion_media_7dias).toFixed(2) : '-'}
                  </TableCell>
                  <TableCell>{cow.estado_reproduccion || '-'}</TableCell>
                  <TableCell>{cow.dias_ordeno || '-'}</TableCell>
                  <TableCell>
                    {(() => {
                      let text = '-';
                      let color = 'transparent';
                      let textColor = 'inherit';

                      switch (cow.recomendacion) {
                        case 0:
                          text = 'Producción';
                          color = '#e8f5e9'; // Light green
                          textColor = '#2e7d32'; // Dark green
                          break;
                        case 1:
                          text = 'Monitorear';
                          color = '#fff3e0'; // Light orange
                          textColor = '#ef6c00'; // Dark orange
                          break;
                        case 2:
                          text = 'Secar';
                          color = '#ffebee'; // Light red
                          textColor = '#c62828'; // Dark red
                          break;
                      }

                      if (text === '-') return text;

                      return (
                        <Box
                          sx={{
                            backgroundColor: color,
                            color: textColor,
                            py: 0.5,
                            px: 1.5,
                            borderRadius: '16px',
                            display: 'inline-block',
                            fontWeight: 500,
                            fontSize: '0.875rem',
                          }}
                        >
                          {text}
                        </Box>
                      );
                    })()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={processedCows.total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>
    </>
  );
};
