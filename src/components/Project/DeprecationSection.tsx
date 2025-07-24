"use client";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  MenuItem,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Edit,
  Delete,
  Link as LinkIcon,
  Close as UnlinkIcon,
  Assignment as DebtIcon,
} from "@mui/icons-material";
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
  linkedTechnicalDebtIds: string[];
  linkedTechnicalDebts?: TechnicalDebt[];
}

interface TechnicalDebt {
  id: string;
  title: string;
  status: string;
  priority: string;
  owner?: {
    name: string;
  };
}

const defaultFormData: Deprecation = {
  id: "",
  deprecatedItem: "",
  suggestedReplacement: "",
  migrationNotes: "",
  timelineStart: "",
  deadline: "",
  progressStatus: "NOT_STARTED",
  linkedTechnicalDebtIds: [],
};

export default function DeprecationSection({
  projectId,
}: {
  projectId: string;
}) {
  const [deprecations, setDeprecations] = useState<Deprecation[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Deprecation>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  // Linking state
  const [selectedDeprecationId, setSelectedDeprecationId] =
    useState<string>("");
  const [availableTechnicalDebts, setAvailableTechnicalDebts] = useState<
    TechnicalDebt[]
  >([]);
  const [selectedTechDebtIds, setSelectedTechDebtIds] = useState<string[]>([]);

  const fetchDeprecations = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/deprecations`);
      const deprecationsData = Array.isArray(res.data) ? res.data : [];

      // Fetch linked technical debt details for each deprecation
      const enrichedDeprecations = await Promise.all(
        deprecationsData.map(async (dep) => {
          if (
            dep.linkedTechnicalDebtIds &&
            dep.linkedTechnicalDebtIds.length > 0
          ) {
            try {
              const techDebtRes = await axios.post(
                "/api/technical-debt/batch-get",
                {
                  ids: dep.linkedTechnicalDebtIds,
                }
              );
              return {
                ...dep,
                linkedTechnicalDebts: techDebtRes.data.data || [],
              };
            } catch {
              console.error(
                "Failed to fetch linked technical debts for",
                dep.id
              );
              return { ...dep, linkedTechnicalDebts: [] };
            }
          }
          return { ...dep, linkedTechnicalDebts: [] };
        })
      );

      setDeprecations(enrichedDeprecations);
    } catch {
      console.error("Failed to fetch deprecations");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchAvailableTechnicalDebts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/technical-debt`);
      setAvailableTechnicalDebts(
        Array.isArray(res.data.data) ? res.data.data : []
      );
    } catch {
      console.error("Failed to fetch technical debts");
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchDeprecations();
      fetchAvailableTechnicalDebts();
    }
  }, [projectId, fetchDeprecations, fetchAvailableTechnicalDebts]);

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
      setFormOpen(false);
      await fetchDeprecations();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setSubmitError(err?.response?.data?.error || "Failed to submit");
      } else {
        setSubmitError("Failed to submit");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this deprecation?")) {
      try {
        await axios.delete(`/api/deprecations/${id}`);
        await fetchDeprecations();
      } catch {
        console.error("Failed to delete deprecation");
      }
    }
  };

  // Linking handlers
  const handleLinkDialogOpen = (deprecationId: string) => {
    const currentDeprecation = deprecations.find((d) => d.id === deprecationId);
    const currentLinkedIds = currentDeprecation?.linkedTechnicalDebtIds || [];

    // Filter out already linked technical debts
    const available = availableTechnicalDebts.filter(
      (td) => !currentLinkedIds.includes(td.id)
    );

    setSelectedDeprecationId(deprecationId);
    setAvailableTechnicalDebts(available);
    setSelectedTechDebtIds([]);
    setLinkDialogOpen(true);
  };

  const handleLinkSubmit = async () => {
    if (!selectedTechDebtIds.length) return;

    try {
      await axios.post(
        `/api/deprecations/${selectedDeprecationId}/link-technical-debt`,
        {
          technicalDebtIds: selectedTechDebtIds,
        }
      );

      setLinkDialogOpen(false);
      setSelectedTechDebtIds([]);
      await fetchDeprecations();
      await fetchAvailableTechnicalDebts();
    } catch {
      console.error("Failed to link technical debts");
      alert("Failed to link technical debts. Please try again.");
    }
  };

  const handleUnlink = async (deprecationId: string, techDebtId: string) => {
    if (confirm("Are you sure you want to unlink this technical debt?")) {
      try {
        await axios.delete(
          `/api/deprecations/${deprecationId}/link-technical-debt`,
          {
            data: { technicalDebtId: techDebtId },
          }
        );
        await fetchDeprecations();
        await fetchAvailableTechnicalDebts();
      } catch {
        console.error("Failed to unlink technical debt");
        alert("Failed to unlink technical debt. Please try again.");
      }
    }
  };

  const formatDate = (str: string) =>
    str ? new Date(str).toLocaleDateString("en-GB") : "—";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success";
      case "IN_PROGRESS":
        return "warning";
      default:
        return "default";
    }
  };

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
        <Box sx={{ mt: 4 }}>
          {deprecations.map((dep) => (
            <Card key={dep.id} sx={{ mb: 3 }}>
              <CardContent>
                {/* Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={2}
                >
                  <Typography variant="h6">{dep.deprecatedItem}</Typography>
                  <Box display="flex" gap={1} alignItems="center">
                    <Chip
                      label={dep.progressStatus.replace("_", " ")}
                      size="small"
                      color={getStatusColor(dep.progressStatus) as "success" | "warning" | "default"}
                    />
                    {dep.linkedTechnicalDebts &&
                      dep.linkedTechnicalDebts.length > 0 && (
                        <Chip
                          icon={<DebtIcon />}
                          label={`${dep.linkedTechnicalDebts.length} linked`}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      )}
                  </Box>
                </Box>

                {/* Details */}
                <Box mb={2}>
                  {dep.suggestedReplacement && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Replacement:</strong> {dep.suggestedReplacement}
                    </Typography>
                  )}

                  {dep.migrationNotes && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>Migration Notes:</strong> {dep.migrationNotes}
                    </Typography>
                  )}

                  <Box display="flex" gap={4}>
                    <Typography variant="body2">
                      <strong>Start:</strong> {formatDate(dep.timelineStart)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Deadline:</strong> {formatDate(dep.deadline)}
                    </Typography>
                  </Box>
                </Box>

                {/* Linked Technical Debts */}
                {dep.linkedTechnicalDebts &&
                  dep.linkedTechnicalDebts.length > 0 && (
                    <Box mb={2}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <DebtIcon fontSize="small" />
                        Linked Technical Debts:
                      </Typography>
                      <List dense sx={{ bgcolor: "grey.50", borderRadius: 1 }}>
                        {dep.linkedTechnicalDebts.map((techDebt, index) => (
                          <Box key={techDebt.id}>
                            <ListItem sx={{ py: 1 }}>
                              <ListItemText
                                primary={techDebt.title}
                                secondary={
                                  <Box component="span" display="flex" gap={2}>
                                    <Chip
                                      label={techDebt.status}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <Chip
                                      label={techDebt.priority}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <span>
                                      Owner: {techDebt.owner?.name || "—"}
                                    </span>
                                  </Box>
                                }
                              />
                              <ListItemSecondaryAction>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleUnlink(dep.id, techDebt.id)
                                  }
                                  color="error"
                                  title="Unlink Technical Debt"
                                >
                                  <UnlinkIcon fontSize="small" />
                                </IconButton>
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < dep.linkedTechnicalDebts!.length - 1 && (
                              <Divider />
                            )}
                          </Box>
                        ))}
                      </List>
                    </Box>
                  )}

                {/* Action Buttons */}
                <Box display="flex" gap={1} justifyContent="flex-end">
                  <IconButton
                    size="small"
                    title="Edit"
                    onClick={() => handleDialogOpen(dep)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Link Technical Debts"
                    onClick={() => handleLinkDialogOpen(dep.id)}
                    color="primary"
                  >
                    <LinkIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Delete"
                    color="error"
                    onClick={() => handleDelete(dep.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Deprecation Form Dialog */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
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
          <Button onClick={() => setFormOpen(false)} disabled={submitting}>
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

      {/* Link Technical Debts Dialog */}
      <Dialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Link Technical Debts to Deprecation</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Select technical debt items to link with this deprecation. This
            helps track what work is related to removing the deprecated item.
          </Alert>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Technical Debts to Link</InputLabel>
            <Select
              multiple
              value={selectedTechDebtIds}
              onChange={(e) =>
                setSelectedTechDebtIds(e.target.value as string[])
              }
              input={<OutlinedInput label="Select Technical Debts to Link" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {(selected as string[]).map((value) => {
                    const techDebt = availableTechnicalDebts.find(
                      (td) => td.id === value
                    );
                    return (
                      <Chip
                        key={value}
                        label={techDebt?.title || "Unknown"}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    );
                  })}
                </Box>
              )}
            >
              {availableTechnicalDebts.length === 0 ? (
                <MenuItem disabled>
                  <Typography color="text.secondary">
                    No available technical debts to link
                  </Typography>
                </MenuItem>
              ) : (
                availableTechnicalDebts.map((techDebt) => (
                  <MenuItem key={techDebt.id} value={techDebt.id}>
                    <Box>
                      <Typography variant="body2">{techDebt.title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Status: {techDebt.status} | Priority:{" "}
                        {techDebt.priority} | Owner:{" "}
                        {techDebt.owner?.name || "—"}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          {selectedTechDebtIds.length > 0 && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {selectedTechDebtIds.length} technical debt item(s) selected for
              linking.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLinkDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleLinkSubmit}
            variant="contained"
            disabled={!selectedTechDebtIds.length}
            startIcon={<LinkIcon />}
          >
            Link Selected ({selectedTechDebtIds.length})
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}