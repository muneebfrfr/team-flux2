"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Divider,
} from "@mui/material";

interface Project {
  name: string;
  description: string;
}

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
  project?: Project;
}

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? dateString
    : date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
};

const formatFieldName = (fieldName: string): string => {
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const isDateField = (key: string): boolean => {
  return ["timelineStart", "deadline", "createdAt", "updatedAt"].includes(key);
};

export default function DeprecationListTable() {
  const params = useParams() as Record<string, string | undefined>;
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [deprecations, setDeprecations] = useState<Deprecation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeprecations = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}/deprecations`);
        const dataArray = Array.isArray(res.data) ? res.data : [];
        setDeprecations(dataArray);
      } catch (err: any) {
        setError(
          `Failed to load deprecations: ${err.message || "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDeprecations();
    else {
      setError("No project ID provided");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress />
        <Typography mt={2}>Loading deprecations...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxWidth="md" mx="auto" mt={6}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!deprecations || deprecations.length === 0) {
    return (
      <Box maxWidth="md" mx="auto" mt={6}>
        <Alert severity="info">No deprecations found for this project.</Alert>
      </Box>
    );
  }

  const project = deprecations[0]?.project;
  const keysToExclude = ["id", "projectId", "project"];
  const tableHeaders = Object.keys(deprecations[0]).filter(
    (key) => !keysToExclude.includes(key)
  );

  return (
    <Box maxWidth="lg" mx="auto" mt={6}>
      {/* ✅ Project Name */}
      {project?.name && (
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {project.name}
        </Typography>
      )}

      {/* ✅ Project Description */}
      {project?.description && (
        <Typography variant="body1" color="text.secondary" mb={3}>
          {project.description}
        </Typography>
      )}

      {/* ✅ Section Title */}
      <Typography variant="h5" fontWeight="medium" gutterBottom mt={4}>
        Deprecations ({deprecations.length})
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* ✅ Deprecation Table */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell key={header}>
                  <strong>{formatFieldName(header)}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {deprecations.map((dep, index) => (
              <TableRow key={dep.id || index}>
                {tableHeaders.map((key) => {
                  const value = dep[key as keyof Deprecation];
                  let displayValue = "—";

                  if (value !== null && value !== undefined) {
                    if (typeof value === "boolean") {
                      displayValue = value ? "Yes" : "No";
                    } else if (isDateField(key)) {
                      displayValue = formatDate(value as string);
                    } else if (typeof value === "object") {
                      displayValue = JSON.stringify(value);
                    } else {
                      displayValue = String(value);
                    }
                  }

                  return <TableCell key={key}>{displayValue}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
