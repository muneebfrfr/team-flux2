"use client";

import { Box, Typography } from "@mui/material";
import LoginForm from "@/components/LoginForm";

export default function LoginScreen() {
  return (
    <Box sx={{ display: "flex", position: "fixed", inset: 0, overflow: "hidden" }}>
      {/* Left Panel - Login Form */}
      <LoginForm />

      {/* Right Panel - Welcome */}
      <Box
        sx={{
          width: { xs: "0%", md: "50%" },
          background: "linear-gradient(to right, #764ba2, #667eea)",
          color: "#fff",
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
    </Box>
  );
}
