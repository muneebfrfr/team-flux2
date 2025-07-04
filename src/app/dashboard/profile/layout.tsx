// src/app/profile/layout.tsx
import DashboardLayoutClient from "../layout.client";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
