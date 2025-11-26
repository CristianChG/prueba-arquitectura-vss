import { Box, Paper, Typography } from '@mui/material';
import type { NumericStatistics, CategoricalStatistics } from '../../../utils/statistics';

interface StatisticsCardProps {
  statistics: NumericStatistics | CategoricalStatistics | null;
  variableType: 'numeric' | 'categorical';
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ statistics, variableType }) => {
  if (!statistics) {
    return null;
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: 'transparent',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5, color: 'text.secondary' }}>
        Estadísticas
      </Typography>

      {variableType === 'numeric' ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(5, 1fr)',
            },
            gap: 2,
          }}
        >
          <StatItem label="n" value={(statistics as NumericStatistics).n.toString()} />
          <StatItem label="μ" value={(statistics as NumericStatistics).mean.toFixed(2)} />
          <StatItem label="σ" value={(statistics as NumericStatistics).stdDev.toFixed(2)} />
          <StatItem label="Min" value={(statistics as NumericStatistics).min.toFixed(2)} />
          <StatItem label="Max" value={(statistics as NumericStatistics).max.toFixed(2)} />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          <StatItem label="n" value={(statistics as CategoricalStatistics).n.toString()} />
          <StatItem
            label="Categorías"
            value={(statistics as CategoricalStatistics).numCategories.toString()}
          />
          <StatItem
            label="Moda"
            value={`${(statistics as CategoricalStatistics).mode} (${(statistics as CategoricalStatistics).modeCount})`}
          />
        </Box>
      )}
    </Paper>
  );
};

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
        {value}
      </Typography>
    </Box>
  );
};
