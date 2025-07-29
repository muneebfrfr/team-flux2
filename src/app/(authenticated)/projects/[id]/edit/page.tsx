"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AppTextField from "@/components/ui/AppTextField";
import { HexColorPicker } from "react-colorful";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import ColorizeIcon from "@mui/icons-material/Colorize";
import toast from "react-hot-toast";

export default function EditProjectPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#3b82f6", // Default color
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const router = useRouter();
  const params = useParams();

  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`);
        if (res.data.data) {
          setForm({
            name: res.data.data.name || "",
            description: res.data.data.description || "",
            color: res.data.data.color || "#3b82f6",
          });
        }
      } catch (err) {
        toast.error("Failed to load project");
        console.error("Error loading project:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleColorChange = (color: string) => {
    setForm({ ...form, color });
  };

  const handleColorPickerOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await axios.put(`/api/projects/${id}`, form);
      toast.success("Project updated successfully");
      router.push("/projects");
    } catch (err) {
      toast.error("Failed to update project");
      console.error("Error updating project:", err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <Typography mt={5} align="center">
        Loading...
      </Typography>
    );
  }

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

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" gutterBottom>
          Color
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={handleColorPickerOpen}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: form.color,
              border: "1px solid #ccc",
              "&:hover": {
                backgroundColor: form.color,
                opacity: 0.9,
              },
            }}
          >
            <ColorizeIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography variant="body2">
            {form.color}
          </Typography>
        </Box>
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleColorPickerClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <HexColorPicker color={form.color} onChange={handleColorChange} />
        </Box>
      </Popover>

      <Button
        variant="contained"
        onClick={handleUpdate}
        sx={{ mt: 2 }}
        disabled={updating}
      >
        {updating ? "Updating..." : "Update Project"}
      </Button>
    </Box>
  );
}