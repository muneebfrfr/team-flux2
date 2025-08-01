"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import AppTextField from "@/components/ui/AppTextField";

interface Props {
  type: "create" | "edit";
  id?: string;
}

interface Project {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

export default function TechnicalDebtForm({ type, id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    ownerId: "",
    priority: "Medium",
    status: "open",
    dueDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectRes, userRes] = await Promise.all([
          axios.get("/api/projects"),
          axios.get("/api/get-users"),
        ]);
        setProjects(projectRes.data.data);
        setUsers(userRes.data.data ?? userRes.data);
      } catch (error) {
        console.error("Failed to fetch projects or users:", error);
        toast.error("Failed to load projects or users.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (type === "edit" && id) {
      const fetchDebt = async () => {
        try {
          const { data } = await axios.get(`/api/technical-debt/${id}`);
          const d = data.data;
          setForm({
            title: d.title,
            description: d.description,
            projectId: d.projectId,
            ownerId: d.ownerId || "",
            priority: d.priority,
            status: d.status,
            dueDate: d.dueDate?.substring(0, 10) || "",
          });
        } catch (error) {
          console.error("Failed to fetch technical debt:", error);
          toast.error("Failed to fetch technical debt data.");
        }
      };
      fetchDebt();
    }
  }, [id, type]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (type === "create") {
        await axios.post("/api/technical-debt", form);
        toast.success("Technical debt created successfully!");
      } else {
        await axios.put(`/api/technical-debt/${id}`, form);
        toast.success("Technical debt updated successfully!");
      }
      router.push("/technical-debt");
    } catch (err) {
      console.error(
        `${type === "create" ? "Creation" : "Update"} failed:`,
        err
      );
      toast.error(
        `Failed to ${type === "create" ? "create" : "update"} debt item.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        {type === "create" ? "Create Technical Debt" : "Edit Technical Debt"}
      </Typography>

      <AppTextField
        name="title"
        label="Title"
        fullWidth
        margin="normal"
        value={form.title}
        onChange={handleChange}
        required
      />

      <AppTextField
        name="description"
        label="Description"
        fullWidth
        margin="normal"
        multiline
        minRows={4}
        value={form.description}
        onChange={handleChange}
        required
      />

      <AppTextField
        select
        name="projectId"
        label="Project"
        fullWidth
        margin="normal"
        value={form.projectId}
        onChange={handleChange}
        required
      >
        {projects.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name}
          </MenuItem>
        ))}
      </AppTextField>

      <AppTextField
        select
        name="ownerId"
        label="Owner"
        fullWidth
        margin="normal"
        value={form.ownerId}
        onChange={handleChange}
        required
      >
        {users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {u.name}
          </MenuItem>
        ))}
      </AppTextField>

      <AppTextField
        select
        name="priority"
        label="Priority"
        fullWidth
        margin="normal"
        value={form.priority}
        onChange={handleChange}
      >
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </AppTextField>

      <AppTextField
        select
        name="status"
        label="Status"
        fullWidth
        margin="normal"
        value={form.status}
        onChange={handleChange}
      >
        <MenuItem value="open">Open</MenuItem>
        <MenuItem value="in-review">In Review</MenuItem>
        <MenuItem value="closed">Closed</MenuItem>
      </AppTextField>

      <AppTextField
        name="dueDate"
        label="Due Date"
        type="date"
        fullWidth
        margin="normal"
        value={form.dueDate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />

      <Box mt={3}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : type === "create" ? (
            "Create"
          ) : (
            "Update"
          )}
        </Button>
      </Box>
    </Box>
  );
}
