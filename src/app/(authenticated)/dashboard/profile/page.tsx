"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useProfile } from "@/hooks/useProfile";
import React from "react";
import AppTextField from "@/components/ui/AppTextField";
export default function ProfilePage() {
  const theme = useTheme();
  const { profile, loading, updating, error, updateProfile } =
    useProfile();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
  });

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
    <Paper
      elevation={10}
      sx={{
        borderRadius: 6,
        p: { xs: 3, md: 6 },
        height: "90%",
        backgroundColor: theme.palette.background.paper,
        mt: 4,
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              Full Name:
            </Typography>
            <AppTextField
              name="name"
              value={form.name}
              onChange={handleInputChange}
              disabled={!editMode}
              fullWidth
              InputProps={{
                sx: {
                  backgroundColor: editMode
                    ? theme.palette.action.hover
                    : theme.palette.action.disabled,
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              Email:
            </Typography>
            <AppTextField
              name="email"
              value={form.email}
              disabled
              fullWidth
              helperText="Email cannot be changed"
              InputProps={{
                sx: {
                  backgroundColor: theme.palette.action.disabled,
                },
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              Phone Number:
            </Typography>
            <PhoneInput
              country={"pk"}
              value={form.phoneNumber}
              onChange={handlePhoneChange}
              disabled={!editMode}
              inputStyle={{
                width: "100%",
                borderRadius: "12px",
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
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              Address:
            </Typography>
            <AppTextField
              name="address"
              value={form.address}
              onChange={handleInputChange}
              disabled={!editMode}
              fullWidth
              multiline
              rows={3}
              InputProps={{
                sx: {
                  backgroundColor: editMode
                    ? theme.palette.action.hover
                    : theme.palette.action.disabled,
                },
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Buttons */}
      <Box mt={5} display="flex" justifyContent="flex-end" gap={2}>
        {!editMode ? (
          <Button
            variant="contained"
            onClick={() => setEditMode(true)}
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
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
                borderRadius: 3,
                px: 4,
                py: 1.5,
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={updating}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
              }}
            >
              {updating ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
}
