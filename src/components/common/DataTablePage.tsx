"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Paper,
  useTheme,
  CircularProgress,
  Typography,
} from "@mui/material";
import MUIDataTable, {
  type MUIDataTableColumn,
  type MUIDataTableOptions,
} from "mui-datatables";
import { Add as AddIcon } from "@mui/icons-material";

interface DataTablePageProps {
  createButtonText: string;
  createRoute: string;
  loading: boolean;
  data: (object | string[] | number[])[];
  columns: MUIDataTableColumn[];
  options?: MUIDataTableOptions;
  children?: ReactNode;
}

export default function DataTablePage({
  createButtonText,
  createRoute,
  loading,
  data,
  columns,
  options,
  children,
}: DataTablePageProps) {
  const theme = useTheme();

  const processedColumns = columns.map((column) => ({
    ...column,
    options: {
      ...column.options,
      customHeadLabelRender: () => (
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {column.label || column.name}
        </Typography>
      ),
    },
  }));

  const defaultOptions: MUIDataTableOptions = {
    filterType: "dropdown",
    responsive: "standard",
    selectableRows: "none",
    print: false,
    download: false,
    viewColumns: true,
    elevation: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    serverSide: false,
    search: true,
    searchOpen: false,
    tableBodyHeight: "auto",
    tableBodyMaxHeight: "600px",
    textLabels: {
      body: {
        noMatch: loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={4}
          >
            <CircularProgress size={32} />
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={4}
          >
            <Typography variant="body2" color="text.secondary">
              No records found
            </Typography>
          </Box>
        ),
      },
    },
    setRowProps: () => ({
      style: {
        backgroundColor: theme.palette.background.paper,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
      },
    }),
    setTableProps: () => ({
      sx: {
        "& .MuiTableCell-head": {
          backgroundColor: theme.palette.grey[50],
          fontWeight: 600,
        },
        "& .MuiTableCell-body": {
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      },
    }),
    customToolbar: () => (
      <Link href={createRoute} passHref style={{ textDecoration: "none" }}>
        <Button
          color="secondary"
          variant="contained"
          startIcon={loading ? null : <AddIcon />}
          disabled={loading}
          size="small"
          sx={{
            minWidth: 120,
            height: 32,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            createButtonText
          )}
        </Button>
      </Link>
    ),
    ...options,
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: "1600px",
        margin: "0 auto",
        minHeight: "100vh",
      }}
    >
      {children && <Box sx={{ mb: 2 }}>{children}</Box>}

      {/* Data Table Section */}
      <Paper
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: "transparent",
          "& .MUIDataTable-root": {
            backgroundColor: "transparent",
          },
          "& .MUIDataTableToolbar-root": {
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            minHeight: 64,
            display: "flex",
            alignItems: "center",
            flexDirection: "row-reverse",
          },
          "& .MUIDataTableToolbar-left": {
            order: 2,
          },
          "& .MUIDataTableToolbar-actions": {
            order: 1,
          },
          "& .MUIDataTableHeadCell-root": {
            backgroundColor: theme.palette.grey[50],
            fontWeight: "600 !important",
            borderBottom: `2px solid ${theme.palette.divider}`,
          },
          "& .MUIDataTableBodyCell-root": {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MUIDataTablePagination-root": {
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <MUIDataTable
          title=""
          data={data}
          columns={processedColumns}
          options={defaultOptions}
        />
      </Paper>
    </Box>
  );
}
