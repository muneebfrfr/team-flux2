// /app/technical-debt/page.tsx
"use client";

import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function TechnicalDebtPage() {
  const [debtItems, setDebtItems] = useState([]);

  const fetchDebt = async () => {
    try {
      const res = await axios.get("/api/technical-debt");
      setDebtItems(res.data.data);
    } catch (err) {
      console.error("Error fetching technical debt:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this debt item?")) {
      await axios.delete(`/api/technical-debt/${id}`);
      fetchDebt();
    }
  };

  useEffect(() => {
    fetchDebt();
  }, []);

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
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Technical Debt Tracker</Typography>
        <Link href="/technical-debt/new">
          <Button variant="contained" startIcon={<AddIcon />}>Create New</Button>
        </Link>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {debtItems.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.project?.name}</TableCell>
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
                  <IconButton color="error" onClick={() => handleDelete(item.id)}>
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
