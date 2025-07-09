// app/sessions/layout.tsx
// 'use client';

import { ReactNode } from 'react';
import DashboardLayout from '../dashboard/layout.client'; // or wherever your layout is
export const metadata = {
  title: "Session | Team Flux",
};
export default function SessionsLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
