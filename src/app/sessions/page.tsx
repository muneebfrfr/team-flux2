"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";

interface Session {
  id: string;
  topic: string;
  description?: string;
  time: string;
  presenter: {
    name: string;
  };
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setSessions(data.data);
      })
      .catch((err) => console.error("Failed to fetch sessions:", err));
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Sessions
        </Typography>
        <Link href="/sessions/create" passHref>
          <Button variant="contained" color="primary">
            Create Session
          </Button>
        </Link>
      </Box>

      <Box mt={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Topic</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Presenter</strong></TableCell>
                <TableCell><strong>Time</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.topic}</TableCell>
                  <TableCell>
                    {session.description || "No description"}
                  </TableCell>
                  <TableCell>{session.presenter?.name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(session.time).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/sessions/${session.id}/edit`} passHref>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}