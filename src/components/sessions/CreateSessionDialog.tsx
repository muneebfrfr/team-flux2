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
import SaveIcon from "@mui/icons-material/Save";

import AppTextField from "@/components/ui/AppTextField";
import { User, GrowthSession, SessionFormData } from "@/app/sessions/types";

interface CreateSessionDialogProps {
  open: boolean;
  onClose: () => void;
  users: User[];
  usersLoading: boolean;
  onSessionCreated: (session: GrowthSession) => void;
}

const CreateSessionDialog: React.FC<CreateSessionDialogProps> = ({
  open,
  onClose,
  users,
  usersLoading,
  onSessionCreated,
}) => {
  const [formData, setFormData] = useState<SessionFormData>({
    topic: "",
    presenterId: "",
    scheduledTime: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      topic: "",
      presenterId: "",
      scheduledTime: "",
      notes: "",
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const createSession = async () => {
    if (!formData.topic || !formData.presenterId || !formData.scheduledTime) {
      toast.error(
        "Please fill all required fields (Topic, Presenter, and Scheduled Time)"
      );
      return;
    }

    try {
      const requestBody = {
        topic: formData.topic,
        presenterId: formData.presenterId,
        scheduledTime: new Date(formData.scheduledTime).toISOString(),
        notes: formData.notes || "",
        actionItems: [],
        feedback: [],
      };

      const res = await axios.post("/api/sessions", requestBody);

      if (res.data?.data) {
        onSessionCreated(res.data.data);
        toast.success("Growth session created successfully");
        resetForm();
      } else {
        console.error("Create session failed:", res.data);
        toast.error(res.data?.message || "Failed to create session");
      }
    } catch (err) {
      console.error("Failed to create session:", err);
      toast.error("Network error: Failed to create session");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Schedule New Growth Session</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <AppTextField
            label="Session Topic"
            value={formData.topic}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, topic: e.target.value }))
            }
            required
            fullWidth
            placeholder="e.g., Advanced React Patterns, API Design Best Practices"
          />
          <FormControl fullWidth required>
            <InputLabel>Presenter</InputLabel>
            <Select
              value={formData.presenterId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  presenterId: e.target.value,
                }))
              }
              label="Presenter"
              disabled={usersLoading || users.length === 0}
            >
              {users.length === 0 ? (
                <MenuItem disabled>
                  {usersLoading ? "Loading users..." : "No users available"}
                </MenuItem>
              ) : (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} {user.email && `(${user.email})`}
                  </MenuItem>
                ))
              )}
            </Select>
            {users.length === 0 && !usersLoading && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                No users found. Check your /api/users endpoint.
              </Typography>
            )}
          </FormControl>
          <AppTextField
            label="Scheduled Time"
            type="datetime-local"
            value={formData.scheduledTime}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                scheduledTime: e.target.value,
              }))
            }
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <AppTextField
            label="Session Notes (Optional)"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            multiline
            rows={4}
            fullWidth
            placeholder="Add any preparation notes, agenda items, or resources..."
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={createSession}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Schedule Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateSessionDialog;
