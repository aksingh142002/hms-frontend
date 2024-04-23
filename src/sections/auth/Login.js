import { useState } from 'react';
// @mui
import { Stack, Typography, Divider, Box, Tab, Tabs } from '@mui/material';
// layouts
import LoginLayout from '../../layouts/login';
//
import AuthLoginForm from './AuthLoginForm';
import AuthLoginFormStudent from './AuthLoginFormStudent';

// ----------------------------------------------------------------------

export default function Login() {
  const TABS = [
    { value: 'Staff', label: 'Staff', color: 'success' },
    { value: 'Student', label: 'Student', color: 'warning' },
  ];
  const [filterStatus, setFilterStatus] = useState('Staff');

  const handleFilterStatus = (event, newValue) => {
    // setPage(0);
    setFilterStatus(newValue);
    // const updatedQuery = { ...query, page: 1, tabFilter: newValue };
    // setQuery(updatedQuery);
  };
  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 3, position: 'relative' }}>
        <Typography variant="h4">Sign in to OPJU Hostel</Typography>
      </Stack>
      <Box sx={{ mb: 4, alignContent: 'center' }}>
        <Tabs
          value={filterStatus}
          onChange={handleFilterStatus}
          sx={{
            px: 2,
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>

        {/* <Divider /> */}
      </Box>
      {filterStatus === 'Staff' ? <AuthLoginForm /> : <AuthLoginFormStudent />}
    </LoginLayout>
  );
}
