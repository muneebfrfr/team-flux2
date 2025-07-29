// /pages/api/technical-debt/index.ts
// new branch commit
/**
 * @swagger
 * /api/technical-debt:
 *   get:
 *     summary: Get all technical debt items
 *     description: Returns a list of all technical debt items, including associated project, owner, and comments (with user details).
 *     tags:
 *       - Technical Debt
 *     responses:
 *       200:
 *         description: List of technical debt items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TechnicalDebtWithRelations'
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new technical debt item
 *     description: Creates a new technical debt record with the provided fields.
 *     tags:
 *       - Technical Debt
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *               - ownerId
 *               - priority
 *               - status
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               projectId:
 *                 type: string
 *               ownerId:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Technical debt item created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/TechnicalDebt'
 *       400:
 *         description: Missing required fields
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
  if (!session) return; // Ends the request if not authenticated

  switch (req.method) {
    case "GET": {
      try {
        const items = await prisma.technicalDebt.findMany({
          include: {
            project: true,
            owner: true,
            comments: {
              include: { user: true },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({ data: items });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    case "POST": {
      const {
        title,
        description,
        projectId,
        ownerId,
        priority,
        status,
        dueDate,
      } = req.body;

      if (!title || !projectId || !ownerId || !priority || !status) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const newItem = await prisma.technicalDebt.create({
          data: {
            title,
            description,
            projectId,
            ownerId,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : undefined,
          },
        });

        return res.status(201).json({ data: newItem });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
