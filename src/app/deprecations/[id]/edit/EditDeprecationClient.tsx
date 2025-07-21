"use client";

import DeprecationForm from "@/components/DeprecationForm";

export default function EditDeprecationClient({ initialData }: { initialData: any }) {
  return <DeprecationForm isEdit initialData={initialData} />;
}
