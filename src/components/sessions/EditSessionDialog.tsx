"use client";

import React, { useState, useEffect } from "react";
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
import SaveIcon from "@mui/icons-material/Save";

import AppTextField from "@/components/ui/AppTextField";
import { User, GrowthSession, SessionFormData } from "@/app/(authenticated)/sessions/types";

interface EditSessionDialogProps {
  open: boolean;
  session: GrowthSession | null;
  onClose: () => void;
  users: User[];
  usersLoading: boolean;
  onSessionUpdated: (session: GrowthSession) => void;
}

const EditSessionDialog: React.FC<EditSessionDialogProps> = ({
  open,
  session,
  onClose,
  users,
  usersLoading,
  onSessionUpdated,
}) => {
  const [formData, setFormData] = useState<SessionFormData>({
    topic: "",
    presenterId: "",
    scheduledTime: "",
    notes: "",
  });

  useEffect(() => {
    if (session) {
      setFormData({
        topic: session.topic,
        presenterId: session.presenterId,
        scheduledTime: session.scheduledTime.slice(0, 16),
        notes: session.notes || "",
      });
    }
  }, [session]);

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

  const updateSession = async () => {
    if (
      !session ||
      !formData.topic ||
      !formData.presenterId ||
      !formData.scheduledTime
    ) {
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
      };

      const res = await axios.put(`/api/sessions/${session.id}`, requestBody);

      if (res.data?.data) {
        onSessionUpdated(res.data.data);
        toast.success("Session updated successfully");
        resetForm();
      } else {
        console.error("Update session failed:", res.data);
        toast.error(res.data?.message || "Failed to update session");
      }
    } catch (err) {
      console.error("Failed to update session:", err);
      toast.error("Network error: Failed to update session");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Growth Session</DialogTitle>
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
            label="Session Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            multiline
            rows={4}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={updateSession}
          variant="contained"
          startIcon={<SaveIcon />}
        >
          Update Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSessionDialog;
