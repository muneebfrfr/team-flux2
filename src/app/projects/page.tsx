
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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  const fetchProjects = async () => {
    const res = await axios.get("/api/projects");
    setProjects(res.data.data);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await axios.delete(`/api/projects/${id}`);
      fetchProjects();
    }
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
        <Link href="/projects/new">
          <Button variant="contained" startIcon={<AddIcon />}>
            Create New Project
          </Button>
        </Link>
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
            {projects.map((project: any) => (
              <TableRow
                key={project.id}
                hover
                onClick={() => router.push(`/projects/${project.id}/debt`)}
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
                  <Link href={`/projects/${project.id}/edit`} onClick={(e) => e.stopPropagation()}>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(project.id);
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
