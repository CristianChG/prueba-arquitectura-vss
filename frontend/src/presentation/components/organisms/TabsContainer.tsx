import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';

export interface TabItem {
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsContainerProps {
  tabs: TabItem[];
  defaultTab?: number;
}

export const TabsContainer: React.FC<TabsContainerProps> = ({
  tabs,
  defaultTab = 0,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              minHeight: 48,
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon ? <Box component="span" sx={{ mr: 1 }}>{tab.icon}</Box> : undefined}
              iconPosition="start"
              label={tab.label}
            />
          ))}
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ py: 2 }}>
        {tabs.map((tab, index) => (
          <Box key={index} sx={{ display: activeTab === index ? 'block' : 'none' }}>
            {tab.content}
          </Box>
        ))}
      </Box>
    </>
  );
};
