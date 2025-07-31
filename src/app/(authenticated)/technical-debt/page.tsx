// app/technical-debt/page.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Work as ProjectIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import route from "@/route";
import DataTablePage from "@/components/common/DataTablePage";

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

  const columns = [
    {
      name: "title",
      label: "Title",

      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Typography fontWeight="medium">{value}</Typography>
        ),
      },
    },
    {
      name: "project.name",
      label: "Project",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Box display="flex" alignItems="center" gap={1}>
            <ProjectIcon fontSize="small" color="action" />
            <Typography>{value || "-"}</Typography>
          </Box>
        ),
      },
    },
    {
      name: "priority",
      label: "Priority",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Chip
            label={value}
            color={getPriorityColor(value)}
            size="small"
            sx={{
              fontWeight: "bold",
              minWidth: 80,
              justifyContent: "center",
            }}
          />
        ),
        filterOptions: {
          names: ["High", "Medium", "Low"],
        },
      },
    },
    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Chip
            label={value}
            color={getStatusColor(value)}
            size="small"
            sx={{
              fontWeight: "bold",
              minWidth: 100,
              justifyContent: "center",
              textTransform: "capitalize",
            }}
          />
        ),
        filterOptions: {
          names: ["open", "in-review", "closed"],
        },
      },
    },
    {
      name: "owner.name",
      label: "Owner",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography>{value || "Unassigned"}</Typography>
          </Box>
        ),
      },
    },
    {
      name: "dueDate",
      label: "Due Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value: string) => (
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography>
              {value ? new Date(value).toLocaleDateString() : "-"}
            </Typography>
          </Box>
        ),
      },
    },
    {
      name: "actions",
      label: "Actions",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any) => {
          const item = debtItems[tableMeta.rowIndex];
          return (
            <Box display="flex" gap={1}>
              <Tooltip title="Edit">
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(item.id)}
                  disabled={editLoadingId === item.id}
                  size="small"
                >
                  {editLoadingId === item.id ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <EditIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  color="error"
                  onClick={() => handleDelete(item.id)}
                  size="small"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          );
        },
      },
    },
  ];

  const data = debtItems.map((item) => ({
    ...item,
    "project.name": item.project?.name,
    "owner.name": item.owner?.name,
    actions: "",
  }));

  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight="bold" gutterBottom paddingLeft={5}>
        Technical Debt Items
      </Typography>
      <DataTablePage
        createButtonText="New Debt Item"
        createRoute={route.newTechnicalDebt}
        loading={loading}
        data={data}
        columns={columns}
      />
    </Box>
  );
}
