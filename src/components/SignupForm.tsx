"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import PersonIcon from "@mui/icons-material/Person";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import axios from "axios";

export default function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Signup using axios
      const res = await axios.post("/api/add-user", form);

      if (res.status === 201) {
        toast.success("Signup successful! Logging you in...");

        // 2. Automatically login after signup
        const loginResult = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });

        if (loginResult?.ok) {
          toast.success("Logged in successfully!");
          router.push("/dashboard");
        } else {
          toast.error("Signup succeeded but login failed.");
        }
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.error || "Signup failed. Try again.";
        if (msg.includes("already exists")) {
          toast.error("An account with this email already exists.");
        } else {
          toast.error(msg);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
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
              "SIGN UP"
            )}
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Already have an account?{" "}
            <Box
              component="span"
              sx={{
                color: "#764ba2",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => router.push("/login")}
            >
              Sign in
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
