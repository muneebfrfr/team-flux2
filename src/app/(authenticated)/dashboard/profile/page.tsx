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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useProfile } from "@/hooks/useProfile";
import React from "react";
import AppTextField from "@/components/ui/AppTextField";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

export default function ProfilePage() {
  const theme = useTheme();
  const { profile, loading, updating, error, updateProfile } = useProfile();

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
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        py: 4,
        px: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: theme.shadows[4],
        }}
      >
        {/* Header with avatar */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            p: 4,
            color: "white",
            position: "relative",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            <Avatar
              sx={{
                width: 80,
                height: 80,
                fontSize: 32,
                bgcolor: "rgba(255,255,255,0.2)",
                border: "3px solid white",
              }}
            >
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {profile?.name || "User Profile"}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Manage your personal information
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  mb={1}
                  color="text.secondary"
                >
                  Full Name
                </Typography>
                <AppTextField
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  fullWidth
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: editMode
                        ? theme.palette.action.hover
                        : theme.palette.action.disabledBackground,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  mb={1}
                  color="text.secondary"
                >
                  Email
                </Typography>
                <AppTextField
                  name="email"
                  value={form.email}
                  disabled
                  fullWidth
                  size="small"
                  helperText="Email cannot be changed"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: theme.palette.action.disabledBackground,
                    },
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box mb={3}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  mb={1}
                  color="text.secondary"
                >
                  Phone Number
                </Typography>
                <PhoneInput
                  country={"pk"}
                  value={form.phoneNumber}
                  onChange={handlePhoneChange}
                  disabled={!editMode}
                  inputStyle={{
                    width: "100%",
                    borderRadius: "12px",
                    height: "40px",
                    backgroundColor: editMode
                      ? theme.palette.action.hover
                      : theme.palette.action.disabledBackground,
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
              <Box mb={3}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  mb={1}
                  color="text.secondary"
                >
                  Address
                </Typography>
                <AppTextField
                  name="address"
                  value={form.address}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  fullWidth
                  multiline
                  rows={3}
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: editMode
                        ? theme.palette.action.hover
                        : theme.palette.action.disabledBackground,
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Action buttons */}
          <Box
            mt={4}
            display="flex"
            justifyContent="flex-end"
            gap={2}
            sx={{ borderTop: `1px solid ${theme.palette.divider}`, pt: 3 }}
          >
            {!editMode ? (
              <Button
                variant="contained"
                onClick={() => setEditMode(true)}
                startIcon={<EditIcon />}
                sx={{
                  borderRadius: 2,
                  px: 4,
                  py: 1,
                  textTransform: "none",
                  fontWeight: 600,
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
                  startIcon={<CancelIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={updating}
                  startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}