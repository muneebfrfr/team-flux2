"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import MenuItem from "@mui/material/MenuItem";

import AppFieldText from "@/components/ui/AppTextField";
import ThemeRegistry from "@/components/ThemeRegistry";

interface Project {
  name: string;
  description: string;
}

interface Deprecation {
  id: string;
  projectId: string;
  deprecatedItem: string;
  suggestedReplacement?: string;
  migrationNotes?: string;
  timelineStart: string;
  deadline: string;
  progressStatus: string;
  createdAt: string;
  updatedAt: string;
  project?: Project;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
};

const formatFieldName = (fieldName: string): string =>
  fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

const isDateField = (key: string): boolean =>
  ["timelineStart", "deadline", "createdAt", "updatedAt"].includes(key);

function DeprecationListTableInner() {
  const params = useParams() as Record<string, string | undefined>;
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [deprecations, setDeprecations] = useState<Deprecation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    deprecatedItem: "",
    suggestedReplacement: "",
    migrationNotes: "",
    timelineStart: "",
    deadline: "",
    progressStatus: "",
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDeprecations = async () => {
    try {
      const res = await axios.get(`/api/projects/${id}/deprecations`);
      const dataArray = Array.isArray(res.data) ? res.data : [];
      setDeprecations(dataArray);
    } catch (err) {
      // Cast to any to safely get error.message
      const error = err as { message?: string };
      setError(
        `Failed to load deprecations: ${error.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDeprecations();
    else {
      setError("No project ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleOpen = () => {
    setSubmitError(null);
    setFormData({
      deprecatedItem: "",
      suggestedReplacement: "",
      migrationNotes: "",
      timelineStart: "",
      deadline: "",
      progressStatus: "",
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await axios.post("/api/deprecations", {
        ...formData,
        projectId: id,
      });
      handleClose();
      fetchDeprecations();
    } catch (err) {
      // Cast to any to safely get error.response.data.error
      const error = err as { response?: { data?: { error?: string } } };
      setSubmitError(
        error.response?.data?.error || "Failed to create deprecation"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress />
        <Typography mt={2}>Loading deprecations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth="md" mx="auto" mt={6}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const project = deprecations[0]?.project;
  const keysToExclude = ["id", "projectId", "project"];
  const tableHeaders = Object.keys(deprecations[0] || {}).filter(
    (key) => !keysToExclude.includes(key)
  );

  return (
    <Box maxWidth="lg" mx="auto" mt={6}>
      {project?.name && (
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {project.name}
        </Typography>
      )}

      {project?.description && (
        <Typography variant="body1" color="text.secondary" mb={3}>
          {project.description}
        </Typography>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" fontWeight="medium">
          Deprecations ({deprecations.length})
        </Typography>
        <Button variant="contained" onClick={handleOpen}>
          New Deprecation
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {deprecations.length === 0 ? (
        <Alert severity="info">No deprecations found for this project.</Alert>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 3, overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {tableHeaders.map((header) => (
                  <TableCell key={header}>
                    <strong>{formatFieldName(header)}</strong>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {deprecations.map((dep) => (
                <TableRow key={dep.id}>
                  {tableHeaders.map((key) => {
                    const value = dep[key as keyof Deprecation];
                    let displayValue = "—";

                    if (value !== null && value !== undefined) {
                      if (typeof value === "boolean") {
                        displayValue = value ? "Yes" : "No";
                      } else if (isDateField(key)) {
                        displayValue = formatDate(value as string);
                      } else if (typeof value === "object") {
                        displayValue = JSON.stringify(value);
                      } else {
                        displayValue = String(value);
                      }
                    }

                    return <TableCell key={key}>{displayValue}</TableCell>;
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Deprecation</DialogTitle>
        <DialogContent>
          <AppFieldText
            label="Deprecated Item"
            name="deprecatedItem"
            value={formData.deprecatedItem}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <AppFieldText
            label="Suggested Replacement"
            name="suggestedReplacement"
            value={formData.suggestedReplacement}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <AppFieldText
            label="Migration Notes"
            name="migrationNotes"
            value={formData.migrationNotes}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />
          <AppFieldText
            label="Timeline Start"
            name="timelineStart"
            type="date"
            value={formData.timelineStart}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <AppFieldText
            label="Deadline"
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <AppFieldText
            select
            label="Progress Status"
            name="progressStatus"
            value={formData.progressStatus}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            <MenuItem value="NOT_STARTED">Not Started</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </AppFieldText>

          {submitError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {submitError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default function DeprecationListTable() {
  return (
    <ThemeRegistry>
      <DeprecationListTableInner />
    </ThemeRegistry>
  );
}
