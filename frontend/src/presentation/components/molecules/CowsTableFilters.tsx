import React from 'react';
import {
  Box,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
} from '@mui/material';

interface CowsTableFiltersProps {
  search: string;
  grupoFilter: string;
  availableGroups: string[];
  onSearchChange: (value: string) => void;
  onGrupoFilterChange: (value: string) => void;
}

export const CowsTableFilters: React.FC<CowsTableFiltersProps> = React.memo(
  ({ search, grupoFilter, availableGroups, onSearchChange, onGrupoFilterChange }) => {
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por número, grupo o estado"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por grupo</InputLabel>
          <Select
            value={grupoFilter}
            label="Filtrar por grupo"
            onChange={(e) => onGrupoFilterChange(e.target.value)}
          >
            <SelectMenuItem value="">Todos</SelectMenuItem>
            {availableGroups.map((group) => (
              <SelectMenuItem key={group} value={group}>
                {group}
              </SelectMenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }
);

CowsTableFilters.displayName = 'CowsTableFilters';
