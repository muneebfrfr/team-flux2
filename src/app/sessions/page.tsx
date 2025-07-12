"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { AppHead } from "@/components/AppHeads";

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
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    fetch("/api/sessions")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setSessions(data.data);
      })
      .catch((err) => console.error("Failed to fetch sessions:", err));
  }, []);

  const toggleView = () => setIsGridView((prev) => !prev);

  return (
    <Container sx={{ mt: 4 }}>
      <AppHead title="Sessions" />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">
          Sessions
        </Typography>
        <Stack direction="row" spacing={2}>
          <IconButton onClick={toggleView} color="primary">
            {isGridView ? <ViewListIcon /> : <GridViewIcon />}
          </IconButton>
          <Link href="/sessions/create" passHref>
            <Button variant="contained" color="primary">
              Create Session
            </Button>
          </Link>
        </Stack>
      </Box>

      {isGridView ? (
        <Grid container spacing={3} mt={3}>
          {sessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session.id}>
              <Paper
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  backgroundColor: "#FF990040",
                  p: 2,
                }}
              >
                <Box>
                  <Typography variant="h6">{session.topic}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {session.description || "No description"}
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    Presenter: {session.presenter?.name || "N/A"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Time: {new Date(session.time).toLocaleString()}
                  </Typography>
                </Box>

                <Box mt={2} display="flex" justifyContent="flex-end">
                  <Link href={`/sessions/${session.id}/edit`} passHref>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </Link>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box mt={3}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Topic</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Presenter</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Time</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
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
      )}
    </Container>
  );
}
