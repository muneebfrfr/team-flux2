"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import route from "@/route";
import DataTablePage from "@/components/common/DataTablePage";

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
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const router = useRouter();

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

  const columns = [
    {
      name: "deprecatedItem",
      label: "Item",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "suggestedReplacement",
      label: "Replacement",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "migrationNotes",
      label: "Notes",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => value || "-",
      },
    },
    {
      name: "timelineStart",
      label: "Start",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) =>
          new Date(value).toLocaleDateString(),
      },
    },
    {
      name: "deadline",
      label: "Deadline",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) =>
          new Date(value).toLocaleDateString(),
      },
    },
    {
      name: "progressStatus",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "project",
      label: "Project",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: { name: string }, tableMeta: any) => {
          const rowData = deprecations[tableMeta.rowIndex];
          return value?.name || rowData.projectId;
        },
      },
    },
    {
      name: "createdAt",
      label: "Created",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) =>
          new Date(value).toLocaleDateString(),
      },
    },
    {
      name: "updatedAt",
      label: "Updated",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) =>
          new Date(value).toLocaleDateString(),
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const id = deprecations[tableMeta.rowIndex].id;
          return (
            <Box display="flex" justifyContent="center">
              <IconButton
                onClick={() => router.push(route.deprecationsEdit(id))}
                color="primary"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={() => handleDelete(id)}
                disabled={deleteLoadingId === id}
              >
                {deleteLoadingId === id ? (
                  <CircularProgress size={20} color="error" />
                ) : (
                  <DeleteIcon />
                )}
              </IconButton>
            </Box>
          );
        },
      },
    },
  ];

  const options = {
  };

  return (
    <DataTablePage
      title="All Deprecations"
      createButtonText="Add Deprecation"
      createRoute={route.deprecationsNew}
      loading={loading}
      data={deprecations}
      columns={columns}
      options={options}
    />
  );
}
