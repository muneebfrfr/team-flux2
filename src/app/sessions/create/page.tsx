"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface User {
  id: string;
  name: string;
  email: string;
}

interface FormData {
  topic: string;
  description: string;
  presenterId: string;
  participantIds: string[];
  time: string;
  calendarId: string;
}

export default function SessionsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    topic: "",
    description: "",
    presenterId: "",
    participantIds: [],
    time: "",
    calendarId: "",
  });

const fetchUsers = async () => {
  try {
    const res = await axios.get("/api/get-users");
    setUsers(res.data.data); // ⬅️ Make sure you're assigning the actual array
  } catch (err) {
    console.error("Failed to fetch users", err);
  }
};

  const fetchSessions = async () => {
    try {
      const res = await axios.get("/api/sessions");
      setSessions(res.data.data);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  const handleSubmit = async () => {
    if (!form.topic || !form.presenterId || !form.time) {
      alert("Please fill in topic, presenter, and time.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        time: new Date(form.time).toISOString(),
      };

      await axios.post("/api/sessions", payload);

      await fetchSessions();
      alert("Session created successfully!");

      setForm({
        topic: "",
        description: "",
        presenterId: "",
        participantIds: [],
        time: "",
        calendarId: "",
      });
    } catch (err: any) {
      console.error("Failed to create session", err);
      alert(err?.response?.data?.message || "Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchSessions();
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Sessions
      </Typography>

      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          Create Session
        </Typography>

        <TextField
          fullWidth
          label="Topic"
          value={form.topic}
          onChange={(e) => setForm({ ...form, topic: e.target.value })}
          sx={{ my: 1 }}
        />

        <TextField
          fullWidth
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          sx={{ my: 1 }}
        />

        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Presenter</InputLabel>
          <Select
            value={form.presenterId}
            onChange={(e) => setForm({ ...form, presenterId: e.target.value })}
            input={<OutlinedInput label="Presenter" />}
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel>Participants</InputLabel>
          <Select
            multiple
            value={form.participantIds}
            onChange={(e) => {
              const value = e.target.value;
              setForm({
                ...form,
                participantIds: Array.isArray(value) ? value : [],
              });
            }}
            input={<OutlinedInput label="Participants" />}
            renderValue={(selected) =>
              users
                .filter((u) => selected.includes(u.id))
                .map((u) => u.name)
                .join(", ")
            }
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                <Checkbox checked={form.participantIds.includes(user.id)} />
                <ListItemText primary={user.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Time"
          type="datetime-local"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          sx={{ my: 1 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          fullWidth
          label="Calendar ID"
          value={form.calendarId}
          onChange={(e) => setForm({ ...form, calendarId: e.target.value })}
          sx={{ my: 1 }}
        />

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Create Session"
          )}
        </Button>
      </Box>
    </Box>
  );
}
