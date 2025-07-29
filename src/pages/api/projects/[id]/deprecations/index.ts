/**
 * @swagger
 * /api/projects/{id}/deprecations:
 *   get:
 *     summary: Get all deprecations for a specific project
 *     tags:
 *       - Deprecations
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
 *         description: A list of deprecations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Deprecation'
 *       400:
 *         description: Invalid projectId format
 *       500:
 *         description: Failed to fetch deprecations
 *
 *   post:
 *     summary: Create a new deprecation for a specific project
 *     tags:
 *       - Deprecations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Project ID
 *         schema:
 *           type: string
 *           example: proj_abc123
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
 *               $ref: '#/components/schemas/Deprecation'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to create deprecation
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
  const { id: projectId } = req.query;

  if (typeof projectId !== "string") {
    return res.status(400).json({ error: "Invalid projectId format" });
  }

  if (req.method === "GET") {
    try {
      const list = await prisma.deprecation.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
        include: {
          project: {
            select: {
              name: true,
              description: true,
            },
          },
        },
      });

      return res.status(200).json(list);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch deprecations" });
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body;

      const newDeprecation = await prisma.deprecation.create({
        data: {
          projectId,
          deprecatedItem: body.deprecatedItem,
          suggestedReplacement: body.suggestedReplacement,
          migrationNotes: body.migrationNotes,
          timelineStart: new Date(body.timelineStart),
          deadline: new Date(body.deadline),
          progressStatus: body.progressStatus || "NOT_STARTED",
        },
      });

      return res.status(201).json(newDeprecation);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create deprecation" });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
