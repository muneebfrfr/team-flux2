import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    switch (method) {
      // 🔍 GET project by ID
      case "GET": {
        const project = await prisma.project.findUnique({
          where: { id },
          include: {
            debts: {
              include: {
                owner: true, // Include user who owns the debt item
                comments: {
                  include: { user: true },
                },
              },
            },
          },
        });

        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json({
          message: "Project fetched successfully",
          data: project,
        });
      }

      // ✏️ Update project
      case "PUT": {
        const { name, description, color } = req.body;

        const updated = await prisma.project.update({
          where: { id },
          data: {
            name,
            description,
            color,
          },
        });

        return res.status(200).json({
          message: "Project updated successfully",
          data: updated,
        });
      }

      // 🗑️ Delete project
      case "DELETE": {
        await prisma.project.delete({
          where: { id },
        });

        return res.status(200).json({
          message: "Project deleted successfully",
          success: true,
        });
      }

      // ❌ Method not allowed
      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({
          message: `Method ${method} Not Allowed`,
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}
