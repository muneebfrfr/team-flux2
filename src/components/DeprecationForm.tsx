"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import AppTextField from "@/components/ui/AppTextField";
import route from "@/route";

interface DeprecationFormData {
  id?: string;
  projectId: string;
  deprecatedItem: string;
  suggestedReplacement?: string;
  migrationNotes?: string;
  timelineStart: string;
  deadline: string;
  progressStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

interface DeprecationFormProps {
  initialData?: DeprecationFormData;
  isEdit?: boolean;
}

interface Project {
  id: string;
  name: string;
}

const statusOptions: DeprecationFormData["progressStatus"][] = [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
];

export default function DeprecationForm({
  initialData,
  isEdit = false,
}: DeprecationFormProps) {
  const [form, setForm] = useState<DeprecationFormData>({
    projectId: "",
    deprecatedItem: "",
    suggestedReplacement: "",
    migrationNotes: "",
    timelineStart: "",
    deadline: "",
    progressStatus: "NOT_STARTED",
  });

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (initialData && isEdit) {
      setForm({
        projectId: initialData.projectId || "",
        deprecatedItem: initialData.deprecatedItem || "",
        suggestedReplacement: initialData.suggestedReplacement || "",
        migrationNotes: initialData.migrationNotes || "",
        timelineStart: initialData.timelineStart?.split("T")[0] || "",
        deadline: initialData.deadline?.split("T")[0] || "",
        progressStatus: statusOptions.includes(initialData.progressStatus)
          ? initialData.progressStatus
          : "NOT_STARTED",
        id: initialData.id,
      });
    }
  }, [initialData, isEdit]);

  useEffect(() => {
    axios.get("/api/projects").then((res) => {
      setProjects(res.data.data || []);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (isEdit && form.id) {
        await axios.put(`/api/deprecations/${form.id}`, form);
      } else {
        await axios.post(`/api/projects/${form.projectId}/deprecations`, form);
      }
      router.push(route.deprecations);
    } catch (e) {
      console.error("Error saving deprecation:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="600px" mx="auto" mt={4}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? "Edit Deprecation" : "Add New Deprecation"}
      </Typography>

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
        name="deprecatedItem"
        label="Deprecated Item"
        fullWidth
        margin="normal"
        value={form.deprecatedItem}
        onChange={handleChange}
        required
      />

      <AppTextField
        name="suggestedReplacement"
        label="Suggested Replacement"
        fullWidth
        margin="normal"
        value={form.suggestedReplacement || ""}
        onChange={handleChange}
      />

      <AppTextField
        name="migrationNotes"
        label="Migration Notes"
        fullWidth
        margin="normal"
        multiline
        minRows={3}
        value={form.migrationNotes || ""}
        onChange={handleChange}
      />

      <AppTextField
        name="timelineStart"
        label="Start Date"
        type="date"
        fullWidth
        margin="normal"
        value={form.timelineStart}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />

      <AppTextField
        name="deadline"
        label="Deadline"
        type="date"
        fullWidth
        margin="normal"
        value={form.deadline}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        required
      />

      <AppTextField
        select
        name="progressStatus"
        label="Progress Status"
        fullWidth
        margin="normal"
        value={form.progressStatus}
        onChange={handleChange}
      >
        <MenuItem value="NOT_STARTED">Not Started</MenuItem>
        <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
        <MenuItem value="COMPLETED">Completed</MenuItem>
      </AppTextField>

      <Box mt={3}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </Box>
    </Box>
  );
}
