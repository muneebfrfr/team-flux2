/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a project by ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *           example: proj_abc123
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/ProjectWithDebts'
 *       404:
 *         description: Project not found
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Server error

 *   put:
 *     summary: Update a project by ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Authentication Refactor
 *               description:
 *                 type: string
 *                 example: Improving token refresh and login flow
 *               color:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error

 *   delete:
 *     summary: Delete a project by ID
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Project deleted successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid project ID
 *       500:
 *         description: Server error
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await requireAuth(req, res);
  if (!session) return;
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
        const project = await prisma.projects.findUnique({
          where: { id },
          include: {
            technicalDebts: {
              include: {
                owner: true,
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

        const updated = await prisma.projects.update({
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
        await prisma.$transaction(async (tx) => {
          await tx.comment.deleteMany({
            where: {
              technicalDebt: {
                projectId: id,
              },
            },
          });
          await tx.technicalDebt.deleteMany({
            where: { projectId: id },
          });

          await tx.deprecation.deleteMany({
            where: { projectId: id },
          });
          await tx.projects.delete({
            where: { id },
          });
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
