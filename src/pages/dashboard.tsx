import { getSession, GetSessionParams, useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";

export async function getServerSideProps(
  context: GetSessionParams | undefined
) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }

  return { props: { session } };
}

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <h1 className="text-2xl">Welcome, {session?.user?.email}</h1>
      <LogoutButton />
    </div>
  );
}
