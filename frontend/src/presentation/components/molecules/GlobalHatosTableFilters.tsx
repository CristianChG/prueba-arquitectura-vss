import React from 'react';
import {
  Box,
  TextField,
} from '@mui/material';

interface GlobalHatosTableFiltersProps {
  search: string;
  fechaDesde: string;
  fechaHasta: string;
  onSearchChange: (value: string) => void;
  onFechaDesdeChange: (value: string) => void;
  onFechaHastaChange: (value: string) => void;
}

export const GlobalHatosTableFilters: React.FC<GlobalHatosTableFiltersProps> = React.memo(
  ({ search, fechaDesde, fechaHasta, onSearchChange, onFechaDesdeChange, onFechaHastaChange }) => {
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nombre"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Fecha desde"
          type="date"
          variant="outlined"
          size="small"
          value={fechaDesde}
          onChange={(e) => onFechaDesdeChange(e.target.value)}
          inputProps={{
            max: fechaHasta || undefined,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 180 }}
        />
        <TextField
          label="Fecha hasta"
          type="date"
          variant="outlined"
          size="small"
          value={fechaHasta}
          onChange={(e) => onFechaHastaChange(e.target.value)}
          inputProps={{
            min: fechaDesde || undefined,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ minWidth: 180 }}
        />
      </Box>
    );
  }
);

GlobalHatosTableFilters.displayName = 'GlobalHatosTableFilters';
