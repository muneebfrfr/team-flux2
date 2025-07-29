"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import toast from "react-hot-toast";
import axios from "axios";
import AppTextField from "@/components/ui/AppTextField";
import route from "@/route";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import ColorizeIcon from "@mui/icons-material/Colorize";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  color: z
    .string()
    .min(1, "Color is required")
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val),
      { message: "Must be a valid hex color (e.g., #fff or #ffffff)" }
    ),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function CreateProjectPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3b82f6", // Default color
    },
  });

  const colorValue = watch("color");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleColorPickerOpen = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const onSubmit = async (data: ProjectForm) => {
    try {
      await axios.post("/api/projects", data);
      toast.success("Project created successfully");
      router.push(route.projects);
    } catch (err) {
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Failed to create project";
      toast.error(errorMsg);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Typography variant="h5" gutterBottom>
        Create New Project
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AppTextField
          label="Project Name"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          {...register("name")}
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

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" gutterBottom>
            Color
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={handleColorPickerOpen}
              sx={{
                width: 48,
                height: 48,
                backgroundColor: colorValue,
                border: "1px solid #ccc",
                "&:hover": {
                  backgroundColor: colorValue,
                  opacity: 0.9,
                },
              }}
            >
              <ColorizeIcon sx={{ color: "white" }} />
            </IconButton>
            <Typography variant="body2">{colorValue}</Typography>
          </Box>
          {errors.color && (
            <Typography color="error" variant="body2">
              {errors.color.message}
            </Typography>
          )}
        </Box>

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleColorPickerClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box sx={{ p: 2 }}>
            <HexColorPicker
              color={colorValue}
              onChange={(newColor) => {
                setValue("color", newColor);
              }}
            />
          </Box>
        </Popover>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Project"}
        </Button>
      </form>
    </Box>
  );
}
