"use client";

import DeprecationForm from "@/components/DeprecationForm";

type DeprecationFormData = {
  id?: string;
  projectId: string;
  deprecatedItem: string;
  suggestedReplacement?: string;
  migrationNotes?: string;
  timelineStart: string;
  deadline: string;
  progressStatus: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};

export default function EditDeprecationClient({
  initialData,
}: {
  initialData: DeprecationFormData;
}) {
  return <DeprecationForm isEdit initialData={initialData} />;
}
