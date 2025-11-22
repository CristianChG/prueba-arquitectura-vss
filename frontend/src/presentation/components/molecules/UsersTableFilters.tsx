import React from 'react';
import {
  Box,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
} from '@mui/material';
import { ROLES } from '@constants/roles';

interface UsersTableFiltersProps {
  search: string;
  roleFilter: number | '';
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: number | '') => void;
}

export const UsersTableFilters: React.FC<UsersTableFiltersProps> = React.memo(
  ({ search, roleFilter, onSearchChange, onRoleFilterChange }) => {
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Buscar por nombre o email"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por rol</InputLabel>
          <Select
            value={roleFilter}
            label="Filtrar por rol"
            onChange={(e) => onRoleFilterChange(e.target.value as number | '')}
          >
            <SelectMenuItem value="">Todos</SelectMenuItem>
            <SelectMenuItem value={ROLES.ADMIN}>Administrador</SelectMenuItem>
            <SelectMenuItem value={ROLES.COLAB}>Colaborador</SelectMenuItem>
            <SelectMenuItem value={ROLES.PENDING_APPROVAL}>Pendiente de Aprobación</SelectMenuItem>
          </Select>
        </FormControl>
      </Box>
    );
  }
);

UsersTableFilters.displayName = 'UsersTableFilters';
