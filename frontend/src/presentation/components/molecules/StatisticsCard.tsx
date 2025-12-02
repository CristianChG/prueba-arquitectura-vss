import { Box, Paper, Typography, type SxProps, type Theme } from '@mui/material';
import type { NumericStatistics, CategoricalStatistics } from '../../../utils/statistics';

interface StatisticsCardProps {
  statistics: NumericStatistics | CategoricalStatistics | null;
  variableType: 'numeric' | 'categorical';
  orientation?: 'horizontal' | 'vertical';
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  statistics,
  variableType,
  orientation = 'horizontal',
}) => {
  if (!statistics) {
    return null;
  }

  const isVertical = orientation === 'vertical';

  const containerStyles: SxProps<Theme> = isVertical
    ? {
      display: 'flex',
      flexDirection: 'column',
    }
    : {
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: 'repeat(2, 1fr)',
        sm: 'repeat(3, 1fr)',
        md: 'repeat(5, 1fr)',
      },
    };

  const itemVariant = isVertical ? 'row' : 'default';

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
        <Box sx={containerStyles}>
          <StatItem
            label="n"
            value={(statistics as NumericStatistics).n.toString()}
            variant={itemVariant}
          />
          <StatItem
            label="μ"
            value={(statistics as NumericStatistics).mean.toFixed(2)}
            variant={itemVariant}
          />
          <StatItem
            label="σ"
            value={(statistics as NumericStatistics).stdDev.toFixed(2)}
            variant={itemVariant}
          />
          <StatItem
            label="Min"
            value={(statistics as NumericStatistics).min.toFixed(2)}
            variant={itemVariant}
          />
          <StatItem
            label="Max"
            value={(statistics as NumericStatistics).max.toFixed(2)}
            variant={itemVariant}
            lastItem={isVertical}
          />
        </Box>
      ) : (
        <Box sx={containerStyles}>
          <StatItem
            label="n"
            value={(statistics as CategoricalStatistics).n.toString()}
            variant={itemVariant}
          />
          <StatItem
            label="Categorías"
            value={(statistics as CategoricalStatistics).numCategories.toString()}
            variant={itemVariant}
          />
          <StatItem
            label="Moda"
            value={`${(statistics as CategoricalStatistics).mode} (${(statistics as CategoricalStatistics).modeCount})`}
            variant={itemVariant}
            lastItem={isVertical}
          />
        </Box>
      )}
    </Paper>
  );
};

interface StatItemProps {
  label: string;
  value: string;
  variant?: 'default' | 'row';
  lastItem?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  variant = 'default',
  lastItem = false,
}) => {
  if (variant === 'row') {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1,
          borderBottom: lastItem ? 'none' : '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary' }}>
          {value}
        </Typography>
      </Box>
    );
  }

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
