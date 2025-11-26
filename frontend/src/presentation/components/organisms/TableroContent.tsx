import { useState, useEffect } from 'react';
import { Box, Alert, Skeleton } from '@mui/material';
import { GlobalHatosAPI } from '../../../infrastructure/api/GlobalHatosAPI';
import type { GlobalHato, Corral, Cow } from '../../../infrastructure/api/GlobalHatosAPI';
import { SnapshotSelector } from '../molecules/SnapshotSelector';
import { CorralesGrid } from './CorralesGrid';
import { CorralDetailsDrawer } from './CorralDetailsDrawer';

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
  const [cows, setCows] = useState<Cow[]>([]);
  const [loadingCows, setLoadingCows] = useState(false);

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

  const handleCorralClick = async (corral: Corral) => {
    setSelectedCorral(corral);
    setDrawerOpen(true);

    // Load cows for this group
    if (selectedSnapshotId) {
      try {
        setLoadingCows(true);
        const cowsData = await GlobalHatosAPI.getCowsByGroup(
          selectedSnapshotId as number,
          corral.nombre_grupo
        );
        setCows(cowsData);
      } catch (err) {
        console.error('Error loading cows:', err);
        setCows([]);
      } finally {
        setLoadingCows(false);
      }
    }
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
      <SnapshotSelector
        snapshots={snapshots}
        selectedSnapshotId={selectedSnapshotId}
        onSnapshotChange={setSelectedSnapshotId}
        formatDate={formatDate}
      />

      {/* Corrales Grid */}
      <CorralesGrid
        corrales={corrales}
        loading={loading}
        error={error}
        selectedSnapshotId={selectedSnapshotId}
        onCorralClick={handleCorralClick}
      />

      {/* Detail Drawer */}
      <CorralDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        corral={selectedCorral}
        cows={cows}
        loadingCows={loadingCows}
      />
    </Box>
  );
};
