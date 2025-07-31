"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AddIcon from "@mui/icons-material/Add";
import { User, GrowthSession, SessionDetails, ActionItem } from "./types";
import SessionsTable from "@/components/sessions/SessionsTable";
import CreateSessionDialog from "@/components/sessions/CreateSessionDialog";
import EditSessionDialog from "@/components/sessions/EditSessionDialog";
import DeleteSessionDialog from "@/components/sessions/DeleteSessionDialog";
import FeedbackDialog from "@/components/sessions/FeedbackDialog";
import NotesDialog from "@/components/sessions/NotesDialog";

export default function GrowthSessionsPage() {
  const [sessions, setSessions] = useState<SessionDetails[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    session: GrowthSession | null;
  }>({ open: false, session: null });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    sessionId: string;
    sessionTopic: string;
  }>({ open: false, sessionId: "", sessionTopic: "" });
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    sessionId: string;
    sessionTopic: string;
  }>({ open: false, sessionId: "", sessionTopic: "" });
  const [notesDialog, setNotesDialog] = useState<{
    open: boolean;
    sessionId: string;
    sessionTopic: string;
    notes: string;
    actionItems: ActionItem[];
  }>({
    open: false,
    sessionId: "",
    sessionTopic: "",
    notes: "",
    actionItems: [],
  });
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/sessions");
      if (res.data?.data) {
        setSessions(
          res.data.data.map((session: GrowthSession) => ({
            ...session,
            expanded: false,
            detailsLoaded: false,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
      toast.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await axios.get("/api/get-users");
      const data = res.data;

      if (data?.data && Array.isArray(data.data)) {
        setUsers(data.data);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("Invalid users API response format:", data);
        setUsers([]);
        toast.error("Failed to load users");
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      toast.error("Failed to fetch users from API");
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      const res = await axios.get(`/api/sessions/${sessionId}`);
      if (res.data?.data) {
        setSessions((prev) =>
          prev.map((session) =>
            session.id === sessionId
              ? { ...res.data.data, expanded: true, detailsLoaded: true }
              : session
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch session details:", err);
      toast.error("Failed to fetch session details");
    }
  };

  const toggleExpanded = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session) return;

    if (!session.expanded) {
      setSessions((prev) =>
        prev.map((s) => ({ ...s, expanded: s.id === sessionId }))
      );

      if (!session.detailsLoaded) {
        fetchSessionDetails(sessionId);
      }
    } else {
      setSessions((prev) =>
        prev.map((s) => (s.id === sessionId ? { ...s, expanded: false } : s))
      );
    }
  };

  const openCreateDialog = () => {
    setCreateDialog(true);
  };

  const openEditDialog = (session: GrowthSession) => {
    setEditDialog({ open: true, session });
  };

  const openNotesDialog = (session: SessionDetails) => {
    setNotesDialog({
      open: true,
      sessionId: session.id,
      sessionTopic: session.topic,
      notes: session.notes || "",
      actionItems: session.actionItems || [],
    });
  };

  useEffect(() => {
    console.log("Component mounted, fetching data...");
    fetchSessions();
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Growth Sessions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Schedule and manage knowledge-sharing sessions for continuous
            learning
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
        >
          Schedule Session
        </Button>
      </Box>

      <SessionsTable
        sessions={sessions}
        users={users}
        onToggleExpanded={toggleExpanded}
        onEdit={openEditDialog}
        onDelete={(sessionId, sessionTopic) =>
          setDeleteDialog({ open: true, sessionId, sessionTopic })
        }
        onFeedback={(sessionId, sessionTopic) =>
          setFeedbackDialog({ open: true, sessionId, sessionTopic })
        }
        onNotes={openNotesDialog}
      />

      <CreateSessionDialog
        open={createDialog}
        onClose={() => setCreateDialog(false)}
        users={users}
        usersLoading={usersLoading}
        onSessionCreated={(newSession) => {
          setSessions((prev) => [
            ...prev,
            { ...newSession, expanded: false, detailsLoaded: false },
          ]);
          setCreateDialog(false);
        }}
      />

      <EditSessionDialog
        open={editDialog.open}
        session={editDialog.session}
        onClose={() => setEditDialog({ open: false, session: null })}
        users={users}
        usersLoading={usersLoading}
        onSessionUpdated={(updatedSession) => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === updatedSession.id
                ? {
                    ...updatedSession,
                    expanded: session.expanded,
                    detailsLoaded: session.detailsLoaded,
                  }
                : session
            )
          );
          setEditDialog({ open: false, session: null });
        }}
      />

      <DeleteSessionDialog
        open={deleteDialog.open}
        sessionId={deleteDialog.sessionId}
        sessionTopic={deleteDialog.sessionTopic}
        onClose={() =>
          setDeleteDialog({ open: false, sessionId: "", sessionTopic: "" })
        }
        onSessionDeleted={(sessionId) => {
          setSessions((prev) =>
            prev.filter((session) => session.id !== sessionId)
          );
          setDeleteDialog({ open: false, sessionId: "", sessionTopic: "" });
        }}
      />

      <FeedbackDialog
        open={feedbackDialog.open}
        sessionId={feedbackDialog.sessionId}
        sessionTopic={feedbackDialog.sessionTopic}
        onClose={() =>
          setFeedbackDialog({ open: false, sessionId: "", sessionTopic: "" })
        }
        users={users}
        onFeedbackSubmitted={(sessionId) => {
          const session = sessions.find((s) => s.id === sessionId);
          if (session?.expanded) {
            fetchSessionDetails(sessionId);
          }
          setFeedbackDialog({ open: false, sessionId: "", sessionTopic: "" });
        }}
      />

      <NotesDialog
        open={notesDialog.open}
        sessionId={notesDialog.sessionId}
        sessionTopic={notesDialog.sessionTopic}
        notes={notesDialog.notes}
        actionItems={notesDialog.actionItems}
        onClose={() =>
          setNotesDialog({
            open: false,
            sessionId: "",
            sessionTopic: "",
            notes: "",
            actionItems: [],
          })
        }
        users={users}
        onNotesUpdated={(sessionId, notes, actionItems) => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === sessionId
                ? { ...session, notes, actionItems }
                : session
            )
          );
          setNotesDialog({
            open: false,
            sessionId: "",
            sessionTopic: "",
            notes: "",
            actionItems: [],
          });
        }}
      />
    </Container>
  );
}
