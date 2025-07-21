import { notFound } from "next/navigation";
import EditDeprecationClient from "./EditDeprecationClient";

export default async function EditDeprecationPage({
  params,
}: {
  params: { id: string };
}) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/deprecations/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const data = await res.json();

  return <EditDeprecationClient initialData={data} />;
}
