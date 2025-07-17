"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppTextField from "@/components/ui/AppTextField";

export default function EditProjectPage() {
  const [form, setForm] = useState({ name: "", description: "", color: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  useEffect(() => {
    axios.get(`/api/projects/${id}`).then((res) => setForm(res.data.data));
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(`/api/projects/${id}`, form);
      router.push("/projects");
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        Edit Project
      </Typography>

      <AppTextField
        label="Project Name"
        name="name"
        value={form.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <AppTextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        fullWidth
        multiline
        rows={3}
        margin="normal"
      />

      <AppTextField
        label="Color"
        name="color"
        value={form.color}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        onClick={handleUpdate}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </Button>
    </Box>
  );
}
