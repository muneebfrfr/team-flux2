"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import AppFieldText from "@/components/ui/AppTextField";
import route from "@/route";
import ThemeRegistry from "@/components/ThemeRegistry";
import toast from "react-hot-toast";

interface Project {
  id: string;
  name: string;
}

interface DeprecationFormData {
  projectId: string;
  deprecatedItem: string;
  suggestedReplacement: string;
  migrationNotes: string;
  timelineStart: string;
  deadline: string;
  progressStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

const defaultFormData: DeprecationFormData = {
  projectId: "",
  deprecatedItem: "",
  suggestedReplacement: "",
  migrationNotes: "",
  timelineStart: "",
  deadline: "",
  progressStatus: "NOT_STARTED",
};

interface DeprecationFormProps {
  deprecationId?: string;
  mode: "create" | "edit";
}

export default function DeprecationForm({
  deprecationId,
  mode,
}: DeprecationFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit";

  const [formData, setFormData] =
    useState<DeprecationFormData>(defaultFormData);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const projectsRes = await axios.get("/api/projects");
        setProjects(
          Array.isArray(projectsRes.data)
            ? projectsRes.data
            : projectsRes.data.data || []
        );

        if (isEditMode && deprecationId) {
          const deprecationRes = await axios.get(
            `/api/deprecations/${deprecationId}`
          );
          const deprecationData = deprecationRes.data;
          setFormData({
            projectId: deprecationData.projectId || "",
            deprecatedItem: deprecationData.deprecatedItem || "",
            suggestedReplacement: deprecationData.suggestedReplacement || "",
            migrationNotes: deprecationData.migrationNotes || "",
            timelineStart: deprecationData.timelineStart
              ? deprecationData.timelineStart.split("T")[0]
              : "",
            deadline: deprecationData.deadline
              ? deprecationData.deadline.split("T")[0]
              : "",
            progressStatus: deprecationData.progressStatus || "NOT_STARTED",
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        const errorMessage = isEditMode
          ? "Failed to load deprecation data"
          : "Failed to load projects";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [deprecationId, isEditMode]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = (): boolean => {
    if (!formData.deprecatedItem.trim()) {
      toast.error("Deprecated item is required");
      return false;
    }

    if (!formData.projectId) {
      toast.error("Project is required");
      return false;
    }

    if (!formData.timelineStart) {
      toast.error("Timeline start date is required");
      return false;
    }

    if (!formData.deadline) {
      toast.error("Deadline is required");
      return false;
    }
    if (new Date(formData.deadline) < new Date(formData.timelineStart)) {
      toast.error("Deadline must be after timeline start date");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      if (isEditMode) {
        await axios.put(`/api/deprecations/${deprecationId}`, formData);
        toast.success("Deprecation updated successfully!");
        setTimeout(() => {
          router.push(route.deprecations);
        }, 1500);
      } else {
        await axios.post("/api/deprecations", formData);
        toast.success("Deprecation created successfully!");
        router.push(route.deprecations);
      }
    } catch (err: unknown) {
      let errorMessage = `Failed to ${
        isEditMode ? "update" : "create"
      } deprecation`;

      if (axios.isAxiosError(err)) {
        errorMessage = err?.response?.data?.error || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(route.deprecations);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeRegistry>
      <Box p={3}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {isEditMode ? "Edit Deprecation" : "Add New Deprecation"}
        </Typography>

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <AppFieldText
                    select
                    label="Project"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={submitting}
                  >
                    <MenuItem value="">
                      <em>Select a project</em>
                    </MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                  </AppFieldText>
                </Grid>

                <Grid item xs={12} md={6}>
                  <AppFieldText
                    select
                    label="Progress Status"
                    name="progressStatus"
                    value={formData.progressStatus}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={submitting}
                  >
                    <MenuItem value="NOT_STARTED">Not Started</MenuItem>
                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                    <MenuItem value="COMPLETED">Completed</MenuItem>
                  </AppFieldText>
                </Grid>

                <Grid item xs={12}>
                  <AppFieldText
                    label="Deprecated Item"
                    name="deprecatedItem"
                    value={formData.deprecatedItem}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={submitting}
                    placeholder="e.g., Legacy API v1, Old Authentication System"
                  />
                </Grid>

                <Grid item xs={12}>
                  <AppFieldText
                    label="Suggested Replacement"
                    name="suggestedReplacement"
                    value={formData.suggestedReplacement}
                    onChange={handleChange}
                    fullWidth
                    disabled={submitting}
                    placeholder="e.g., New API v2, OAuth 2.0 System"
                  />
                </Grid>

                <Grid item xs={12}>
                  <AppFieldText
                    label="Migration Notes"
                    name="migrationNotes"
                    value={formData.migrationNotes}
                    onChange={handleChange}
                    fullWidth
                    multiline
                    rows={4}
                    disabled={submitting}
                    placeholder="Provide detailed migration instructions, breaking changes, and considerations..."
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AppFieldText
                    label="Timeline Start"
                    name="timelineStart"
                    type="date"
                    value={formData.timelineStart}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={submitting}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <AppFieldText
                    label="Deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    fullWidth
                    required
                    disabled={submitting}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Box display="flex" gap={2} justifyContent="flex-end">
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={submitting}
                      color="secondary"
                    >
                      {submitting
                        ? isEditMode
                          ? "Updating..."
                          : "Creating..."
                        : isEditMode
                        ? "Update Deprecation"
                        : "Create Deprecation"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </ThemeRegistry>
  );
}
