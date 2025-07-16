// /components/layout/RightPanel.tsx
"use client";

import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function RightPanel() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: { xs: "0%", md: "50%" },
        background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
        color: theme.palette.common.white,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 5,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        WELCOME TO
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: 600, mb: 2 }}>
        Team Flux
      </Typography>
    </Box>
  );
}
