"use client";

import ThemeRegistry from "@/components/ThemeRegistry"; // Adjust path to match your project structure
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import toast from "react-hot-toast";

import {
  Edit,
  Delete,
  SwapHoriz as ConvertIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import AppTextField from "@/components/ui/AppTextField";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import DeleteConfirmationDialog from "../DeleteConfirmationDialog";

interface Comment {
  id: string;
  message: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface TechnicalDebt {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  priority: "Low" | "Medium" | "High";
  status: "open" | "in_review" | "closed";
  dueDate: string;
  owner?: {
    id: string;
    name: string;
  };
  comments?: Comment[];
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
  return (
    <ThemeRegistry>
      <TechnicalDebtContent projectId={projectId} />
    </ThemeRegistry>
  );
}

function TechnicalDebtContent({ projectId }: Props) {
  const [debts, setDebts] = useState<TechnicalDebt[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [formData, setFormData] = useState<TechnicalDebt>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedDebtId, setSelectedDebtId] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { data: session } = useSession();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [debtToDelete, setDebtToDelete] = useState<string | null>(null);

  const [selectedDebtForConvert, setSelectedDebtForConvert] =
    useState<TechnicalDebt | null>(null);
  const [convertData, setConvertData] = useState({
    deprecatedItem: "",
    suggestedReplacement: "",
    migrationNotes: "",
    timelineStart: "",
    deadline: "",
  });
  const [converting, setConverting] = useState(false);

  const fetchTechnicalDebts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/projects/${projectId}/technical-debt`);
      setDebts(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to fetch technical debts", err);
      toast.error("Failed to fetch technical debts");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchUsers = useCallback(async () => {
    try {
      const userRes = await axios.get("/api/get-users");
      setUsers(
        Array.isArray(userRes.data.data) ? userRes.data.data : userRes.data
      );
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast.error("Failed to fetch users");
    }
  }, []);

  const fetchComments = useCallback(async (debtId: string) => {
    try {
      const res = await axios.get(`/api/technical-debt/${debtId}/comments`);
      setComments(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch comments", err);
      toast.error("Failed to fetch comments");
    }
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchTechnicalDebts();
      fetchUsers();
    }
  }, [projectId, fetchTechnicalDebts, fetchUsers]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      if (isEditMode && formData.id) {
        await axios.put(`/api/technical-debt/${formData.id}`, formData);
        toast.success("Technical debt updated successfully");
      } else {
        await axios.post("/api/technical-debt", {
          ...formData,
          projectId,
        });
        toast.success("Technical debt created successfully");
      }
      setFormOpen(false);
      await fetchTechnicalDebts();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error || "Failed to submit";
        setSubmitError(errorMsg);
        toast.error(errorMsg);
      } else {
        setSubmitError("Failed to submit");
        toast.error("Failed to submit technical debt");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertOpen = (debt: TechnicalDebt) => {
    setSelectedDebtForConvert(debt);

    const generateDeprecatedItem = (title: string) => {
      if (
        title.toLowerCase().includes("add") ||
        title.toLowerCase().includes("implement")
      ) {
        return title
          .replace(/add|implement/gi, "Remove old")
          .replace(/library|framework/gi, "approach");
      }
      if (title.toLowerCase().includes("upgrade")) {
        return title.replace("upgrade", "Remove old version of");
      }
      return `Legacy approach replaced by: ${title}`;
    };

    setConvertData({
      deprecatedItem: generateDeprecatedItem(debt.title),
      suggestedReplacement: debt.title,
      migrationNotes: `Migration from technical debt: ${debt.description}`,
      timelineStart: new Date().toISOString().split("T")[0],
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    });

    setConvertOpen(true);
  };

  const handleConvertSubmit = async () => {
    if (!selectedDebtForConvert) return;

    setConverting(true);
    try {
      await axios.post(
        `/api/technical-debt/${selectedDebtForConvert.id}/convert-to-deprecation`,
        {
          ...convertData,
          projectId,
        }
      );

      setConvertOpen(false);
      setSelectedDebtForConvert(null);
      await fetchTechnicalDebts();

      toast.success(
        `Successfully converted technical debt to deprecation: "${convertData.deprecatedItem}"`
      );
    } catch (error) {
      console.error("Failed to convert technical debt", error);
      if (axios.isAxiosError(error)) {
        toast.error(
          `Failed to convert: ${error.response?.data?.error || "Unknown error"}`
        );
      } else {
        toast.error("Failed to convert technical debt. Please try again.");
      }
    } finally {
      setConverting(false);
    }
  };

  const handleConvertChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setConvertData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCommentsOpen = async (debtId: string) => {
    setSelectedDebtId(debtId);
    await fetchComments(debtId);
    setCommentsOpen(true);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !session?.user?.id) return;

    try {
      const res = await axios.post(
        `/api/technical-debt/${selectedDebtId}/comments`,
        {
          message: newComment,
          userId: session.user.id,
        }
      );

      setComments((prev) => [...prev, res.data.data]);
      setNewComment("");
      await fetchTechnicalDebts();
      toast.success("Comment added successfully");
    } catch (error) {
      console.error("Failed to post comment", error);
      toast.error("Failed to post comment");
    }
  };

  const handleDeleteClick = (id: string) => {
    setDebtToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!debtToDelete) return;

    try {
      await axios.delete(`/api/technical-debt/${debtToDelete}`);
      await fetchTechnicalDebts();
      toast.success("Technical debt deleted successfully");
    } catch (error) {
      console.error("Failed to delete technical debt", error);
      toast.error("Failed to delete technical debt");
    } finally {
      setDeleteDialogOpen(false);
      setDebtToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDebtToDelete(null);
  };

  const formatDate = (str: string) =>
    str ? new Date(str).toLocaleDateString("en-GB") : "—";

  const formatDateTime = (str: string) =>
    str ? new Date(str).toLocaleString() : "—";

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
                <TableCell>
                  <Chip
                    label={debt.status}
                    size="small"
                    color={
                      debt.status === "closed"
                        ? "success"
                        : debt.status === "in_review"
                        ? "warning"
                        : "default"
                    }
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={debt.priority}
                    size="small"
                    color={
                      debt.priority === "High"
                        ? "error"
                        : debt.priority === "Medium"
                        ? "warning"
                        : "default"
                    }
                  />
                </TableCell>
                <TableCell>{debt.owner?.name || "—"}</TableCell>
                <TableCell>{formatDate(debt.dueDate)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    title="Edit"
                    onClick={() => handleDialogOpen(debt)}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    title="Comments"
                    onClick={() => handleCommentsOpen(debt.id)}
                    color="primary"
                    sx={{ mx: 1 }}
                  >
                    <CommentIcon fontSize="small" />
                    {debt.comments && debt.comments.length > 0 && (
                      <Box
                        component="span"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          bgcolor: "primary.main",
                          color: "white",
                          borderRadius: "50%",
                          width: 16,
                          height: 16,
                          fontSize: "0.6rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {debt.comments.length}
                      </Box>
                    )}
                  </IconButton>
                  {debt.status !== "closed" && (
                    <IconButton
                      size="small"
                      title="Convert to Deprecation"
                      onClick={() => handleConvertOpen(debt)}
                      color="secondary"
                      sx={{
                        bgcolor: "secondary.light",
                        mx: 1,
                        "&:hover": {
                          bgcolor: "secondary.main",
                          color: "white",
                        },
                      }}
                    >
                      <ConvertIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    title="Delete"
                    color="error"
                    onClick={() => handleDeleteClick(debt.id)}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  <DeleteConfirmationDialog
                    open={deleteDialogOpen}
                    onClose={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title="Delete Technical Debt"
                    message="Are you sure you want to delete this technical debt item? This action cannot be undone."
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
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
            <MenuItem value="in_review">In Review</MenuItem>
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
          <Button onClick={() => setFormOpen(false)} disabled={submitting}>
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

      <Dialog
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Convert Technical Debt to Deprecation</DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Converting:</strong> {selectedDebtForConvert?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This will create a new deprecation item and mark the technical
              debt as completed.
            </Typography>
          </Alert>

          <AppTextField
            name="deprecatedItem"
            label="What is being deprecated?"
            fullWidth
            margin="normal"
            value={convertData.deprecatedItem}
            onChange={handleConvertChange}
            required
            helperText="What old approach/library/method is now deprecated?"
          />

          <AppTextField
            name="suggestedReplacement"
            label="Suggested Replacement"
            fullWidth
            margin="normal"
            value={convertData.suggestedReplacement}
            onChange={handleConvertChange}
            helperText="What should be used instead?"
          />

          <AppTextField
            name="migrationNotes"
            label="Migration Notes"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={convertData.migrationNotes}
            onChange={handleConvertChange}
            helperText="Steps or notes for migrating from the deprecated item"
          />

          <Box display="flex" gap={2}>
            <AppTextField
              name="timelineStart"
              label="Deprecation Start Date"
              type="date"
              fullWidth
              margin="normal"
              value={convertData.timelineStart}
              onChange={handleConvertChange}
              InputLabelProps={{ shrink: true }}
              required
              helperText="When does the deprecation period begin?"
            />

            <AppTextField
              name="deadline"
              label="Removal Deadline"
              type="date"
              fullWidth
              margin="normal"
              value={convertData.deadline}
              onChange={handleConvertChange}
              InputLabelProps={{ shrink: true }}
              required
              helperText="When must the deprecated item be fully removed?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConvertOpen(false)} disabled={converting}>
            Cancel
          </Button>
          <Button
            onClick={handleConvertSubmit}
            variant="contained"
            disabled={converting}
            startIcon={<ConvertIcon />}
          >
            {converting ? "Converting..." : "Convert to Deprecation"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Comments</DialogTitle>
        <DialogContent>
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {comments.length === 0 ? (
              <Alert severity="info">No comments yet</Alert>
            ) : (
              comments.map((comment) => (
                <ListItem key={comment.id} alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar src={comment.user.image} alt={comment.user.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.user.name}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          {comment.message}
                        </Typography>
                        <Typography
                          component="div"
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatDateTime(comment.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))
            )}
          </List>

          {session?.user && (
            <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center" }}>
              <Avatar
                src={session.user.image || undefined}
                alt={session.user.name || "User"}
              />
              <TextField
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentsOpen(false)}>Close</Button>
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
