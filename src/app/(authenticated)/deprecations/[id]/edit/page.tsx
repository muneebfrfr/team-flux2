"use client";

import { useParams } from "next/navigation";
import DeprecationForm from "@/components/deprecations/DeprecationForm";

export default function DeprecationEditPage() {
  const params = useParams();
  const deprecationId = params?.id as string;

  return <DeprecationForm deprecationId={deprecationId} mode="edit" />;
}
