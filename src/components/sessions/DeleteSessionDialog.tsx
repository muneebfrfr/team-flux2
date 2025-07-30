import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

interface DeleteSessionDialogProps {
  open: boolean;
  sessionId: string;
  sessionTopic: string;
  onClose: () => void;
  onSessionDeleted: (sessionId: string) => void;
}

const DeleteSessionDialog: React.FC<DeleteSessionDialogProps> = ({
  open,
  sessionId,
  sessionTopic,
  onClose,
  onSessionDeleted,
}) => {
  const deleteSession = async () => {
    try {
      await axios.delete(`/api/sessions/${sessionId}`);
      onSessionDeleted(sessionId);
      toast.success("Session deleted successfully");
    } catch (err) {
      console.error("Failed to delete session:", err);
      toast.error("Failed to delete session");
    }
  };

  return (
    <Dialog
      PaperProps={{
        sx: {
          borderRadius: 5,
        },
      }}
      open={open}
      onClose={onClose}
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
        Delete Growth Session
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This action cannot be undone.
        </Alert>
        <Typography>
          Are you sure you want to delete the session{" "}
          <strong>&quot;{sessionTopic}&quot;</strong>? All associated notes,
          action items, and feedback will be permanently removed.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ paddingRight: 3, paddingBottom: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={deleteSession} color="error" variant="contained">
          Delete Session
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSessionDialog;
