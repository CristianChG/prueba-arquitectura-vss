import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
  TablePagination,
  TableSortLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { GlobalHatosAPI, type GlobalHato, type Pagination } from '../../../infrastructure/api/GlobalHatosAPI';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface GlobalHatosTableProps {
  search: string;
  fechaDesde: string;
  fechaHasta: string;
  onDataChange?: () => void;
}

export const GlobalHatosTable: React.FC<GlobalHatosTableProps> = ({
  search,
  fechaDesde,
  fechaHasta,
  onDataChange
}) => {
  const [globalHatos, setGlobalHatos] = useState<GlobalHato[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [orderBy, setOrderBy] = useState<string>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    globalHato: GlobalHato | null;
  }>({
    open: false,
    globalHato: null,
  });

  const loadGlobalHatos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await GlobalHatosAPI.getAllGlobalHatos({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: orderBy,
        sortOrder: order,
        search: search || undefined,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
      });
      setGlobalHatos(data.global_hatos);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error loading global hatos:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, orderBy, order, search, fechaDesde, fechaHasta]);

  useEffect(() => {
    loadGlobalHatos();
  }, [loadGlobalHatos]);

  // Reset pagination to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [search, fechaDesde, fechaHasta]);

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

  const handleDeleteClick = useCallback((globalHato: GlobalHato) => {
    setDeleteDialog({
      open: true,
      globalHato,
    });
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialog({
      open: false,
      globalHato: null,
    });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    const toDelete = deleteDialog.globalHato;
    if (!toDelete) return;

    try {
      await GlobalHatosAPI.deleteGlobalHato(toDelete.id);
      handleDeleteCancel();
      await loadGlobalHatos();
      onDataChange?.();
    } catch (error) {
      console.error('Error deleting global hato:', error);
    }
  }, [deleteDialog.globalHato, loadGlobalHatos, handleDeleteCancel, onDataChange]);

  const handleDownload = useCallback(async (globalHato: GlobalHato) => {
    if (!globalHato.blob_route) return;

    try {
      const blob = await GlobalHatosAPI.downloadCSV(globalHato.id);

      // Create blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from blob_route or use a default
      const filename = globalHato.blob_route.split('/').pop() || `${globalHato.nombre}.csv`;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy', { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm", { locale: es });
    } catch {
      return dateString;
    }
  };

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
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>
                <TableSortLabel
                  active={orderBy === 'nombre'}
                  direction={orderBy === 'nombre' ? order : 'asc'}
                  onClick={() => handleRequestSort('nombre')}
                >
                  Nombre
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>
                <TableSortLabel
                  active={orderBy === 'fecha_snapshot'}
                  direction={orderBy === 'fecha_snapshot' ? order : 'asc'}
                  onClick={() => handleRequestSort('fecha_snapshot')}
                >
                  Fecha snapshot
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>
                Total animales
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '15%' }}>
                Grupos detectados
              </TableCell>
              <TableCell sx={{ fontWeight: 600, width: '20%' }}>
                <TableSortLabel
                  active={orderBy === 'created_at'}
                  direction={orderBy === 'created_at' ? order : 'asc'}
                  onClick={() => handleRequestSort('created_at')}
                >
                  Fecha carga
                </TableSortLabel>
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, width: '15%' }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {globalHatos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No hay archivos disponibles
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              globalHatos.map((globalHato) => (
                <TableRow key={globalHato.id} hover>
                  <TableCell>{globalHato.nombre}</TableCell>
                  <TableCell>{formatDate(globalHato.fecha_snapshot)}</TableCell>
                  <TableCell>{globalHato.total_animales}</TableCell>
                  <TableCell>{globalHato.grupos_detectados} grupos</TableCell>
                  <TableCell>{formatDateTime(globalHato.created_at)}</TableCell>
                  <TableCell align="right">
                    {globalHato.blob_route && (
                      <IconButton
                        onClick={() => handleDownload(globalHato)}
                        size="small"
                        color="primary"
                        title="Descargar CSV"
                      >
                        <DownloadIcon />
                      </IconButton>
                    )}
                    <IconButton
                      onClick={() => handleDeleteClick(globalHato)}
                      size="small"
                      color="error"
                      title="Eliminar"
                    >
                      <DeleteIcon />
                    </IconButton>
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
          }
        />
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el archivo "{deleteDialog.globalHato?.nombre}"?
            Esta acción no se puede deshacer y eliminará todos los datos de animales asociados.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancelar</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
