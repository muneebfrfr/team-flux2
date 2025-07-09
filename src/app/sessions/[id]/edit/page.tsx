"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { AppHead } from "@/components/AppHeads";

interface User {
  id: string;
  name: string;
}

export default function EditSessionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    topic: "",
    description: "",
    participants: [] as string[],
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch session and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sessionRes, usersRes] = await Promise.all([
          fetch(`/api/sessions/${id}`),
          fetch("/api/get-users"),
        ]);

        const sessionData = await sessionRes.json();
        const usersData = await usersRes.json();

        if (sessionData?.data) {
          const s = sessionData.data;
          setForm({
            topic: s.topic || "",
            description: s.description || "",
            participants: s.sessionMembers || [],
          });
        }
        console.log("usersData", usersData);
        if (Array.isArray(usersData?.data)) {
          setUsers(usersData.data);
        } else {
          console.warn("Users response invalid", usersData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name!]:
        name === "participants"
          ? value
          : typeof value === "string"
          ? value
          : "",
    }));
  };

  // Submit the form
  const handleSubmit = async () => {
    try {
      console.log(" JSON.stringify(form)", JSON.stringify(form));
      const res = await fetch(`/api/sessions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push("/sessions");
      } else {
        alert("Failed to update session");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <>
      <AppHead title="Edit Session" />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Session
        </Typography>

        <Box component="form" noValidate autoComplete="off">
          <TextField
            fullWidth
            margin="normal"
            label="Topic"
            name="topic"
            value={form.topic}
            onChange={handleChange}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel id="participants-label">Participants</InputLabel>
            <Select
              labelId="participants-label"
              multiple
              name="participants"
              value={form.participants}
              onChange={handleChange}
              input={<OutlinedInput label="Participants" />}
              renderValue={(selected) =>
                users
                  .filter((u) => selected.includes(u.id))
                  .map((u) => u.name)
                  .join(", ")
              }
            >
              {users.length > 0 ? (
                users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Checkbox checked={form.participants.includes(user.id)} />
                    <ListItemText primary={user.name} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No users found</MenuItem>
              )}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Save Changes
          </Button>
        </Box>
      </Container>
    </>
  );
}
