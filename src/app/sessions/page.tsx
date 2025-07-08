// app/sessions/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button, Container, Typography, Box, Grid, Paper } from '@mui/material';
import Link from 'next/link';

interface Session {
  id: string;
  topic: string;
  description?: string;
  time: string;
  calendarId?: string;
  presenter: {
    name: string;
  };
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetch('/api/sessions')
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) setSessions(data.data);
      })
      .catch((err) => console.error('Failed to fetch sessions:', err));
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

      <Grid container spacing={2} mt={3}>
        {sessions.map((session) => (
          <Grid item xs={12} md={6} key={session.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{session.topic}</Typography>
              <Typography variant="body2" color="text.secondary">
                {session.description || 'No description'}
              </Typography>
              <Typography variant="body2" mt={1}>
                Presenter: {session.presenter?.name || 'N/A'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Time: {new Date(session.time).toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
