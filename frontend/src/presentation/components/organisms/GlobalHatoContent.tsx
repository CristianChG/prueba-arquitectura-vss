import { useState, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { GlobalHatosAPI } from '../../../infrastructure/api/GlobalHatosAPI';
import type { Cow } from '../../../infrastructure/api/GlobalHatosAPI';
import { CowsTableFilters } from '../molecules/CowsTableFilters';
import { CowsTable } from './CowsTable';

interface GlobalHatoContentProps {
  selectedSnapshotId: number | '';
}

export const GlobalHatoContent: React.FC<GlobalHatoContentProps> = ({ selectedSnapshotId }) => {
  // State
  const [search, setSearch] = useState('');
  const [grupoFilter, setGrupoFilter] = useState('');
  const [recomendacionFilter, setRecomendacionFilter] = useState('');
  const [allCows, setAllCows] = useState<Cow[]>([]);

  // Load all cows for the selected snapshot (to get unique groups)
  useEffect(() => {
    if (selectedSnapshotId) {
      loadAllCowsForGroups(selectedSnapshotId as number);
    } else {
      setAllCows([]);
    }
  }, [selectedSnapshotId]);

  const loadAllCowsForGroups = async (snapshotId: number) => {
    try {
      // Fetch with a large limit to get all cows for group extraction
      const data = await GlobalHatosAPI.getAllCowsBySnapshot(snapshotId, {
        limit: 10000, // Large limit to get all cows
      });
      setAllCows(data.cows);
    } catch (err) {
      console.error('Error loading cows for groups:', err);
      setAllCows([]);
    }
  };

  // Extract unique groups from all cows
  const availableGroups = useMemo(() => {
    const groups = new Set<string>();
    allCows.forEach((cow) => {
      if (cow.nombre_grupo) {
        groups.add(cow.nombre_grupo);
      }
    });
    return Array.from(groups).sort();
  }, [allCows]);

  return (
    <Box>
      {/* Filters */}
      <CowsTableFilters
        search={search}
        grupoFilter={grupoFilter}
        recomendacionFilter={recomendacionFilter}
        availableGroups={availableGroups}
        onSearchChange={setSearch}
        onGrupoFilterChange={setGrupoFilter}
        onRecomendacionFilterChange={setRecomendacionFilter}
      />

      {/* Cows Table */}
      <CowsTable
        snapshotId={selectedSnapshotId}
        search={search}
        grupoFilter={grupoFilter}
        recomendacionFilter={recomendacionFilter}
      />
    </Box>
  );
};
