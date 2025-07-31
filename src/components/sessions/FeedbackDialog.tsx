"use client";

import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";

import AppTextField from "@/components/ui/AppTextField";
import { User } from "@/app/(authenticated)/sessions/types";

interface FeedbackDialogProps {
  open: boolean;
  sessionId: string;
  sessionTopic: string;
  onClose: () => void;
  users: User[];
  onFeedbackSubmitted: (sessionId: string) => void;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  sessionId,
  sessionTopic,
  onClose,
  users,
  onFeedbackSubmitted,
}) => {
  const [newFeedback, setNewFeedback] = useState({
    userId: "",
    rating: 0,
    comments: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setNewFeedback({ userId: "", rating: 0, comments: "" });
  };

  const handleClose = () => {
    if (!submitting) {
      resetForm();
      onClose();
    }
  };

  const submitFeedback = async () => {
    if (!newFeedback.userId || newFeedback.rating === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);
      await axios.post(`/api/sessions/${sessionId}/feedbacks`, newFeedback);
      toast.success("Feedback submitted successfully");

      // Call the callback to update parent state
      onFeedbackSubmitted(sessionId);

      // Reset form and close dialog
      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 5,
        },
      }}
      fullWidth
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: "secondary.main",
          paddingY: 2,
          paddingX: 3,
        }}
      >
        Submit Feedback - &quot;{sessionTopic}&quot;
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 3, minWidth: 400 }}>
          <FormControl fullWidth required>
            <InputLabel>Your Name</InputLabel>
            <Select
              value={newFeedback.userId}
              onChange={(e) =>
                setNewFeedback((prev) => ({
                  ...prev,
                  userId: e.target.value,
                }))
              }
              label="Your Name"
              disabled={users.length === 0 || submitting}
            >
              {users.length === 0 ? (
                <MenuItem disabled>No users available</MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} {user.email && `(${user.email})`}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          <Box>
            <Typography component="legend" gutterBottom>
              Session Rating *
            </Typography>
            <Rating
              value={newFeedback.rating}
              onChange={(_, value) =>
                setNewFeedback((prev) => ({ ...prev, rating: value || 0 }))
              }
              size="large"
              disabled={submitting}
            />
          </Box>
          <AppTextField
            label="Comments (Optional)"
            value={newFeedback.comments}
            onChange={(e) =>
              setNewFeedback((prev) => ({
                ...prev,
                comments: e.target.value,
              }))
            }
            multiline
            rows={4}
            fullWidth
            disabled={submitting}
            placeholder="Share your thoughts about the session, what you learned, suggestions for improvement..."
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ paddingRight: 3, paddingBottom: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={submitFeedback}
          variant="contained"
          color="secondary"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={20} /> : null}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
