'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

import { Box, CssBaseline, Toolbar } from '@mui/material';

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <SessionProvider>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Navbar */}
          <Navbar onToggleSidebar={handleToggleSidebar} />

          {/* This adds spacing equal to AppBar height */}
          <Toolbar />

          {/* Main content */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              bgcolor: 'grey.100',
              overflow: 'auto',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </SessionProvider>
  );
}
