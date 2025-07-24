// /pages/api/technical-debt/batch-get.ts
/**
 * @swagger
 * /api/technical-debt/batch-get:
 *   post:
 *     summary: Get multiple technical debt items by IDs
 *     description: Returns a list of technical debt items based on the provided array of technical debt IDs.
 *     tags:
 *       - Technical Debt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 description: Array of technical debt item IDs
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: List of matched technical debt items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TechnicalDebtSummary'
 *       400:
 *         description: Invalid or missing `ids` array in request
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { ids } = req.body;

  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ error: "ids array is required" });
  }

  try {
    const technicalDebts = await prisma.technicalDebt.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({ data: technicalDebts });
  } catch (error: unknown) {
    console.error("Error fetching technical debts:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
