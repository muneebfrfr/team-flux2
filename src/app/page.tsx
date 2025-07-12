"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";

export default function SplashScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (status === "authenticated") {
        router.push("/dashboard");
      } else if (status !== "loading") {
        router.push("/login");
      }
    }, 0);

    return () => clearTimeout(timeout);
  }, [router, status]);

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
