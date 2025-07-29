// /pages/api/technical-debt/[id].ts
// new branch commit
/**
 * @swagger
 * /api/technical-debt/{id}:
 *   get:
 *     summary: Get a technical debt item by ID
 *     description: Retrieves a specific technical debt item with project, owner, and associated comments.
 *     tags:
 *       - Technical Debt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Technical debt item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Technical debt item found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TechnicalDebtWithRelations'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update a technical debt item by ID
 *     description: Updates the specified technical debt item with new values.
 *     tags:
 *       - Technical Debt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Technical debt item ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Technical debt item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TechnicalDebt'
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a technical debt item by ID
 *     description: Deletes a technical debt item and all its associated comments.
 *     tags:
 *       - Technical Debt
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Technical debt item ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Internal server error
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
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const item = await prisma.technicalDebt.findUnique({
          where: { id },
          include: {
            project: true,
            owner: true,
            comments: {
              include: { user: true },
              orderBy: { createdAt: "desc" },
            },
          },
        });

        if (!item) return res.status(404).json({ message: "Item not found" });

        return res.status(200).json({ data: item });
      }

      case "PUT": {
        const { title, description, priority, status, ownerId, dueDate } =
          req.body;

        const updated = await prisma.technicalDebt.update({
          where: { id },
          data: {
            title,
            description,
            priority,
            status,
            ownerId,
            dueDate: dueDate ? new Date(dueDate) : undefined,
          },
        });

        return res.status(200).json({ data: updated });
      }

      case "DELETE": {
        await prisma.comment.deleteMany({ where: { technicalDebtId: id } });
        await prisma.technicalDebt.delete({ where: { id } });

        return res.status(200).json({ message: "Deleted successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
