"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import useTheme from "@mui/material/styles/useTheme";

import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

import toast from "react-hot-toast";
import AppTextField from "@/components/ui/AppTextField"; 

export default function SignupForm() {
  const theme = useTheme();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/add-user", form);

      if (res.status === 201) {
        toast.success("Signup successful! Logging in...");

        const loginRes = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });

        if (loginRes?.ok) {
          toast.success("Login successful! Redirecting...");
          router.push("/dashboard");
        } else {
          toast.error("Signup succeeded but login failed.");
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = err?.response?.data?.error?.includes("already exists")
          ? "An account with this email already exists."
          : err?.response?.data?.error || "Signup failed.";
        toast.error(msg);
      } else {
        toast.error("An unexpected error occurred.");
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
          <AppTextField
            label="Full Name"
            required
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            icon={
              <PersonIcon sx={{ color: theme.palette.brand.contrastText }} />
            }
            disabled={loading}
          />

          <AppTextField
            label="Email"
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            icon={
              <EmailIcon sx={{ color: theme.palette.brand.contrastText }} />
            }
            disabled={loading}
          />

          <AppTextField
            label="Password"
            type="password"
            required
            fullWidth
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            icon={<LockIcon sx={{ color: theme.palette.brand.contrastText }} />}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              background: `linear-gradient(to right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
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
                color: theme.palette.secondary.main,
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => router.replace("/auth/login")}
            >
              Sign in
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
