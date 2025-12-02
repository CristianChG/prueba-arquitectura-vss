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
import type { CategoryFrequency } from '../../../utils/distributions';

interface CategoricalBarChartProps {
  data: CategoryFrequency[];
  variableLabel: string;
}

export const CategoricalBarChart: React.FC<CategoricalBarChartProps> = ({
  data,
  variableLabel,
}) => {
  if (data.length === 0) {
    return <Alert severity="info">No hay datos para mostrar</Alert>;
  }

  // Calculate dynamic height based on number of categories
  const chartHeight = Math.max(400, data.length * 40);

  return (
    <Box>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            label={{
              value: 'Frecuencia',
              position: 'insideBottom',
              offset: -10,
              style: { fontWeight: 600 },
            }}
          />
          <YAxis
            dataKey="category"
            type="category"
            width={140}
            tick={{ fontSize: 12 }}
            label={{
              value: variableLabel,
              angle: -90,
              position: 'insideLeft',
              style: { fontWeight: 600 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#A36627" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CategoryFrequency;
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
        <Box sx={{ fontWeight: 600, mb: 0.5 }}>Categoría: {data.category}</Box>
        <Box>Frecuencia: {data.count} vacas</Box>
        <Box>Porcentaje: {data.percentage.toFixed(1)}%</Box>
      </Box>
    );
  }

  return null;
};
