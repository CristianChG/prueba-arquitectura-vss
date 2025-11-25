import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  LinearProgress,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { GlobalHatosAPI } from '../../../infrastructure/api/GlobalHatosAPI';

interface UploadGlobalHatoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadGlobalHatoModal: React.FC<UploadGlobalHatoModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [nombre, setNombre] = useState('');
  const [fechaSnapshot, setFechaSnapshot] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<{ message: string; invalid_rows: any[] } | null>(null);

  const handleReset = useCallback(() => {
    setNombre('');
    setFechaSnapshot('');
    setFile(null);
    setError(null);
    setWarnings(null);
    setUploading(false);
  }, []);

  const handleClose = useCallback(() => {
    if (!uploading) {
      handleReset();
      onClose();
    }
  }, [uploading, handleReset, onClose]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      setError(null);
      setWarnings(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    disabled: uploading,
  });

  const handleSubmit = useCallback(async () => {
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }

    if (!fechaSnapshot) {
      setError('La fecha del snapshot es requerida');
      return;
    }

    if (!file) {
      setError('Debes cargar un archivo CSV');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setWarnings(null);

      const response = await GlobalHatosAPI.uploadCSV(nombre, fechaSnapshot, file);

      // Check for warnings (invalid rows)
      if (response.warnings) {
        setWarnings(response.warnings);
      }

      handleReset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al subir el archivo');
    } finally {
      setUploading(false);
    }
  }, [nombre, fechaSnapshot, file, handleReset, onSuccess, onClose]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="upload-dialog-title"
    >
      <DialogTitle id="upload-dialog-title">Subir nuevo archivo</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          {/* Nombre Field */}
          <TextField
            label="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            fullWidth
            required
            disabled={uploading}
            placeholder="Ej: Snapshot Enero 2025"
          />

          {/* Fecha Snapshot Field */}
          <TextField
            label="Fecha del snapshot"
            type="date"
            value={fechaSnapshot}
            onChange={(e) => setFechaSnapshot(e.target.value)}
            fullWidth
            required
            disabled={uploading}
            InputLabelProps={{
              shrink: true,
            }}
          />

          {/* Dropzone */}
          <Box
            {...getRootProps()}
            sx={{
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: uploading ? 'not-allowed' : 'pointer',
              backgroundColor: isDragActive ? 'action.hover' : 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: uploading ? 'divider' : 'primary.main',
                backgroundColor: uploading ? 'transparent' : 'action.hover',
              },
            }}
          >
            <input {...getInputProps()} />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
            <Typography variant="body1" color="text.primary" gutterBottom>
              {isDragActive
                ? 'Suelta el archivo aquí'
                : file
                ? file.name
                : 'Arrastra un archivo CSV o haz clic para seleccionar'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              El archivo debe contener las columnas requeridas
            </Typography>
          </Box>

          {/* File Info */}
          {file && !error && (
            <Alert severity="success">
              Archivo seleccionado: {file.name}
            </Alert>
          )}

          {/* Warning Alert */}
          {warnings && (
            <Alert severity="warning" onClose={() => setWarnings(null)}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                {warnings.message}
              </Typography>
              {warnings.invalid_rows.length > 0 && (
                <Typography variant="caption">
                  Mostrando {Math.min(warnings.invalid_rows.length, 10)} de {warnings.invalid_rows.length} filas con errores
                </Typography>
              )}
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Loading Indicator */}
          {uploading && <LinearProgress />}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading || !file}
        >
          {uploading ? 'Subiendo...' : 'Subir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
