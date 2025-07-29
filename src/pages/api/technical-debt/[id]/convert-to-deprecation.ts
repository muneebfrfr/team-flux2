// /pages/api/technical-debt/[id]/convert-to-deprecation.ts
/**
 * @swagger
 * /api/technical-debt/{id}/convert-to-deprecation:
 *   post:
 *     summary: Convert a technical debt item into a deprecation
 *     description: Creates a new deprecation from a technical debt item and marks the original technical debt as closed.
 *     tags:
 *       - Technical Debt
 *       - Deprecations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Technical debt item ID to convert
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deprecatedItem
 *               - timelineStart
 *               - deadline
 *             properties:
 *               deprecatedItem:
 *                 type: string
 *               suggestedReplacement:
 *                 type: string
 *               migrationNotes:
 *                 type: string
 *               timelineStart:
 *                 type: string
 *                 format: date-time
 *               deadline:
 *                 type: string
 *                 format: date-time
 *               projectId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Technical debt successfully converted to deprecation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     deprecation:
 *                       $ref: '#/components/schemas/Deprecation'
 *                     updatedDebt:
 *                       $ref: '#/components/schemas/TechnicalDebtWithOwner'
 *       400:
 *         description: Missing required fields or invalid input
 *       404:
 *         description: Technical debt not found
 *       409:
 *         description: Technical debt is already closed
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
  const { id } = req.query; // Technical Debt ID

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid technical debt ID" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const {
    deprecatedItem,
    suggestedReplacement,
    migrationNotes,
    timelineStart,
    deadline,
    projectId,
  } = req.body;

  if (!deprecatedItem || !timelineStart || !deadline) {
    return res.status(400).json({
      error: "deprecatedItem, timelineStart, and deadline are required",
    });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify technical debt exists and get its details
      const technicalDebt = await tx.technicalDebt.findUnique({
        where: { id },
        include: {
          project: true,
          owner: true,
        },
      });

      if (!technicalDebt) {
        throw new Error("Technical debt not found");
      }

      if (technicalDebt.status === "closed") {
        throw new Error("Technical debt is already closed");
      }

      // 2. Create new deprecation with the technical debt linked
      const deprecation = await tx.deprecation.create({
        data: {
          projectId: projectId || technicalDebt.projectId,
          deprecatedItem: deprecatedItem.trim(),
          suggestedReplacement: suggestedReplacement?.trim() || null,
          migrationNotes: migrationNotes?.trim() || null,
          timelineStart: new Date(timelineStart),
          deadline: new Date(deadline),
          linkedTechnicalDebtIds: [id], // Link the source technical debt
          progressStatus: "NOT_STARTED",
        },
      });

      // 3. Mark technical debt as closed (converted)
      const updatedDebt = await tx.technicalDebt.update({
        where: { id },
        data: {
          status: "closed",
          updatedAt: new Date(),
        },
        include: {
          owner: {
            select: { id: true, name: true },
          },
        },
      });

      return { deprecation, updatedDebt };
    });

    return res.status(201).json({
      message: "Technical debt successfully converted to deprecation",
      data: result,
    });
  } catch (error: unknown) {
    console.error("Error converting technical debt:", error);

    if (error instanceof Error) {
      if (error.message.includes("already closed")) {
        return res.status(409).json({ error: error.message });
      }
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
    }

    return res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
