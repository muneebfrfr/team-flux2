// /pages/api/projects/[id]/technica;-debt/index.ts
/**
 * @swagger
 * /api/projects/{id}/technical-debt:
 *   get:
 *     summary: Get technical debt items for a specific project
 *     description: Fetches all technical debt entries associated with the specified project ID, ordered by creation date (latest first).
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
 *         description: Technical debt items fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TechnicalDebt'
 *       400:
 *         description: Invalid project ID
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const debts = await prisma.technicalDebt.findMany({
      where: { projectId: id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Technical debt items fetched successfully",
      data: debts,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
