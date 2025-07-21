import { notFound } from "next/navigation";
import EditDeprecationClient from "./EditDeprecationClient";

type EditDeprecationPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditDeprecationPage({
  params,
}: EditDeprecationPageProps) {
  const { id } = await params;
  
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/deprecations/${id}`, {
    cache: "no-store",
  });
  
  if (!res.ok) return notFound();
  
  const data = await res.json();
  return <EditDeprecationClient initialData={data} />;
}