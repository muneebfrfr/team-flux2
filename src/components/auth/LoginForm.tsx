"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import useTheme from "@mui/material/styles/useTheme";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

export default function LoginForm() {
  const theme = useTheme();
  const { status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

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
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: theme.palette.brand.contrastText }} />
                </InputAdornment>
              ),
            }}
            disabled={loading}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: theme.palette.brand.contrastText }} />
                </InputAdornment>
              ),
            }}
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
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "SIGN IN"
            )}
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Box
              component="span"
              sx={{
                color: theme.palette.secondary.main,
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => router.replace("/signup")}
            >
              Sign up
            </Box>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
