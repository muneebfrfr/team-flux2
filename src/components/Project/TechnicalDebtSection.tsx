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
import AppTextField from "@/components/ui/AppTextField";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface TechnicalDebt {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  priority: "Low" | "Medium" | "High";
  status: "open" | "in-review" | "closed";
  dueDate: string;
  owner?: {
    id: string;
    name: string;
  };
}

interface User {
  id: string;
  name: string;
}

interface Props {
  projectId: string;
}

const defaultFormData: TechnicalDebt = {
  id: "",
  title: "",
  description: "",
  ownerId: "",
  priority: "Medium",
  status: "open",
  dueDate: "",
};

export default function TechnicalDebtSection({ projectId }: Props) {
  const [debts, setDebts] = useState<TechnicalDebt[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<TechnicalDebt>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  const fetchTechnicalDebts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/technical-debt`);
      setDebts(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch technical debts", err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const userRes = await axios.get("/api/get-users");
      setUsers(
        Array.isArray(userRes.data.data) ? userRes.data.data : userRes.data
      );
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchTechnicalDebts();
      fetchDropdownData();
    }
  }, [projectId, fetchTechnicalDebts, fetchDropdownData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDialogOpen = (debt?: TechnicalDebt) => {
    if (debt) {
      setIsEditMode(true);
      setFormData({
        id: debt.id,
        title: debt.title,
        description: debt.description,
        ownerId: debt.ownerId,
        priority: debt.priority,
        status: debt.status,
        dueDate: debt.dueDate?.substring(0, 10) || "",
        owner: debt.owner,
      });
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
        await axios.put(`/api/technical-debt/${formData.id}`, formData);
      } else {
        await axios.post("/api/technical-debt", {
          ...formData,
          projectId,
        });
      }
      handleDialogClose();
      await fetchTechnicalDebts();
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
      await axios.delete(`/api/technical-debt/${id}`);
      await fetchTechnicalDebts();
    } catch (error) {
      console.error("Failed to delete technical debt", error);
    }
  };

  const formatDate = (str: string) =>
    str ? new Date(str).toLocaleDateString("en-GB") : "—";

  return (
    <Box mt={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Technical Debt</Typography>
        <Button variant="contained" onClick={() => handleDialogOpen()}>
          + CREATE NEW
        </Button>
      </Box>

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : debts.length === 0 ? (
        <Alert sx={{ mt: 2 }} severity="info">
          No technical debts found for this project.
        </Alert>
      ) : (
        <Table sx={{ mt: 4 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Owner</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.map((debt) => (
              <TableRow key={debt.id}>
                <TableCell>{debt.title}</TableCell>
                <TableCell>{debt.status}</TableCell>
                <TableCell>{debt.priority}</TableCell>
                <TableCell>{debt.owner?.name || "—"}</TableCell>
                <TableCell>{formatDate(debt.dueDate)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleDialogOpen(debt)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(debt.id)}
                  >
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
          {isEditMode ? "Edit Technical Debt" : "Add New Technical Debt"}
        </DialogTitle>
        <DialogContent>
          <AppTextField
            name="title"
            label="Title"
            fullWidth
            margin="normal"
            value={formData.title}
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
            value={formData.description}
            onChange={handleChange}
            required
          />
          <AppTextField
            select
            name="ownerId"
            label="Owner"
            fullWidth
            margin="normal"
            value={formData.ownerId}
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
            value={formData.priority}
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
            value={formData.status}
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
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />
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
            {submitting ? "Submitting..." : isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}