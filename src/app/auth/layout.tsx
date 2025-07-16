// /app/auth/layout.tsx
import type { Metadata } from "next";
import Box from "@mui/material/Box";
import RightPanel from "@/components/layout/RightPanel";

export const metadata: Metadata = {
  title: "Auth | Team Flux",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{ display: "flex", position: "fixed", inset: 0, overflow: "hidden" }}
    >
      {/* Left Panel */}
      <Box
        sx={{
          flex: 1,
          backgroundColor: "#f0f2f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </Box>

      {/* Right Panel - Client Component */}
      <RightPanel />
    </Box>
  );
}
