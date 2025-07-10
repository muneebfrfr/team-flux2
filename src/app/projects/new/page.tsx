"use client";

import {
  Box,
  TextField,
  Button,
  Typography,
  InputLabel,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "", // Optional if added in schema
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("/api/projects", form);
      alert("Project created successfully");
      router.push("/projects");
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        Create New Project
      </Typography>

      <TextField
        label="Project Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />

      <TextField
        label="Color (Optional)"
        name="color"
        value={form.color}
        onChange={handleChange}
        fullWidth
        margin="normal"
        placeholder="#f44336 or red"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Project"}
      </Button>
    </Box>
  );
}
