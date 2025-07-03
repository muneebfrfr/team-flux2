import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-red-600 hover:underline"
    >
      Logout
    </button>
  );
}
