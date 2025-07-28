import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">
        Welcome, {session?.user?.name ?? "Guest"}
      </h1>
    </div>
  );
}
