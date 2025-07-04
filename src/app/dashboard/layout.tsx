import DashboardLayoutClient from "./layout.client";

export const metadata = {
  title: "Dashboard | Team Flux",
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
