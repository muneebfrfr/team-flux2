import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Typography, Box } from "@mui/material";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Welcome, {session?.user?.name ?? "Guest"}
      </Typography>
    </Box>
  );
}
