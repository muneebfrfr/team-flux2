// src/pages/dashboard.tsx

import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session) return <p>You are not logged in</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session.user.email}</p>
      <p>Roles: {session.user.roles.join(', ')}</p>
    </div>
  );
}
