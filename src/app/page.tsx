"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard",
    });

    console.log("Login response:", res);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Panel - Login */}
      <Box
        sx={{
          width: { xs: "100%", md: "50%" },
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{ p: 5, width: "100%", maxWidth: 400, borderRadius: 4 }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: 500 }}
          >
            Get Started
          </Typography>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Username"
              type="email"
              required
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1 }} />,
              }}
            />
            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1 }} />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "linear-gradient(to right, #764ba2, #667eea)",
                "&:hover": { backgroundColor: "#3AC6C6" },
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "30px",
                py: 1.5,
              }}
            >
              SIGN IN
            </Button>
            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              Don&apos;t have an account?{" "}
              <Box
                component="span"
                sx={{ color: "#764ba2", cursor: "pointer", fontWeight: 600 }}
                onClick={() => (window.location.href = "/signup")} // or use router.push('/signup') if using next/router
              >
                Sign up
              </Box>
            </Typography>
          </Box>
        </Paper>
      </Box>

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
