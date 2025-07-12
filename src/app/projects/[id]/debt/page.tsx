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
  TextField,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ProjectDebtPage() {
  const { id } = useParams();
  const [debts, setDebts] = useState([]);
  const [project, setProject] = useState<any>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  const fetchData = async () => {
    const [projectRes, debtRes] = await Promise.all([
      axios.get(`/api/projects/${id}`),
      axios.get(`/api/technical-debt/${id}`),
    ]);
    setProject(projectRes.data.data);
    setDebts(debtRes.data.data);
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "info";
      case "in-review":
        return "warning";
      case "closed":
        return "success";
      default:
        return "default";
    }
  };

  const filteredDebts = debts.filter((item: any) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = !priorityFilter || item.priority === priorityFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesOwner = !ownerFilter || item.owner?.name === ownerFilter;
    return matchesSearch && matchesPriority && matchesStatus && matchesOwner;
  });

  const uniqueOwners = Array.from(new Set(debts.map((d: any) => d.owner?.name).filter(Boolean)));

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Technical Debt for Project
      </Typography>

      {project && (
        <Box mb={3}>
          <Typography variant="h6">{project.name}</Typography>
          <Typography color="text.secondary">{project.description}</Typography>
        </Box>
      )}

      {/* Filters */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          label="Search by Title"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          select
          label="Priority"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </TextField>
        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="open">Open</MenuItem>
          <MenuItem value="in-review">In Review</MenuItem>
          <MenuItem value="closed">Closed</MenuItem>
        </TextField>
        <TextField
          select
          label="Owner"
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="">All</MenuItem>
          {uniqueOwners.map((owner) => (
            <MenuItem key={owner} value={owner}>
              {owner}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
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
            {filteredDebts.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  <Chip
                    label={item.priority}
                    color={getPriorityColor(item.priority)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={getStatusColor(item.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{item.owner?.name || "Unassigned"}</TableCell>
                <TableCell>
                  {item.dueDate
                    ? new Date(item.dueDate).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell align="right">
                  <Link href={`/technical-debt/${item.id}/edit`}>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="error"
                    onClick={async () => {
                      if (
                        confirm("Are you sure you want to delete this item?")
                      ) {
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
