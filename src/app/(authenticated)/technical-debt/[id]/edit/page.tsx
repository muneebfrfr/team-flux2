// /app/technical-debt/[id]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
import TechnicalDebtForm from "@/components/TechnicalDebtForm";

export default function EditDebtPage() {
  const params = useParams();
  const id = params?.id;

  return <TechnicalDebtForm type="edit" id={id as string} />;
}
