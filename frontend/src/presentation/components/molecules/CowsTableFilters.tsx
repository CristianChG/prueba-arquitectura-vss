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
  recomendacionFilter: string;
  availableGroups: string[];
  onSearchChange: (value: string) => void;
  onGrupoFilterChange: (value: string) => void;
  onRecomendacionFilterChange: (value: string) => void;
}

export const CowsTableFilters: React.FC<CowsTableFiltersProps> = React.memo(
  ({ search, grupoFilter, recomendacionFilter, availableGroups, onSearchChange, onGrupoFilterChange, onRecomendacionFilterChange }) => {
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
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <InputLabel>Filtrar por recomendación</InputLabel>
          <Select
            value={recomendacionFilter}
            label="Filtrar por recomendación"
            onChange={(e) => onRecomendacionFilterChange(e.target.value)}
          >
            <SelectMenuItem value="">Todas</SelectMenuItem>
            <SelectMenuItem value="0">Producción</SelectMenuItem>
            <SelectMenuItem value="1">Monitorear</SelectMenuItem>
            <SelectMenuItem value="2">Secar</SelectMenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }
);

CowsTableFilters.displayName = 'CowsTableFilters';
