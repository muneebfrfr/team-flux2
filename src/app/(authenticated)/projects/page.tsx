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
import AppTextField from "@/components/ui/AppTextField";

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const router = useRouter();

  const fetchProjects = async () => {
    const res = await axios.get("/api/projects");
    setProjects(res.data.data);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    await axios.delete(`/api/projects/${selectedProject.id}`);
    setDeleteDialogOpen(false);
    setSelectedProject(null);
    setConfirmInput("");
    fetchProjects();
  };

  const handleOpenDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setConfirmInput("");
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
          startIcon={<AddIcon />}
          onClick={handleCreateProject}
          disabled={creating}
        >
          Create New Project
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
                      handleOpenDeleteDialog(project);
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
            padding: 2,
          },
        }}
      >
        <DialogTitle fontWeight="bold">Delete Project</DialogTitle>
        <DialogContent>
          <Typography mb={2}>
            Are you sure you want to delete{" "}
            <strong>&quot;{selectedProject?.name}&quot;</strong>? <br />
            <br />
            <strong>Note:</strong> All related Technical Debts and Deprecations
            will also be deleted.
          </Typography>

          <Typography variant="body2" gutterBottom>
            Please type <strong>{selectedProject?.name}</strong> to confirm:
          </Typography>

          <AppTextField
            fullWidth
            variant="outlined"
            size="small"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={`Type "${selectedProject?.name}" to confirm`}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={confirmInput !== selectedProject?.name}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
