"use client";

import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";
import Grid from "@mui/material/Grid";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CircularProgress, Alert } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";
import React from "react";

export default function ProfilePage() {
  const theme = useTheme();
  const router = useRouter();
  const { profile, loading, updating, error, updateProfile, isAuthenticated } =
    useProfile();

  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/api/auth/signin");
    }
  }, [loading, isAuthenticated, router]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

  // Update form when profile data is loaded
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setForm((prev) => ({ ...prev, phoneNumber: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: form.name,
        phoneNumber: form.phoneNumber,
        address: form.address,
      });
      setEditMode(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phoneNumber: profile.phoneNumber || "",
        address: profile.address || "",
      });
    }
    setEditMode(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={1}
        sx={{
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          maxWidth: 900,
          mx: "auto",
          mt: 4,
        }}
      >
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Name Field */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Full Name"
              value={form.name}
              onChange={handleInputChange}
              disabled={!editMode}
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: 5,
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Email Field (Non-editable) */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12}>
            <TextField
              name="email"
              label="Email"
              value={form.email}
              disabled={true}
              fullWidth
              InputProps={{
                sx: {
                  borderRadius: 5,
                  backgroundColor: theme.palette.action.disabled,
                },
              }}
              helperText="Email cannot be changed"
            />
          </Grid>
        </Grid>

        {/* Phone Number */}
        <Box mb={2}>
          <PhoneInput
            country={"pk"}
            value={form.phoneNumber}
            onChange={handlePhoneChange}
            disabled={!editMode}
            inputStyle={{
              width: "100%",
              borderRadius: "20px",
              backgroundColor: editMode
                ? theme.palette.action.hover
                : theme.palette.action.disabled,
              border: `1px solid ${theme.palette.divider}`,
              paddingLeft: "48px",
              color: theme.palette.text.primary,
            }}
            containerStyle={{
              width: "100%",
            }}
            inputProps={{
              name: "phoneNumber",
            }}
          />
        </Box>

        {/* Address */}
        <Box>
          <TextField
            name="address"
            label="Address"
            value={form.address}
            onChange={handleInputChange}
            disabled={!editMode}
            fullWidth
            multiline
            rows={2}
            InputProps={{
              sx: {
                borderRadius: 5,
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Box>

        {/* Buttons */}
        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          {!editMode ? (
            <Button
              variant="contained"
              onClick={() => setEditMode(true)}
              sx={{
                borderRadius: 5,
                backgroundColor: theme.palette.primary.main,
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={updating}
                sx={{
                  borderRadius: 5,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={updating}
                sx={{
                  borderRadius: 5,
                  backgroundColor: theme.palette.primary.main,
                }}
              >
                {updating ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
