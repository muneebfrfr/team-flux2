// /pages/api/deprecations/[id]/link-technical-debt.ts

/**
 * @swagger
 * /api/deprecations/{id}/link-technical-debt:
 *   post:
 *     summary: Link technical debt items to a deprecation
 *     description: Appends technical debt IDs to the `linkedTechnicalDebtIds` array in a given deprecation.
 *     tags:
 *       - Deprecations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Deprecation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicalDebtIds
 *             properties:
 *               technicalDebtIds:
 *                 type: array
 *                 description: Array of technical debt item IDs to link
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Technical debt items linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Deprecation'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Deprecation not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Unlink a technical debt item from a deprecation
 *     description: Removes a specific technical debt ID from a deprecation's `linkedTechnicalDebtIds`.
 *     tags:
 *       - Deprecations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Deprecation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicalDebtId
 *             properties:
 *               technicalDebtId:
 *                 type: string
 *                 description: The technical debt ID to unlink
 *     responses:
 *       200:
 *         description: Technical debt item unlinked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Deprecation'
 *       400:
 *         description: Missing technicalDebtId
 *       404:
 *         description: Deprecation not found
 *       500:
 *         description: Server error
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query; // Deprecation ID

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid deprecation ID" });
  }

  // POST - Link technical debt items to deprecation
  if (req.method === "POST") {
    const { technicalDebtIds } = req.body;

    if (!technicalDebtIds || !Array.isArray(technicalDebtIds)) {
      return res
        .status(400)
        .json({ error: "technicalDebtIds array is required" });
    }

    try {
      // Get current deprecation
      const deprecation = await prisma.deprecation.findUnique({
        where: { id },
        select: { linkedTechnicalDebtIds: true },
      });

      if (!deprecation) {
        return res.status(404).json({ error: "Deprecation not found" });
      }

      // Combine existing and new IDs, remove duplicates
      const currentIds = deprecation.linkedTechnicalDebtIds || [];
      const updatedIds = [...new Set([...currentIds, ...technicalDebtIds])];

      // Update deprecation with new linked IDs
      const updatedDeprecation = await prisma.deprecation.update({
        where: { id },
        data: {
          linkedTechnicalDebtIds: updatedIds,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        message: "Technical debt items linked successfully",
        data: updatedDeprecation,
      });
    } catch (error: unknown) {
      console.error("Error linking technical debt:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  // DELETE - Unlink specific technical debt item
  if (req.method === "DELETE") {
    const { technicalDebtId } = req.body;

    if (!technicalDebtId) {
      return res.status(400).json({ error: "technicalDebtId is required" });
    }

    try {
      const deprecation = await prisma.deprecation.findUnique({
        where: { id },
        select: { linkedTechnicalDebtIds: true },
      });

      if (!deprecation) {
        return res.status(404).json({ error: "Deprecation not found" });
      }

      // Remove the technical debt ID from the array
      const currentIds = deprecation.linkedTechnicalDebtIds || [];
      const updatedIds = currentIds.filter(
        (linkedId) => linkedId !== technicalDebtId
      );

      const updatedDeprecation = await prisma.deprecation.update({
        where: { id },
        data: {
          linkedTechnicalDebtIds: updatedIds,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        message: "Technical debt item unlinked successfully",
        data: updatedDeprecation,
      });
    } catch (error: unknown) {
      console.error("Error unlinking technical debt:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Internal server error",
      });
    }
  }

  res.setHeader("Allow", ["POST", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
