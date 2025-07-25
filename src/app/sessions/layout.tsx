// app/sessions/layout.tsx

import DashboardLayout from "../dashboard/layout.client";
export const metadata = {
  title: "Sessions | Team Flux",
};
export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
