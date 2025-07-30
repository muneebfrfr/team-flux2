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
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import AppTextField from "@/components/ui/AppTextField";
import {
  User,
  ActionItem,
  ActionItemFormData,
  statusColors,
  statusLabels,
} from "@/app/(authenticated)/sessions/types";

interface NotesDialogProps {
  open: boolean;
  sessionId: string;
  sessionTopic: string;
  notes: string;
  actionItems: ActionItem[];
  onClose: () => void;
  users: User[];
  onNotesUpdated: (
    sessionId: string,
    notes: string,
    actionItems: ActionItem[]
  ) => void;
}

const NotesDialog: React.FC<NotesDialogProps> = ({
  open,
  sessionId,
  sessionTopic,
  notes: initialNotes,
  actionItems: initialActionItems,
  onClose,
  users,
  onNotesUpdated,
}) => {
  const [notes, setNotes] = useState(initialNotes);
  const [actionItems, setActionItems] =
    useState<ActionItem[]>(initialActionItems);
  const [newActionItem, setNewActionItem] = useState<ActionItemFormData>({
    description: "",
    assignedTo: "",
    status: "open",
    dueDate: "",
  });

  React.useEffect(() => {
    setNotes(initialNotes);
    setActionItems(initialActionItems);
  }, [initialNotes, initialActionItems]);

  const getUserName = (userId: string) => {
    if (!userId) return "Unassigned";
    const user = users.find((u) => u.id === userId);
    return user?.name || `User ID: ${userId}`;
  };

  const addActionItem = () => {
    if (
      !newActionItem.description ||
      !newActionItem.assignedTo ||
      !newActionItem.dueDate
    ) {
      toast.error(
        "Please fill all action item fields (Description, Assign To, Due Date)"
      );
      return;
    }

    const actionItem: ActionItem = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      description: newActionItem.description,
      assignedTo: newActionItem.assignedTo,
      status: newActionItem.status,
      dueDate: new Date(newActionItem.dueDate).toISOString(),
    };

    setActionItems((prev) => [...prev, actionItem]);

    setNewActionItem({
      description: "",
      assignedTo: "",
      status: "open",
      dueDate: "",
    });

    toast.success("Action item added");
  };

  const removeActionItem = (index: number) => {
    setActionItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateNotes = async () => {
    try {
      await axios.put(`/api/sessions/${sessionId}/notes`, {
        notes,
        actionItems,
      });

      toast.success("Notes and action items updated successfully");
      onNotesUpdated(sessionId, notes, actionItems);
    } catch (err) {
      console.error("Failed to update notes:", err);
      toast.error("Failed to update notes");
    }
  };

  const handleClose = () => {
    setNotes(initialNotes);
    setActionItems(initialActionItems);
    setNewActionItem({
      description: "",
      assignedTo: "",
      status: "open",
      dueDate: "",
    });
    onClose();
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
        Manage Notes &amp; Action Items - &quot;{sessionTopic}&quot;
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Session Notes
            </Typography>
            <AppTextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={8}
              fullWidth
              placeholder="Document key discussions, insights, and resources shared during the session..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Action Items
            </Typography>
            <Stack spacing={2}>
              {/* Add New Action Item Form */}
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Add New Action Item
                </Typography>
                <Stack spacing={2}>
                  <AppTextField
                    label="Description"
                    value={newActionItem.description}
                    onChange={(e) =>
                      setNewActionItem((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    fullWidth
                    size="small"
                    placeholder="What needs to be done?"
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel>Assign To</InputLabel>
                    <Select
                      value={newActionItem.assignedTo}
                      onChange={(e) =>
                        setNewActionItem((prev) => ({
                          ...prev,
                          assignedTo: e.target.value,
                        }))
                      }
                      label="Assign To"
                      disabled={users.length === 0}
                    >
                      {users.length === 0 ? (
                        <MenuItem disabled>No users available</MenuItem>
                      ) : (
                        users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                  <Box display="flex" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={newActionItem.status}
                        onChange={(e) =>
                          setNewActionItem((prev) => ({
                            ...prev,
                            status: e.target.value as
                              | "open"
                              | "in_progress"
                              | "done",
                          }))
                        }
                        label="Status"
                      >
                        <MenuItem value="open">Open</MenuItem>
                        <MenuItem value="in_progress">In Progress</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </Select>
                    </FormControl>
                    <AppTextField
                      label="Due Date"
                      type="date"
                      value={newActionItem.dueDate}
                      onChange={(e) =>
                        setNewActionItem((prev) => ({
                          ...prev,
                          dueDate: e.target.value,
                        }))
                      }
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                  <Button
                    onClick={addActionItem}
                    variant="outlined"
                    startIcon={<AddIcon />}
                  >
                    Add Action Item
                  </Button>
                </Stack>
              </Card>

              {/* Existing Action Items */}
              {actionItems.map((item, index) => (
                <Card key={index} variant="outlined" sx={{ p: 2 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    mb={1}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight="medium"
                      sx={{ flex: 1 }}
                    >
                      {item.description}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeActionItem(index)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Chip
                        label={statusLabels[item.status]}
                        color={statusColors[item.status]}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {getUserName(item.assignedTo)}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions  sx={{ paddingRight: 3, paddingBottom: 2 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={updateNotes}
          variant="contained"
          startIcon={<SaveIcon />}
          color="secondary"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesDialog;
