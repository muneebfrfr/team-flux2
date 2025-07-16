"use client";

import { Box, CircularProgress } from "@mui/material";

export default function DashboardLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
      }}
    >
      <CircularProgress size={60} color="primary" />
    </Box>
  );
}
