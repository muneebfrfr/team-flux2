"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, CircularProgress } from "@mui/material";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/login");
    }, 1500); 

    return () => clearTimeout(timeout); // cleanup
  }, [router]);

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
