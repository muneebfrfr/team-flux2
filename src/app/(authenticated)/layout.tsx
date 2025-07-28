"use client";

import FullScreenLoader from "@/components/common/FullScreenLoader";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import ThemeRegistry from "@/components/ThemeRegistry";
import { authOptions } from "@/lib/auth";
import { Box, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode, useState } from "react";

interface Props {
  children: ReactNode;
}

const SIDEBAR_WIDTH = 240;

const AuthenticatedLayout = ({ children }: Props) => {
  const theme = useTheme();
  const { data: session, status } = useSession();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  if (!session && status !== "loading") {
    redirect("/auth/login");
  }
if(status === "loading") {
    return <FullScreenLoader/>;
  }
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
};

export default AuthenticatedLayout;
