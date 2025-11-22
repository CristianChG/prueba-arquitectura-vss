import { useState } from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate';
import { UsersTable } from '../organisms/UsersTable';
import { UsersTableFilters } from '../molecules/UsersTableFilters';
import { Typography } from '@mui/material';

export const UsersPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | ''>('');

  return (
    <DashboardTemplate currentPage="Roles y Personas">
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          mb: 3,
        }}
      >
        Roles y Personas
      </Typography>
      <UsersTableFilters
        search={search}
        roleFilter={roleFilter}
        onSearchChange={setSearch}
        onRoleFilterChange={setRoleFilter}
      />
      <UsersTable search={search} roleFilter={roleFilter} />
    </DashboardTemplate>
  );
};
