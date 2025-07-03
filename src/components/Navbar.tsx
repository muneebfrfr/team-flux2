import LogoutButton from "./LogoutButton";
import { useSession } from "next-auth/react";

export default function Navbar() {
  // const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-100">
      <h1 className="text-xl font-bold">TeamFlux</h1>
      {/* {session && (
        <div className="flex items-center gap-4">
          <p>{session.user.email}</p>
          <LogoutButton />
        </div>
      )} */}
    </nav>
  );
}
