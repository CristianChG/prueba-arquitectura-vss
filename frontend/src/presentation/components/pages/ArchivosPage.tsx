import { useState, useCallback } from 'react';
import { DashboardTemplate } from '../templates/DashboardTemplate';
import { GlobalHatosTable } from '../organisms/GlobalHatosTable';
import { GlobalHatosTableFilters } from '../molecules/GlobalHatosTableFilters';
import { UploadGlobalHatoModal } from '../organisms/UploadGlobalHatoModal';
import { Typography, Button, Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

export const ArchivosPage = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const [search, setSearch] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleOpenUploadModal = useCallback(() => {
    setUploadModalOpen(true);
  }, []);

  const handleCloseUploadModal = useCallback(() => {
    setUploadModalOpen(false);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    setTableKey((prev) => prev + 1);
  }, []);

  return (
    <DashboardTemplate currentPage="Archivos">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 500,
            color: 'text.primary',
          }}
        >
          Archivos
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadFileIcon />}
          onClick={handleOpenUploadModal}
          sx={{
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Subir archivo
        </Button>
      </Box>

      <GlobalHatosTableFilters
        search={search}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onSearchChange={setSearch}
        onFechaDesdeChange={setFechaDesde}
        onFechaHastaChange={setFechaHasta}
      />

      <GlobalHatosTable
        key={tableKey}
        search={search}
        fechaDesde={fechaDesde}
        fechaHasta={fechaHasta}
        onDataChange={handleUploadSuccess}
      />

      <UploadGlobalHatoModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onSuccess={handleUploadSuccess}
      />
    </DashboardTemplate>
  );
};
