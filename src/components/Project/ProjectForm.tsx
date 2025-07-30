// components/Project/ProjectForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Typography } from "@mui/material";
import AppTextField from "@/components/ui/AppTextField";
import ColorPickerField from "@/components/Project/ColorPickerField";

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  color: z
    .string()
    .min(1, "Color is required")
    .refine((val) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i.test(val), {
      message: "Must be a valid hex color (e.g., #fff or #ffffff)",
    }),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormValues>;
  onSubmit: (data: ProjectFormValues) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  submitButtonText?: string;
  onCancel?: () => void;
  showCancelButton?: boolean;
  fullWidth?: boolean;
}

export default function ProjectForm({
  defaultValues = {
    name: "",
    description: "",
    color: "#3b82f6",
  },
  onSubmit,
  isSubmitting,
  title,
  submitButtonText = "Submit",
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues,
  });

  const colorValue = watch("color");

  return (
    <Box maxWidth={600} mx="auto" mt={1} mb={1}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AppTextField
          label="Project Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
          autoFocus
        />

        <AppTextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register("description")}
        />

        <ColorPickerField
          value={colorValue}
          onChange={(newColor) =>
            setValue("color", newColor, { shouldValidate: true })
          }
          error={errors.color?.message}
        />

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={isSubmitting || !isValid}
          fullWidth
          size="large"
        >
          {isSubmitting ? "Updating..." : submitButtonText}
        </Button>
      </form>
    </Box>
  );
}
