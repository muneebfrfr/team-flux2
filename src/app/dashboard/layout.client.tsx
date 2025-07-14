"use client";

import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

const SIDEBAR_WIDTH = 240;

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
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            transition: "margin 0.3s ease",
            ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
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
              bgcolor: "grey.100",
              overflow: "auto",
              transition: "margin 0.3s ease",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </SessionProvider>
  );
}
