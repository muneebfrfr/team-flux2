"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import route from "@/route";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface Project {
  name: string;
}

interface Owner {
  name: string;
}

interface TechnicalDebtItem {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  status: "open" | "in-review" | "closed";
  project?: Project;
  owner?: Owner;
  dueDate?: string;
}

export default function TechnicalDebtPage() {
  const [debtItems, setDebtItems] = useState<TechnicalDebtItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchDebt = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/technical-debt");
      setDebtItems(res.data.data);
    } catch (err) {
      console.error("Error fetching technical debt:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this debt item?")) {
      await axios.delete(`/api/technical-debt/${id}`);
      fetchDebt();
    }
  };

  const handleEdit = (id: string) => {
    setEditLoadingId(id);
    router.push(route.editTechnicalDebt(id));
  };

  useEffect(() => {
    fetchDebt();
  }, []);

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

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4">Technical Debt Tracker</Typography>
        <Link href={route.newTechnicalDebt}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create New"
            )}
          </Button>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : (
              debtItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.project?.name}</TableCell>
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
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(item.id)}
                      disabled={editLoadingId === item.id}
                    >
                      {editLoadingId === item.id ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        <EditIcon />
                      )}
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
