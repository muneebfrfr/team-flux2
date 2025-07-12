// /app/technical-debt/[id]/edit/page.tsx
"use client";

import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

export default function EditDebtPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    ownerId: "",
    priority: "Medium",
    status: "open",
    dueDate: "",
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    const [projectRes, userRes, debtRes] = await Promise.all([
      axios.get("/api/projects"),
      axios.get("/api/get-users"),
      axios.get(`/api/technical-debt/${id}`),
    ]);

    setProjects(projectRes.data.data);
    setUsers(userRes.data.data);
    const d = debtRes.data.data;
    setForm({
      title: d.title,
      description: d.description,
      projectId: d.projectId,
      ownerId: d.ownerId || "",
      priority: d.priority,
      status: d.status,
      dueDate: d.dueDate?.substring(0, 10) || "",
    });
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/technical-debt/${id}`, form);
      router.push("/technical-debt");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={4} maxWidth={600} mx="auto">
      <Typography variant="h4" mb={3}>Edit Technical Debt</Typography>

      <TextField
        name="title"
        label="Title"
        fullWidth
        margin="normal"
        value={form.title}
        onChange={handleChange}
      />

      <TextField
        name="description"
        label="Description"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={form.description}
        onChange={handleChange}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Project</InputLabel>
        <Select name="projectId" value={form.projectId} onChange={handleChange}>
          {projects.map((p: any) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Owner</InputLabel>
        <Select name="ownerId" value={form.ownerId} onChange={handleChange}>
          {users.map((u: any) => (
            <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Priority</InputLabel>
        <Select name="priority" value={form.priority} onChange={handleChange}>
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select name="status" value={form.status} onChange={handleChange}>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="in-review">In Review</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="dueDate"
        label="Due Date"
        type="date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={form.dueDate}
        onChange={handleChange}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
        fullWidth
        sx={{ mt: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : "Update"}
      </Button>
    </Box>
  );
}