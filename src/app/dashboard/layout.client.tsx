"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useTheme } from "@mui/material/styles"; 
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ThemeRegistry from "@/components/ThemeRegistry"; 

const SIDEBAR_WIDTH = 240;

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme(); 

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <SessionProvider>
      <ThemeRegistry>
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              transition: "margin 0.3s ease",
              ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
              bgcolor: theme.palette.background.default, 
            }}
          >
            <Navbar onToggleSidebar={handleToggleSidebar} />
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <Toolbar />

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                bgcolor: theme.palette.grey[100],
                overflow: "auto",
                transition: "margin 0.3s ease",
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      </ThemeRegistry>
    </SessionProvider>
  );
}
