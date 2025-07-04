"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
} from "@mui/material";

export default function ProfilePage() {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = () => setEditMode(true);
  const handleSave = () => {
    // TODO: save to database or API
    console.log("Saved:", form);
    setEditMode(false);
  };

  return (
    <Box p={4} component={Paper} maxWidth={600} mx="auto">
      <Typography variant="h5" mb={3} fontWeight="bold">
        Profile
      </Typography>

      <Stack spacing={2}>
        <TextField
          name="firstName"
          label="First Name"
          value={form.firstName}
          onChange={handleChange}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          name="lastName"
          label="Last Name"
          value={form.lastName}
          onChange={handleChange}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          name="phone"
          label="Phone Number"
          value={form.phone}
          onChange={handleChange}
          disabled={!editMode}
          fullWidth
        />
        <TextField
          name="address"
          label="Address"
          value={form.address}
          onChange={handleChange}
          disabled={!editMode}
          fullWidth
          multiline
          rows={2}
        />
      </Stack>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        {!editMode ? (
          <Button variant="contained" onClick={handleEdit}>
            Edit
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
