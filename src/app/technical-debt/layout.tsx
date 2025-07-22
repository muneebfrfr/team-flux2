// app/projects/layout.tsx
import React from "react";
import DashboardLayout from "../dashboard/layout.client";
import ThemeRegistry from "@/components/ThemeRegistry"; // adjust path if needed

export const metadata = {
  title: "Technical Debt | Team Flux",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeRegistry>
      <DashboardLayout>{children}</DashboardLayout>
    </ThemeRegistry>
  );
}
