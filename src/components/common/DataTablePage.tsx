// components/common/DataTablePage.tsx
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  useTheme,
  CircularProgress
} from "@mui/material";
import MUIDataTable, { 
  MUIDataTableColumn, 
  MUIDataTableOptions 
} from "mui-datatables";
import { Add as AddIcon } from "@mui/icons-material";

interface DataTablePageProps {
  title: string;
  createButtonText: string;
  createRoute: string;
  loading: boolean;
  data: any[];
  columns: MUIDataTableColumn[];
  options?: MUIDataTableOptions;
  children?: ReactNode;
}

export default function DataTablePage({
  title,
  createButtonText,
  createRoute,
  loading,
  data,
  columns,
  options,
  children
}: DataTablePageProps) {
  const theme = useTheme();

  const defaultOptions: MUIDataTableOptions = {
    filterType: 'dropdown',
    responsive: 'standard',
    selectableRows: 'none',
    print: false,
    download: false,
    viewColumns: true,
    elevation: 0,
    rowsPerPage: 10,
    rowsPerPageOptions: [10, 25, 50],
    serverSide: false,
    search: true,
    tableBodyHeight: 'auto',
    tableBodyMaxHeight: '500px',
    textLabels: {
      body: {
        noMatch: loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          'No records found'
        ),
      },
    },
    setRowProps: () => ({
      style: {
        backgroundColor: theme.palette.background.paper,
      },
    }),
    setTableProps: () => ({
      sx: {
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
      },
    }),
    ...options,
  };

  return (
    <Box p={4} maxWidth="1600px" margin="0 auto">
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mb={4}
        sx={{
          backgroundColor: theme.palette.background.default,
          p: 3,
          borderRadius: 1,
          boxShadow: theme.shadows[1]
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {title}
        </Typography>
        <Link href={createRoute} passHref>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            disabled={loading}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              createButtonText
            )}
          </Button>
        </Link>
      </Box>

      {children}

      <Paper
        elevation={0}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <MUIDataTable
          title=""
          data={data}
          columns={columns}
          options={defaultOptions}
        />
      </Paper>
    </Box>
  );
}