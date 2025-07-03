"use client";

import { useState } from "react";
import { useRouter } from "next/router";
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
import PersonIcon from "@mui/icons-material/Person";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/add-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Signup failed");
    }
  };

  return (
    <Box
      sx={{ display: "flex", position: "fixed", inset: 0, overflow: "hidden" }}
    >
      {/* Left Panel - Signup Form */}
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
            Create Account
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Full Name"
              required
              fullWidth
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1 }} />,
              }}
            />

            <TextField
              label="Password"
              type="password"
              required
              fullWidth
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1 }} />,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(to right, #764ba2, #667eea)",
                "&:hover": { backgroundColor: "#3AC6C6" },
                color: "#fff",
                fontWeight: "bold",
                borderRadius: "30px",
                py: 1.5,
              }}
                onClick={() => router.push("/")}
            >
              SIGN UP
            </Button>

            {error && (
              <Typography color="error" align="center" mt={1}>
                {error}
              </Typography>
            )}

            <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
              Already have an account?{" "}
              <Box
                component="span"
                sx={{ color: "#764ba2", cursor: "pointer", fontWeight: 600 }}
                onClick={() => router.push("/")}
              >
                Sign in
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
