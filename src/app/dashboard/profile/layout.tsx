// src/app/profile/layout.tsx
import DashboardLayoutClient from "../layout.client";
export const metadata = {
  title: "Profile | Team Flux",
};
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
