"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
export default function FullScreenLoader() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
      }}
    >
      <CircularProgress sx={{ color: "#fff" }} />
    </Box>
  );
}
