"use client";

import {
  Box,
  Button,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import route from "@/route";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Project = {
  id: string;
  name: string;
  description: string;
  color?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );
  const router = useRouter();

  const fetchProjects = async () => {
    const res = await axios.get("/api/projects");
    setProjects(res.data.data);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProjectId) return;
    await axios.delete(`/api/projects/${selectedProjectId}`);
    setDeleteDialogOpen(false);
    setSelectedProjectId(null);
    fetchProjects();
  };

  const handleOpenDeleteDialog = (id: string) => {
    setSelectedProjectId(id);
    setDeleteDialogOpen(true);
  };

  const handleCreateProject = () => {
    setCreating(true);
    router.push(route.projectsNew);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Box p={4}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">All Projects</Typography>
        <Button
          variant="contained"
          startIcon={!creating ? <AddIcon /> : null}
          onClick={handleCreateProject}
          disabled={creating}
        >
          {creating ? "Create New Project" : "Create New Project"}
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project.id}
                hover
                onClick={() => router.push(`/projects/${project.id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  {project.color && (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: project.color,
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <Link
                    href={`/projects/${project.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDeleteDialog(project.id);
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

      {/* Custom Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
