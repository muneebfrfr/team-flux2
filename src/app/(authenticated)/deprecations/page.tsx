"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  IconButton,
  CircularProgress,
  Chip,
  Typography,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import route from "@/route";
import DataTablePage from "@/components/common/DataTablePage";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { MUIDataTableMeta } from "mui-datatables";
import toast from "react-hot-toast";

interface Deprecation {
  id: string;
  projectId: string;
  deprecatedItem: string;
  suggestedReplacement?: string;
  migrationNotes?: string;
  timelineStart: string;
  deadline: string;
  progressStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  project?: { id: string; name: string };
}

export default function DeprecationListPage() {
  const [deprecations, setDeprecations] = useState<Deprecation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editLoadingId, setEditLoadingId] = useState<string | null>(null);
  const router = useRouter();

  async function fetchDeprecations() {
    setLoading(true);
    try {
      const res = await axios.get("/api/deprecations");
      setDeprecations(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch deprecations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDeprecations();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoadingId(id);
      await axios.delete(`/api/deprecations/${id}`);
      await fetchDeprecations();
      toast.success("Deprecation deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete deprecation");
    } finally {
      setDeleteLoadingId(null);
      setDeleteId(null);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "Not Started";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NOT_STARTED":
        return "default";
      case "IN_PROGRESS":
        return "warning";
      case "COMPLETED":
        return "success";
      default:
        return "info";
    }
  };

  const columns = [
    {
      name: "deprecatedItem",
      label: "Item",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Typography fontWeight="medium">{value}</Typography>
        ),
      },
    },
    {
      name: "suggestedReplacement",
      label: "Replacement",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Typography>{value || "-"}</Typography>
        ),
      },
    },
    {
      name: "migrationNotes",
      label: "Notes",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Typography>{value || "-"}</Typography>
        ),
      },
    },
    {
      name: "timelineStart",
      label: "Start Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Typography>
            {value ? new Date(value).toLocaleDateString() : "-"}
          </Typography>
        ),
      },
    },
    {
      name: "deadline",
      label: "Deadline",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Typography
            fontWeight={
              new Date(value) < new Date() &&
              deprecations.find((d) => d.id === value)?.progressStatus !==
                "COMPLETED"
                ? "bold"
                : "normal"
            }
            color={
              new Date(value) < new Date() &&
              deprecations.find((d) => d.id === value)?.progressStatus !==
                "COMPLETED"
                ? "error"
                : "inherit"
            }
          >
            {value ? new Date(value).toLocaleDateString() : "-"}
          </Typography>
        ),
      },
    },
    {
      name: "progressStatus",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (
          value: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED"
        ) => (
          <Chip
            label={getStatusDisplay(value)}
            color={getStatusColor(value)}
            size="small"
            sx={{
              fontWeight: "bold",
              minWidth: 100,
              textTransform: "capitalize",
            }}
          />
        ),
        filterOptions: {
          names: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
          logic(status: string, filterValue: string[]) {
            return filterValue.indexOf(status) === -1;
          },
        },
      },
    },
    {
      name: "project",
      label: "Project",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (
          value: { name?: string },
          tableMeta: MUIDataTableMeta
        ) => {
          const rowData = deprecations[tableMeta.rowIndex];
          return (
            <Typography fontWeight="medium">
              {value?.name || rowData.projectId}
            </Typography>
          );
        },
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (_value: unknown, tableMeta: MUIDataTableMeta) => {
          const id = deprecations[tableMeta.rowIndex].id;
          return (
            <Box display="flex" gap={1}>
              <IconButton
                onClick={() => {
                  setEditLoadingId(id);
                  router.push(route.deprecationsEdit(id));
                }}
                color="primary"
                size="small"
                disabled={editLoadingId === id}
              >
                {editLoadingId === id ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <EditIcon fontSize="small" />
                )}
              </IconButton>
              <IconButton
                color="error"
                onClick={() => setDeleteId(id)}
                disabled={deleteLoadingId === id}
                size="small"
              >
                {deleteLoadingId === id ? (
                  <CircularProgress size={20} color="error" />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            </Box>
          );
        },
      },
    },
  ];

  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight="bold" gutterBottom paddingLeft={5}>
        Deprecations
      </Typography>

      <DataTablePage
        createButtonText="Add Deprecation"
        createRoute={route.deprecationsNew}
        loading={loading}
        data={deprecations}
        columns={columns}
      />

      <DeleteConfirmationDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => handleDelete(deleteId!)}
        title="Delete Deprecation"
        message="Are you sure you want to delete this deprecation?"
      />
    </Box>
  );
}
