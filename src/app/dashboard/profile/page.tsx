"use client";

import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import useTheme from "@mui/material/styles/useTheme";
import Grid from "@mui/material/Grid";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function ProfilePage() {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    state: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (value: string) => {
    setForm((prev) => ({ ...prev, phone: value }));
  };

  const handleSave = () => {
    console.log("Saved:", form);
    setEditMode(false);
  };

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
        {/* Avatar */}
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            src="/profile-avatar.png"
            sx={{ width: 80, height: 80, mr: 2 }}
          />
        </Box>

        {/* First Name + Last Name */}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={6}>
            <TextField
              name="firstName"
              label="First Name"
              value={form.firstName}
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
          <Grid item xs={12} md={6}>
            <TextField
              name="lastName"
              label="Last Name"
              value={form.lastName}
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

        {/* Phone Number */}
        <Box mb={2}>
          <PhoneInput
            country={"pk"}
            value={form.phone}
            onChange={handlePhoneChange}
            disabled={!editMode}
            inputStyle={{
              width: "100%",
              borderRadius: "20px",
              backgroundColor: theme.palette.action.hover,
              border: `1px solid ${theme.palette.divider}`,
              paddingLeft: "48px",
              color: theme.palette.text.primary,
            }}
            containerStyle={{
              width: "100%",
            }}
            inputProps={{
              name: "phone",
            }}
          />
        </Box>

        {/* State */}
        <Box mb={2}>
          <TextField
            name="state"
            label="State"
            value={form.state}
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
                backgroundColor: theme.palette.brand.contrastText,
              }}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outlined"
                onClick={() => setEditMode(false)}
                sx={{
                  borderRadius: 5,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.brand.contrastText,
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  borderRadius: 5,
                  color: theme.palette.brand.main,
                }}
              >
                Save
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
