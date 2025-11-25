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
import Papa from 'papaparse';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { GlobalHatosAPI, type CreateGlobalHatoData } from '../../../infrastructure/api/GlobalHatosAPI';

interface UploadGlobalHatoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CSVRow {
  'Número del animal': string;
  'Nombre del grupo': string;
  'Producción de leche ayer': string;
  'Producción media diaria últimos 7 días': string;
  'Estado de la reproducción': string;
  'Días en ordeño': string;
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
  const [parsedData, setParsedData] = useState<CreateGlobalHatoData['cows'] | null>(null);

  const handleReset = useCallback(() => {
    setNombre('');
    setFechaSnapshot('');
    setFile(null);
    setError(null);
    setParsedData(null);
    setUploading(false);
  }, []);

  const handleClose = useCallback(() => {
    if (!uploading) {
      handleReset();
      onClose();
    }
  }, [uploading, handleReset, onClose]);

  const validateCSV = useCallback((data: CSVRow[]): boolean => {
    const requiredColumns = [
      'Número del animal',
      'Nombre del grupo',
      'Producción de leche ayer',
      'Producción media diaria últimos 7 días',
      'Estado de la reproducción',
      'Días en ordeño',
    ];

    if (data.length === 0) {
      setError('El archivo CSV está vacío');
      return false;
    }

    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));

    if (missingColumns.length > 0) {
      setError(`Faltan las siguientes columnas: ${missingColumns.join(', ')}`);
      return false;
    }

    return true;
  }, []);

  const parseCSV = useCallback((file: File) => {
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setError('Error al parsear el archivo CSV: ' + results.errors[0].message);
          setParsedData(null);
          return;
        }

        if (!validateCSV(results.data)) {
          setParsedData(null);
          return;
        }

        const cowsData = results.data.map(row => ({
          numero_animal: row['Número del animal'],
          nombre_grupo: row['Nombre del grupo'],
          produccion_leche_ayer: parseFloat(row['Producción de leche ayer']) || 0,
          produccion_media_7dias: parseFloat(row['Producción media diaria últimos 7 días']) || 0,
          estado_reproduccion: row['Estado de la reproducción'],
          dias_ordeno: parseInt(row['Días en ordeño']) || 0,
        }));

        setParsedData(cowsData);
        setError(null);
      },
      error: (error) => {
        setError('Error al leer el archivo: ' + error.message);
        setParsedData(null);
      },
    });
  }, [validateCSV]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];
      setFile(uploadedFile);
      parseCSV(uploadedFile);
    }
  }, [parseCSV]);

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

    if (!parsedData || parsedData.length === 0) {
      setError('Debes cargar un archivo CSV válido');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      await GlobalHatosAPI.createGlobalHato({
        nombre,
        fecha_snapshot: fechaSnapshot,
        cows: parsedData,
      });

      handleReset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear el archivo');
    } finally {
      setUploading(false);
    }
  }, [nombre, fechaSnapshot, parsedData, handleReset, onSuccess, onClose]);

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
          {parsedData && (
            <Alert severity="success">
              Archivo cargado correctamente: {parsedData.length} animales detectados
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
          disabled={uploading || !parsedData}
        >
          {uploading ? 'Subiendo...' : 'Subir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
