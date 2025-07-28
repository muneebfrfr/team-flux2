// /app/projects/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Tabs, Tab, Divider } from "@mui/material";
import axios from "axios";
import TechnicalDebtSection from "@/components/Project/TechnicalDebtSection";
import DeprecationSection from "@/components/Project/DeprecationSection";

interface Project {
  id: string;
  name: string;
  description: string;
}
export default function ProjectDetailsPage() {
  const params = useParams() as Record<string, string | undefined>;
  const id = params?.id;
  const [project, setProject] = useState<Project | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (id) {
      axios.get(`/api/projects/${id}`).then((res) => {
        setProject(res.data.data);
      });
    }
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  if (!project) return <Typography>Loading...</Typography>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {project.name}
      </Typography>
      <Typography variant="body1" gutterBottom color="text.secondary">
        {project.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Technical Debt" />
        <Tab label="Deprecations" />
      </Tabs>

      <Divider sx={{ mb: 2 }} />

      {tabIndex === 0 && id && <TechnicalDebtSection projectId={id} />}
      {tabIndex === 1 && id && <DeprecationSection projectId={id} />}
    </Box>
  );
}
