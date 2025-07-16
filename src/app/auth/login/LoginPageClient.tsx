"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import FullScreenLoader from "@/components/common/FullScreenLoader";

export default function LoginPageClient() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return <FullScreenLoader />;
  }

  return <LoginForm />;
}
