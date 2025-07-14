"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dynamic from "next/dynamic";

// Dynamically load SignupForm to reduce initial JS bundle
const SignupForm = dynamic(() => import("@/components/SignupForm"));

export default function SignupPage() {
  return (
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        inset: 0,
        overflow: "hidden",
      }}
    >
      {/* Left Panel - Signup Form */}
      <SignupForm />

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
