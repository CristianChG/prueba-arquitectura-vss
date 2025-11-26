import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { GlobalHato } from '../../../infrastructure/api/GlobalHatosAPI';

interface SnapshotSelectorProps {
  snapshots: GlobalHato[];
  selectedSnapshotId: number | '';
  onSnapshotChange: (snapshotId: number) => void;
  formatDate: (dateStr: string) => string;
}

export const SnapshotSelector: React.FC<SnapshotSelectorProps> = ({
  snapshots,
  selectedSnapshotId,
  onSnapshotChange,
  formatDate,
}) => {
  return (
    <FormControl sx={{ mb: 3, maxWidth: 300 }} fullWidth>
      <InputLabel>Archivo Global Hato</InputLabel>
      <Select
        value={selectedSnapshotId}
        label="Archivo Global Hato"
        onChange={(e) => onSnapshotChange(e.target.value as number)}
      >
        {snapshots.map((snapshot) => (
          <MenuItem key={snapshot.id} value={snapshot.id}>
            {snapshot.nombre} ({formatDate(snapshot.fecha_snapshot)})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
