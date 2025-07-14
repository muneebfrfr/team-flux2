"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import LoginForm from "@/components/LoginForm";

export default function LoginScreen() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(to right, #764ba2, #667eea)",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }
  return (
    <Box
      sx={{ display: "flex", position: "fixed", inset: 0, overflow: "hidden" }}
    >
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
