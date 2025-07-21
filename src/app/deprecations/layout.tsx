

import DashboardLayout from "../dashboard/layout.client";
export const metadata = {
  title: "Deprecation | Team Flux",
};
export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
