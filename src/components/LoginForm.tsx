"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 Loader state

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 👈 Start loading
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard",
    });
    setLoading(false); // This might not be reached if redirect happens
  };

  return (
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
            disabled={loading} // 👈 Disable when loading
            sx={{
              background: "linear-gradient(to right, #764ba2, #667eea)",
              "&:hover": { backgroundColor: "#3AC6C6" },
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "30px",
              py: 1.5,
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "SIGN IN"
            )}
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Box
              component="span"
              sx={{ color: "#764ba2", cursor: "pointer", fontWeight: 600 }}
              onClick={() => (window.location.href = "/signup")}
            >
              Sign up
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
