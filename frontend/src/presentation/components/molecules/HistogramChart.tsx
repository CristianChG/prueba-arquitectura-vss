import { Alert, Box } from '@mui/material';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HistogramBin } from '../../../utils/distributions';
import type { NumericStatistics } from '../../../utils/statistics';

interface HistogramChartProps {
  data: HistogramBin[];
  variableLabel: string;
  statistics?: NumericStatistics | null;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({
  data,
  variableLabel,
  statistics,
}) => {
  if (data.length === 0) {
    return (
      <Alert severity="info">No hay datos suficientes para generar el histograma</Alert>
    );
  }

  // Calculate normal distribution curve if statistics are available
  const chartData = data.map((bin) => {
    if (!statistics || statistics.stdDev === 0) return bin;

    const midpoint = (bin.rangeStart + bin.rangeEnd) / 2;
    const binWidth = bin.rangeEnd - bin.rangeStart;
    const { mean, stdDev, n } = statistics;

    // Normal Distribution PDF formula
    const pdf =
      (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
      Math.exp(-0.5 * Math.pow((midpoint - mean) / stdDev, 2));

    // Expected count for this bin
    const normalCount = pdf * n * binWidth;

    return {
      ...bin,
      normal: normalCount,
    };
  });

  return (
    <Box>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="range"
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fontSize: 12 }}
            label={{
              value: variableLabel,
              position: 'insideBottom',
              offset: -50,
              style: { fontWeight: 600 },
            }}
          />
          <YAxis
            label={{
              value: 'Frecuencia',
              angle: -90,
              position: 'insideLeft',
              style: { fontWeight: 600 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Frecuencia" fill="#71873F" />
          {statistics && statistics.stdDev > 0 && (
            <Line
              type="monotone"
              dataKey="normal"
              name="Distribución Normal"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1.5,
          boxShadow: 2,
        }}
      >
        <Box sx={{ fontWeight: 600, mb: 0.5 }}>Rango: {data.range}</Box>
        <Box>Frecuencia: {data.count} vacas</Box>
        <Box>Porcentaje: {data.percentage.toFixed(1)}%</Box>
        {data.normal !== undefined && (
          <Box sx={{ color: '#ff7300', fontSize: '0.875rem', mt: 0.5 }}>
            Normal (esperado): {data.normal.toFixed(1)}
          </Box>
        )}
      </Box>
    );
  }

  return null;
};
