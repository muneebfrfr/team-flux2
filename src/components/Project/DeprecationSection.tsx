// src/components/Project/DeprecationSection.tsx
"use client";

import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AppFieldText from "@/components/ui/AppTextField";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface Deprecation {
  id: string;
  deprecatedItem: string;
  suggestedReplacement: string;
  migrationNotes: string;
  timelineStart: string;
  deadline: string;
  progressStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
}

const defaultFormData: Deprecation = {
  id: "",
  deprecatedItem: "",
  suggestedReplacement: "",
  migrationNotes: "",
  timelineStart: "",
  deadline: "",
  progressStatus: "NOT_STARTED",
};

export default function DeprecationSection({
  projectId,
}: {
  projectId: string;
}) {
  const [deprecations, setDeprecations] = useState<Deprecation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<Deprecation>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchDeprecations = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/deprecations`);
      setDeprecations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch deprecations", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) fetchDeprecations();
  }, [projectId, fetchDeprecations]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDialogOpen = (dep?: Deprecation) => {
    if (dep) {
      setIsEditMode(true);
      setFormData({ ...dep });
    } else {
      setIsEditMode(false);
      setFormData(defaultFormData);
    }
    setFormOpen(true);
  };

  const handleDialogClose = () => {
    setFormOpen(false);
    setSubmitError("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      if (isEditMode && formData.id) {
        await axios.put(`/api/deprecations/${formData.id}`, formData);
      } else {
        await axios.post("/api/deprecations", {
          ...formData,
          projectId,
        });
      }
      handleDialogClose();
      await fetchDeprecations();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setSubmitError(error?.response?.data?.error || "Failed to submit");
      } else {
        setSubmitError("Failed to submit");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/deprecations/${id}`);
      await fetchDeprecations();
    } catch (error) {
      console.error("Failed to delete deprecation", error);
    }
  };

  const formatDate = (str: string) =>
    str ? new Date(str).toLocaleDateString("en-GB") : "—";

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Deprecations</Typography>
        <Button variant="contained" onClick={() => handleDialogOpen()}>
          + CREATE NEW
        </Button>
      </Box>

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : deprecations.length === 0 ? (
        <Alert sx={{ mt: 2 }} severity="info">
          No deprecations found for this project.
        </Alert>
      ) : (
        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Replacement</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Deadline</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {deprecations.map((dep) => (
              <TableRow key={dep.id}>
                <TableCell>{dep.deprecatedItem}</TableCell>
                <TableCell>{dep.suggestedReplacement || "—"}</TableCell>
                <TableCell>{dep.progressStatus}</TableCell>
                <TableCell>{formatDate(dep.timelineStart)}</TableCell>
                <TableCell>{formatDate(dep.deadline)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDialogOpen(dep)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(dep.id)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={formOpen}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {isEditMode ? "Edit Deprecation" : "Add New Deprecation"}
        </DialogTitle>
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
          <Button onClick={handleDialogClose} disabled={submitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : isEditMode ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}