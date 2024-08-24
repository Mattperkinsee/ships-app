// src/CustomTabs.jsx
import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import ValorUpgradeTable from './ship-upgrades/valor-upgrade-table';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function CustomTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={value} onChange={handleChange} aria-label="custom tabs">
        <Tab label="Valor" id="tab-0" aria-controls="tabpanel-0" />
        <Tab label="Volante" id="tab-1" aria-controls="tabpanel-1" />
        <Tab label="Advance" id="tab-2" aria-controls="tabpanel-2" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <ValorUpgradeTable/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Content for Volante
      </TabPanel>
      <TabPanel value={value} index={2}>
        Content for Advance
      </TabPanel>
    </Box>
  );
}
