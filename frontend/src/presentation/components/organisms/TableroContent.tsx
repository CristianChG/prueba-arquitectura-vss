import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { GlobalHatosAPI } from '../../../infrastructure/api/GlobalHatosAPI';
import type { Corral, Cow } from '../../../infrastructure/api/GlobalHatosAPI';
import { CorralesGrid } from './CorralesGrid';
import { CorralDetailsDrawer } from './CorralDetailsDrawer';

interface TableroContentProps {
  selectedSnapshotId: number | '';
}

export const TableroContent: React.FC<TableroContentProps> = ({ selectedSnapshotId }) => {
  // State
  const [corrales, setCorrales] = useState<Corral[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCorral, setSelectedCorral] = useState<Corral | null>(null);
  const [cows, setCows] = useState<Cow[]>([]);
  const [loadingCows, setLoadingCows] = useState(false);

  // Load corrales when snapshot changes
  useEffect(() => {
    if (selectedSnapshotId) {
      loadCorrales(selectedSnapshotId as number);
    } else {
      setCorrales([]);
    }
  }, [selectedSnapshotId]);

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

  return (
    <Box>
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
