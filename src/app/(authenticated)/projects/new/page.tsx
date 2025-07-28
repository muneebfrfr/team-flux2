"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import toast from "react-hot-toast";

import AppTextField from "@/components/ui/AppTextField";

import route from "@/route";

type ProjectForm = {
  name: string;
  description: string;
  color: string;
};

export default function CreateProjectPage() {
  const [form, setForm] = useState<ProjectForm>({
    name: "",
    description: "",
    color: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.post("/api/projects", form);
      toast.success("Project created successfully");
      router.push(route.projects);
    } catch (err) {
      console.error(err);
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to create project";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        Create New Project
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
