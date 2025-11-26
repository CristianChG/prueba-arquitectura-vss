import { useState, useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Alert,
  Skeleton,
  Paper,
  Tooltip,
  Drawer,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { GlobalHatosAPI } from '../../../infrastructure/api/GlobalHatosAPI';
import type { GlobalHato, Corral } from '../../../infrastructure/api/GlobalHatosAPI';

export const TableroContent = () => {
  // State
  const [snapshots, setSnapshots] = useState<GlobalHato[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<number | ''>('');
  const [corrales, setCorrales] = useState<Corral[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSnapshots, setLoadingSnapshots] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCorral, setSelectedCorral] = useState<Corral | null>(null);

  // Load snapshots on mount
  useEffect(() => {
    loadSnapshots();
  }, []);

  // Load corrales when snapshot changes
  useEffect(() => {
    if (selectedSnapshotId) {
      loadCorrales(selectedSnapshotId as number);
    } else {
      setCorrales([]);
    }
  }, [selectedSnapshotId]);

  const loadSnapshots = async () => {
    try {
      setLoadingSnapshots(true);
      const data = await GlobalHatosAPI.getAllGlobalHatos({ limit: 100 });
      setSnapshots(data.global_hatos);

      // Auto-select first snapshot if available
      if (data.global_hatos.length > 0) {
        setSelectedSnapshotId(data.global_hatos[0].id);
      }
    } catch (err) {
      console.error('Error loading snapshots:', err);
      setError('Error al cargar archivos');
    } finally {
      setLoadingSnapshots(false);
    }
  };

  const loadCorrales = async (snapshotId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await GlobalHatosAPI.getCorralesBySnapshot(snapshotId);
      setCorrales(data);
    } catch (err) {
      console.error('Error loading corrales:', err);
      setError('Error al cargar datos del rancho');
    } finally {
      setLoading(false);
    }
  };

  const handleCorralClick = (corral: Corral) => {
    setSelectedCorral(corral);
    setDrawerOpen(true);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Loading state for snapshots
  if (loadingSnapshots) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={56} sx={{ mb: 3, maxWidth: 300 }} />
        <Skeleton variant="rectangular" height={200} />
      </Box>
    );
  }

  // No snapshots available
  if (snapshots.length === 0) {
    return (
      <Alert severity="info">
        No hay archivos disponibles. Sube uno en la página de Archivos.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Snapshot Selector */}
      <FormControl sx={{ mb: 3, maxWidth: 300 }} fullWidth>
        <InputLabel>Archivo Global Hato</InputLabel>
        <Select
          value={selectedSnapshotId}
          label="Archivo Global Hato"
          onChange={(e) => setSelectedSnapshotId(e.target.value as number)}
        >
          {snapshots.map((snapshot) => (
            <MenuItem key={snapshot.id} value={snapshot.id}>
              {snapshot.nombre} ({formatDate(snapshot.fecha_snapshot)})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 2,
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rectangular" height={150} />
          ))}
        </Box>
      )}

      {/* No Data in Snapshot */}
      {!loading && corrales.length === 0 && selectedSnapshotId && (
        <Alert severity="warning">
          Este archivo no tiene datos de grupos procesables.
        </Alert>
      )}

      {/* Corrales Grid */}
      {!loading && corrales.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fit, minmax(180px, 1fr))',
              md: 'repeat(auto-fit, minmax(200px, 1fr))',
            },
            gap: 2,
          }}
        >
          {corrales.map((corral) => (
            <Tooltip
              key={corral.nombre_grupo}
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
                onClick={() => handleCorralClick(corral)}
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
          ))}
        </Box>
      )}

      {/* Detail Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: '90vw', sm: '60vw', md: '50vw', lg: '40vw' } }}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ p: 2 }}
          >
            <Typography variant="h5">{selectedCorral?.nombre_grupo}</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Divider />

          {/* Body */}
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Total de animales:</strong> {selectedCorral?.total_animales}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Producción promedio:</strong> {selectedCorral?.produccion_promedio.toFixed(2)} L/día
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Producción total:</strong> {selectedCorral?.produccion_total.toFixed(2)} L/día
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Promedio 7 días:</strong> {selectedCorral?.produccion_promedio_7dias.toFixed(2)} L/día
            </Typography>

            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mt: 3 }}>
              <Typography variant="caption" color="text.secondary">
                Más detalles próximamente...
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};
