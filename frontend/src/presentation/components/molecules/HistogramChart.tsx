import { Alert, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { HistogramBin } from '../../../utils/distributions';

interface HistogramChartProps {
  data: HistogramBin[];
  variableLabel: string;
}

export const HistogramChart: React.FC<HistogramChartProps> = ({ data, variableLabel }) => {
  if (data.length === 0) {
    return (
      <Alert severity="info">No hay datos suficientes para generar el histograma</Alert>
    );
  }

  return (
    <Box>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
          <Bar dataKey="count" fill="#71873F" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as HistogramBin;
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
      </Box>
    );
  }

  return null;
};
