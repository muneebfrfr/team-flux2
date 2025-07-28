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

import AppTextField from "@/components/ui/AppTextField";
import { User } from "@/app/sessions/types";

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

  const resetForm = () => {
    setNewFeedback({ userId: "", rating: 0, comments: "" });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const submitFeedback = async () => {
    if (!newFeedback.userId || newFeedback.rating === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post(`/api/sessions/${sessionId}/feedbacks`, newFeedback);
      toast.success("Feedback submitted successfully");
      onFeedbackSubmitted(sessionId);
      resetForm();
    } catch (err) {
      console.error("Failed to submit feedback:", err);
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Submit Feedback - &quot;{sessionTopic}&quot;</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1, minWidth: 400 }}>
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
              disabled={users.length === 0}
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
            placeholder="Share your thoughts about the session, what you learned, suggestions for improvement..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={submitFeedback} variant="contained">
          Submit Feedback
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog;
