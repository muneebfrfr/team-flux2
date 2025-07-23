/**
 * @swagger
 * /api/deprecations:
 *   get:
 *     summary: Get all deprecations with associated project info
 *     tags:
 *       - Deprecations
 *     responses:
 *       200:
 *         description: Deprecations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deprecations fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeprecationWithProject'
 *       500:
 *         description: Failed to fetch deprecations
 *
 *   post:
 *     summary: Create a new deprecation
 *     tags:
 *       - Deprecations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDeprecationRequest'
 *     responses:
 *       201:
 *         description: Deprecation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Deprecation created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Deprecation'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create deprecation
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      try {
        const deprecations = await prisma.deprecation.findMany({
          include: {
            project: true,
          },
          orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({
          message: "Deprecations fetched successfully",
          data: deprecations,
        });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    case "POST": {
      const {
        projectId,
        deprecatedItem,
        suggestedReplacement,
        migrationNotes,
        timelineStart,
        deadline,
        progressStatus,
        linkedTechnicalDebtIds, // 🔧 New field
      } = req.body;

      if (!projectId || !deprecatedItem || !progressStatus) {
        return res.status(400).json({
          error: "projectId, deprecatedItem, and progressStatus are required.",
        });
      }

      try {
        const newDeprecation = await prisma.deprecation.create({
          data: {
            projectId,
            deprecatedItem,
            suggestedReplacement,
            migrationNotes,
            timelineStart: new Date(timelineStart), 
            deadline: new Date(deadline),
            progressStatus,
            linkedTechnicalDebtIds, // ✅ Save the array directly
          },
        });

        return res.status(201).json({
          message: "Deprecation created successfully",
          data: newDeprecation,
        });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}
