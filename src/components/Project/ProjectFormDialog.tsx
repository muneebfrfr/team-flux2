// components/Project/ProjectFormDialog.tsx
"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import ProjectForm, { ProjectFormValues } from "./ProjectForm";

interface ProjectFormDialogProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
  isSubmitting: boolean;
  title?: string;
  submitButtonText?: string;
}

export default function ProjectFormDialog({
  open,
  onClose,
  defaultValues,
  onSubmit,
  isSubmitting,
  title,
  submitButtonText,
}: ProjectFormDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#fff",
          backgroundColor: "secondary.main",
          paddingY: 2,
          paddingX: 3,
        }}
      >
        {title || "Project Form"}
      </DialogTitle>
      <DialogContent dividers>
        <ProjectForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          submitButtonText={submitButtonText}
          onCancel={onClose}
          showCancelButton={true}
          fullWidth={true}
          title={""}
        />
      </DialogContent>
    </Dialog>
  );
}
