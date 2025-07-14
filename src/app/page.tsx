"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SplashScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    const timeout = setTimeout(() => {
      if (status === "authenticated") {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [status, router]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#000",
        color: "#fff",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Welcome to TeamFlux
      </Typography>
      <CircularProgress color="inherit" />
    </Box>
  );
}
