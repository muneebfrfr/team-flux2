"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import route from "@/route";
interface Deprecation {
  id: string;
  projectId: string;
  deprecatedItem: string;
  suggestedReplacement?: string;
  migrationNotes?: string;
  timelineStart: string;
  deadline: string;
  progressStatus: string;
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string };
}

export default function DeprecationListPage() {
  const [deprecations, setDeprecations] = useState<Deprecation[]>([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const router = useRouter();
  const theme = useTheme();

  async function fetch() {
    try {
      const res = await axios.get("/api/deprecations");
      setDeprecations(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deprecation?")) return;

    try {
      setDeleteLoadingId(id);
      await axios.delete(`/api/deprecations/${id}`);
      await fetch();
    } catch (error) {
      console.error(error);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleAdd = () => {
    setAddLoading(true);
    router.push(route.deprecationsNew);
  };

  const handleEdit = (id: string) => {
    setEditLoadingId(id);
    router.push(route.deprecationsEdit(id));
  };

  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" color="secondary">
          All Deprecations
        </Typography>
        <Button
          variant="contained"
          startIcon={
            addLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <AddIcon />
            )
          }
          onClick={handleAdd}
          disabled={addLoading}
          sx={{ backgroundColor: theme.palette.primary.main }}
        >
          Add
        </Button>
      </Box>

      <Paper elevation={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Replacement</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Notes</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Deadline</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Project</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Updated</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deprecations.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.deprecatedItem}</TableCell>
                <TableCell>{d.suggestedReplacement || "-"}</TableCell>
                <TableCell>{d.migrationNotes || "-"}</TableCell>
                <TableCell>
                  {new Date(d.timelineStart).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(d.deadline).toLocaleDateString()}
                </TableCell>
                <TableCell>{d.progressStatus}</TableCell>
                <TableCell>{d.project?.name || d.projectId}</TableCell>
                <TableCell>
                  {new Date(d.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(d.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleEdit(d.id)}
                    sx={{ color: theme.palette.primary.main }}
                    disabled={editLoadingId === d.id}
                  >
                    {editLoadingId === d.id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <EditIcon />
                    )}
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(d.id)}
                    disabled={deleteLoadingId === d.id}
                  >
                    {deleteLoadingId === d.id ? (
                      <CircularProgress size={20} color="error" />
                    ) : (
                      <DeleteIcon />
                    )}
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
