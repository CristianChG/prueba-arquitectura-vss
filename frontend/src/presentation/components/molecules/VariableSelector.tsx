import { FormControl, InputLabel, Select, MenuItem, type SelectChangeEvent } from '@mui/material';
import { AVAILABLE_VARIABLES } from '../../../utils/constants/variables';

interface VariableSelectorProps {
  selectedVariable: string;
  onVariableChange: (variable: string) => void;
}

export const VariableSelector: React.FC<VariableSelectorProps> = ({
  selectedVariable,
  onVariableChange,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onVariableChange(event.target.value);
  };

  return (
    <FormControl sx={{ minWidth: 250 }}>
      <InputLabel id="variable-select-label">Variable</InputLabel>
      <Select
        labelId="variable-select-label"
        id="variable-select"
        value={selectedVariable}
        label="Variable"
        onChange={handleChange}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.dark',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main',
          },
        }}
      >
        {AVAILABLE_VARIABLES.map((variable) => (
          <MenuItem key={variable.value} value={variable.value}>
            {variable.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
