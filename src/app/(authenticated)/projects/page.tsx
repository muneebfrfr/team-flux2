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

import axios from "axios";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import AppTextField from "@/components/ui/AppTextField";
import ProjectFormDialog from "@/components/Project/ProjectFormDialog";
import { ProjectFormValues } from "@/components/Project/ProjectForm";
import toast from "react-hot-toast";

type Project = {
  id: string;
  name: string;
  description: string;
  color?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects");
      setProjects(res.data.data);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    try {
      await axios.delete(`/api/projects/${selectedProject.id}`);
      toast.success("Project deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      setConfirmInput("");
      fetchProjects();
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const handleCreateSubmit = async (data: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      await axios.post("/api/projects", data);
      toast.success("Project created successfully");
      setCreateDialogOpen(false);
      fetchProjects();
    } catch {
      toast.error("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: ProjectFormValues) => {
    if (!selectedProject) return;
    try {
      setIsSubmitting(true);
      await axios.put(`/api/projects/${selectedProject.id}`, data);
      toast.success("Project updated successfully");
      setEditDialogOpen(false);
      setSelectedProject(null);
      fetchProjects();
    } catch {
      toast.error("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setConfirmInput("");
    setDeleteDialogOpen(true);
  };

  const handleOpenEditDialog = (project: Project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
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
        <Typography variant="h4" fontWeight={600}>
          All Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          disabled={isSubmitting}
          color="secondary"
        >
          Create New Project
        </Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Color</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">
                Actions
              </TableCell>
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
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditDialog(project);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
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

      {/* Create Project Dialog */}
      <ProjectFormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateSubmit}
        isSubmitting={isSubmitting}
        title="Create New Project"
        submitButtonText="Create"
      />

      {/* Edit Project Dialog */}
      {selectedProject && (
        <ProjectFormDialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedProject(null);
          }}
          defaultValues={selectedProject}
          onSubmit={handleEditSubmit}
          isSubmitting={isSubmitting}
          title="Edit Project"
          submitButtonText="Update"
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 5,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "#fff",
            backgroundColor: "secondary.main",
            paddingY: 2,
            paddingX: 3,
          }}
        >
          Delete Project
        </DialogTitle>
        <DialogContent>
          <Typography mb={3} mt={3}>
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
          sx={{ mt: 3 }}
            fullWidth
            variant="outlined"
            size="small"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            placeholder={`Type "${selectedProject?.name}" to confirm`}
          />
        </DialogContent>

        <DialogActions sx={{ paddingRight: 3, paddingBottom: 2 }}>
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
