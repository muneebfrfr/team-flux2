// /app/projects/[id]/debt/page.tsx
"use client";

import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDebtPage() {
  const params = useParams() as Record<string, string | string[]>;
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [debts, setDebts] = useState([]);
  const [project, setProject] = useState<any>(null);

  const fetchData = async () => {
    const [projectRes, debtRes] = await Promise.all([
      axios.get(`/api/projects/${id}`),
      axios.get(`/api/technical-debt/${id}/debt`),
    ]);
    setProject(projectRes.data.data);
    setDebts(debtRes.data.data);
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "error";
      case "Medium": return "warning";
      case "Low": return "success";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "info";
      case "in-review": return "warning";
      case "closed": return "success";
      default: return "default";
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>Technical Debt for Project</Typography>
      {project && (
        <Box mb={3}>
          <Typography variant="h6">{project.name}</Typography>
          <Typography color="text.secondary">{project.description}</Typography>
        </Box>
      )}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debts.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Chip label={item.priority} color={getPriorityColor(item.priority)} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={item.status} color={getStatusColor(item.status)} size="small" />
                </TableCell>
                <TableCell>{item.owner?.name || "Unassigned"}</TableCell>
                <TableCell>{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "-"}</TableCell>
                <TableCell align="right">
                  <Link href={`/technical-debt/${item.id}/edit`}>
                    <IconButton color="primary"><EditIcon /></IconButton>
                  </Link>
                  <IconButton
                    color="error"
                    onClick={async () => {
                      if (confirm("Are you sure you want to delete this item?")) {
                        await axios.delete(`/api/technical-debt/${item.id}`);
                        fetchData();
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
