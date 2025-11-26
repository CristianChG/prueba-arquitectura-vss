import { useState, useEffect, useMemo } from 'react';
import { Box, Paper, Alert, CircularProgress } from '@mui/material';
import { GlobalHatosAPI, type Cow } from '../../../infrastructure/api/GlobalHatosAPI';
import { VariableSelector } from '../molecules/VariableSelector';
import { BinSlider } from '../molecules/BinSlider';
import { StatisticsCard } from '../molecules/StatisticsCard';
import { HistogramChart } from '../molecules/HistogramChart';
import { CategoricalBarChart } from '../molecules/CategoricalBarChart';
import { calculateHistogram, calculateCategoricalFrequencies } from '../../../utils/distributions';
import { calculateNumericStatistics, calculateCategoricalStatistics } from '../../../utils/statistics';
import { getVariableDefinition, isNumericVariable } from '../../../utils/constants/variables';

interface DistribucionesContentProps {
  selectedSnapshotId: number | '';
}

export const DistribucionesContent: React.FC<DistribucionesContentProps> = ({
  selectedSnapshotId,
}) => {
  // State
  const [selectedVariable, setSelectedVariable] = useState('produccion_leche_ayer');
  const [binCount, setBinCount] = useState(15);
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all cows when snapshot changes
  useEffect(() => {
    if (selectedSnapshotId) {
      loadAllCows(selectedSnapshotId as number);
    } else {
      setCows([]);
    }
  }, [selectedSnapshotId]);

  const loadAllCows = async (snapshotId: number) => {
    try {
      setLoading(true);
      setError(null);

      const data = await GlobalHatosAPI.getAllCowsBySnapshot(snapshotId, {
        limit: 10000, // Large limit to get all cows
      });

      setCows(data.cows);
    } catch (err) {
      console.error('Error loading cows:', err);
      setError('Error al cargar los datos de las vacas');
      setCows([]);
    } finally {
      setLoading(false);
    }
  };

  // Determine variable type
  const variableType = isNumericVariable(selectedVariable) ? 'numeric' : 'categorical';

  // Calculate chart data
  const chartData = useMemo(() => {
    if (cows.length === 0) return null;

    const values = cows
      .map((cow) => cow[selectedVariable as keyof Cow])
      .filter((val) => val != null);

    if (variableType === 'numeric') {
      return calculateHistogram(values as number[], binCount);
    } else {
      return calculateCategoricalFrequencies(values as string[]);
    }
  }, [cows, selectedVariable, binCount, variableType]);

  // Calculate statistics
  const statistics = useMemo(() => {
    if (cows.length === 0) return null;

    const values = cows
      .map((cow) => cow[selectedVariable as keyof Cow])
      .filter((val) => val != null);

    if (variableType === 'numeric') {
      return calculateNumericStatistics(values as number[]);
    } else {
      return calculateCategoricalStatistics(values as string[]);
    }
  }, [cows, selectedVariable, variableType]);

  // Get variable label
  const getVariableLabel = (): string => {
    const varDef = getVariableDefinition(selectedVariable);
    if (varDef) {
      return varDef.unit ? `${varDef.label} (${varDef.unit})` : varDef.label;
    }
    return selectedVariable;
  };

  // Show loading indicator for large datasets
  const showLoadingSpinner = loading && cows.length > 5000;

  return (
    <Box>
      {/* Controls Section */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          mb: 3,
          alignItems: 'flex-end',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        <VariableSelector
          selectedVariable={selectedVariable}
          onVariableChange={setSelectedVariable}
        />
        <BinSlider
          binCount={binCount}
          onBinCountChange={setBinCount}
          visible={variableType === 'numeric'}
        />
      </Box>

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty Snapshot State */}
      {!selectedSnapshotId && (
        <Alert severity="info">Selecciona un snapshot para ver distribuciones</Alert>
      )}

      {/* Loading State for Large Datasets */}
      {showLoadingSpinner && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Loading State with Opacity */}
      <Box sx={{ opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s ease-in-out' }}>
        {/* Chart Section */}
        {!loading && selectedSnapshotId && chartData && (
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'transparent' }}>
            {variableType === 'numeric' ? (
              <HistogramChart data={chartData as any} variableLabel={getVariableLabel()} />
            ) : (
              <CategoricalBarChart data={chartData as any} variableLabel={getVariableLabel()} />
            )}
          </Paper>
        )}

        {/* Empty Dataset State */}
        {!loading && selectedSnapshotId && cows.length === 0 && !error && (
          <Alert severity="warning">No hay datos disponibles para este snapshot</Alert>
        )}

        {/* Statistics Section */}
        {!loading && selectedSnapshotId && statistics && (
          <StatisticsCard statistics={statistics} variableType={variableType} />
        )}
      </Box>
    </Box>
  );
};
