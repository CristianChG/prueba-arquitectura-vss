import { useState, useEffect } from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate';
import { TabsContainer, type TabItem } from '../organisms/TabsContainer';
import { TableroContent } from '../organisms/TableroContent';
import { GlobalHatoContent } from '../organisms/GlobalHatoContent';
import { DistribucionesContent } from '../organisms/DistribucionesContent';
import { SnapshotSelector } from '../molecules/SnapshotSelector';
import { Typography, Box, Alert, Skeleton } from '@mui/material';
import { GlobalHatosAPI, type GlobalHato } from '../../../infrastructure/api/GlobalHatosAPI';

export const DashboardPage = () => {
  const [snapshots, setSnapshots] = useState<GlobalHato[]>([]);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<number | ''>('');
  const [loadingSnapshots, setLoadingSnapshots] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSnapshots();
  }, []);

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const tabs: TabItem[] = [
    {
      label: 'TABLERO',
      content: <TableroContent selectedSnapshotId={selectedSnapshotId} />,
    },
    {
      label: 'GLOBAL HATO',
      content: <GlobalHatoContent selectedSnapshotId={selectedSnapshotId} />,
    },
    {
      label: 'DISTRIBUCIONES',
      content: <DistribucionesContent selectedSnapshotId={selectedSnapshotId} />,
    },
  ];

  return (
    <DashboardTemplate currentPage="Dashboard">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Dashboard
        </Typography>

        {loadingSnapshots ? (
          <Skeleton variant="rectangular" height={40} sx={{ minWidth: 300, width: 300 }} />
        ) : snapshots.length > 0 ? (
          <SnapshotSelector
            snapshots={snapshots}
            selectedSnapshotId={selectedSnapshotId}
            onSnapshotChange={setSelectedSnapshotId}
            formatDate={formatDate}
          />
        ) : null}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loadingSnapshots && snapshots.length === 0 ? (
        <Alert severity="info">
          No hay archivos disponibles. Sube uno en la página de Archivos.
        </Alert>
      ) : (
        <TabsContainer tabs={tabs} />
      )}
    </DashboardTemplate>
  );
};
