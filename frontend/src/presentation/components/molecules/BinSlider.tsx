import { Box, Slider, Typography } from '@mui/material';

interface BinSliderProps {
  binCount: number;
  onBinCountChange: (count: number) => void;
  visible: boolean;
}

const marks = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 15, label: '15' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 40, label: '40' },
  { value: 50, label: '50' },
];

export const BinSlider: React.FC<BinSliderProps> = ({ binCount, onBinCountChange, visible }) => {
  if (!visible) {
    return null;
  }

  const handleChange = (_event: Event, value: number | number[]) => {
    onBinCountChange(value as number);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
        Número de bins: {binCount}
      </Typography>
      <Slider
        value={binCount}
        onChange={handleChange}
        min={5}
        max={50}
        step={1}
        marks={marks}
        valueLabelDisplay="auto"
        sx={{
          color: 'primary.main',
          '& .MuiSlider-markLabel': {
            fontSize: '0.75rem',
          },
        }}
      />
    </Box>
  );
};
