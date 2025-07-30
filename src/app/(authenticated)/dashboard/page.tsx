import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Typography, Box } from "@mui/material";
import prisma from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const user = session?.user?.email
    ? await prisma.users.findUnique({
        where: { email: session.user.email },
        select: { name: true },
      })
    : null;

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
        Welcome, {user?.name ?? session?.user?.name ?? "Guest"}
      </Typography>
    </Box>
  );
}
