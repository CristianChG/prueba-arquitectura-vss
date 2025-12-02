import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  TablePagination,
  TableSortLabel,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { GlobalHatosAPI, type Cow, type Pagination } from '../../../infrastructure/api/GlobalHatosAPI';

interface CowsTableProps {
  snapshotId: number | '';
  search: string;
  grupoFilter: string;
  recomendacionFilter: string;
}

export const CowsTable: React.FC<CowsTableProps> = ({
  snapshotId,
  search,
  grupoFilter,
  recomendacionFilter,
}) => {
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [orderBy, setOrderBy] = useState<string>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const loadCows = useCallback(async () => {
    if (!snapshotId) {
      setCows([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await GlobalHatosAPI.getAllCowsBySnapshot(snapshotId as number, {
        page: pagination.page,
        limit: pagination.limit,
        sortBy: orderBy,
        sortOrder: order,
        search: search || undefined,
        nombreGrupo: grupoFilter || undefined,
        recomendacion: recomendacionFilter !== '' ? Number(recomendacionFilter) : undefined,
      });
      setCows(data.cows);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading cows:', error);
      setCows([]);
    } finally {
      setLoading(false);
    }
  }, [snapshotId, pagination.page, pagination.limit, orderBy, order, search, grupoFilter, recomendacionFilter]);

  useEffect(() => {
    loadCows();
  }, [loadCows]);

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [search, grupoFilter, recomendacionFilter, snapshotId]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage + 1 }));
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination((prev) => ({
      ...prev,
      limit: parseInt(event.target.value, 10),
      page: 1,
    }));
  }, []);

  const handleRequestSort = useCallback((property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [orderBy, order]);

  if (!snapshotId) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="text.secondary" align="center">
          Selecciona un snapshot para ver las vacas
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          opacity: loading ? 0.6 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'transparent' }}>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>
                <TableSortLabel
                  active={orderBy === 'numero_animal'}
                  direction={orderBy === 'numero_animal' ? order : 'asc'}
                  onClick={() => handleRequestSort('numero_animal')}
                >
                  Número Animal
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>
                <TableSortLabel
                  active={orderBy === 'numero_seleccion'}
                  direction={orderBy === 'numero_seleccion' ? order : 'asc'}
                  onClick={() => handleRequestSort('numero_seleccion')}
                >
                  Número Selección
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>
                <TableSortLabel
                  active={orderBy === 'nombre_grupo'}
                  direction={orderBy === 'nombre_grupo' ? order : 'asc'}
                  onClick={() => handleRequestSort('nombre_grupo')}
                >
                  Grupo
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '13%' }}>
                <TableSortLabel
                  active={orderBy === 'produccion_leche_ayer'}
                  direction={orderBy === 'produccion_leche_ayer' ? order : 'asc'}
                  onClick={() => handleRequestSort('produccion_leche_ayer')}
                >
                  Producción Ayer
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '13%' }}>
                <TableSortLabel
                  active={orderBy === 'produccion_media_7dias'}
                  direction={orderBy === 'produccion_media_7dias' ? order : 'asc'}
                  onClick={() => handleRequestSort('produccion_media_7dias')}
                >
                  Media 7 Días
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '16%' }}>
                <TableSortLabel
                  active={orderBy === 'estado_reproduccion'}
                  direction={orderBy === 'estado_reproduccion' ? order : 'asc'}
                  onClick={() => handleRequestSort('estado_reproduccion')}
                >
                  Estado Reproductivo
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '12%' }}>
                <TableSortLabel
                  active={orderBy === 'dias_ordeno'}
                  direction={orderBy === 'dias_ordeno' ? order : 'asc'}
                  onClick={() => handleRequestSort('dias_ordeno')}
                >
                  Días Ordeño
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>
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
                          '0%': { backgroundPosition: '200% 0' },
                          '100%': { backgroundPosition: '-100% 0' }
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
            {cows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    {loading ? 'Cargando...' : 'No hay vacas disponibles'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cows.map((cow) => (
                <TableRow key={cow.id} hover>
                  <TableCell>{cow.numero_animal}</TableCell>
                  <TableCell>{cow.numero_seleccion ?? '-'}</TableCell>
                  <TableCell>{cow.nombre_grupo}</TableCell>
                  <TableCell>
                    {cow.produccion_leche_ayer != null ? `${Number(cow.produccion_leche_ayer).toFixed(2)} kg` : '-'}
                  </TableCell>
                  <TableCell>
                    {cow.produccion_media_7dias != null ? `${Number(cow.produccion_media_7dias).toFixed(2)} kg` : '-'}
                  </TableCell>
                  <TableCell>{cow.estado_reproduccion}</TableCell>
                  <TableCell>{cow.dias_ordeno ?? '-'}</TableCell>
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
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>
    </Box >
  );
};
