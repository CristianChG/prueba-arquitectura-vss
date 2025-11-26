import { Box, Alert, Skeleton } from '@mui/material';
import type { Corral } from '../../../infrastructure/api/GlobalHatosAPI';
import { CorralCard } from '../molecules/CorralCard';

interface CorralesGridProps {
  corrales: Corral[];
  loading: boolean;
  error: string | null;
  selectedSnapshotId: number | '';
  onCorralClick: (corral: Corral) => void;
}

export const CorralesGrid: React.FC<CorralesGridProps> = ({
  corrales,
  loading,
  error,
  selectedSnapshotId,
  onCorralClick,
}) => {
  // Error Alert
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Loading State
  if (loading) {
    return (
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
    );
  }

  // No Data in Snapshot
  if (corrales.length === 0 && selectedSnapshotId) {
    return (
      <Alert severity="warning">
        Este archivo no tiene datos de grupos procesables.
      </Alert>
    );
  }

  // Corrales Grid
  if (corrales.length > 0) {
    return (
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
          <CorralCard
            key={corral.nombre_grupo}
            corral={corral}
            onClick={onCorralClick}
          />
        ))}
      </Box>
    );
  }

  return null;
};
