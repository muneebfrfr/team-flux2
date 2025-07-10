"use client";

import { Box, Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

export default function EditProjectPage() {
  const [form, setForm] = useState({ name: "", description: "", color: "" });
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    axios.get(`/api/projects/${id}`).then((res) => {
      setForm(res.data.data);
    });
  }, [id]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/projects/${id}`, form);
      alert("✅ Project updated");
      router.push("/projects");
    } catch (err) {
      alert("❌ Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        Edit Project
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
        label="Color"
        name="color"
        value={form.color}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpdate}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Project"}
      </Button>
    </Box>
  );
}
