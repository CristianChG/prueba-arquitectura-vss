import { DashboardTemplate } from '../templates/DashboardTemplate';
import { TabsContainer, type TabItem } from '../organisms/TabsContainer';
import { TableroContent } from '../organisms/TableroContent';
import { ModeloPrediccionesContent } from '../organisms/ModeloPrediccionesContent';
import { Typography } from '@mui/material';

export const DashboardPage = () => {
  const tabs: TabItem[] = [
    {
      label: 'TABLERO',
      content: <TableroContent />,
    },
    {
      label: 'MODELO Y PREDICCIONES',
      content: <ModeloPrediccionesContent />,
    },
  ];

  return (
    <DashboardTemplate currentPage="Dashboard">
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          mb: 3,
        }}
      >
        Dashboard
      </Typography>
      <TabsContainer tabs={tabs} />
    </DashboardTemplate>
  );
};
