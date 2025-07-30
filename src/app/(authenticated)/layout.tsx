// app/(protected)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import FullScreenLoader from "@/components/common/FullScreenLoader";
import { ReactNode, useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ThemeRegistry from "@/components/ThemeRegistry";
import { Box, Toolbar, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SIDEBAR_WIDTH = 240;

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") return <FullScreenLoader />;
  if (!session) redirect("/auth/login");

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <ThemeRegistry>
      <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            transition: "margin 0.3s ease",
            ml: isMobile ? 0 : sidebarOpen ? `${SIDEBAR_WIDTH}px` : "3%",
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
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeRegistry>
  );
}
