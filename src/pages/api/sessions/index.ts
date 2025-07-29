/**
 * @swagger
 * /api/growth-sessions:
 *   get:
 *     summary: Get all growth sessions
 *     tags:
 *       - Growth Sessions
 *     responses:
 *       200:
 *         description: List of growth sessions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Growth sessions fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/GrowthSession'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new growth session
 *     tags:
 *       - Growth Sessions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - presenterId
 *               - scheduledTime
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Improving Code Quality
 *               presenterId:
 *                 type: string
 *                 example: user_123
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-08-01T10:00:00.000Z
 *               notes:
 *                 type: string
 *                 example: Discussion on improving code review process
 *               actionItems:
 *                 type: array
 *                 items:
 *                   type: object
 *               feedback:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Growth session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Growth session created
 *                 data:
 *                   $ref: '#/components/schemas/GrowthSession'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Growth session creation failed
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
  if (req.method === "GET") {
    try {
      const sessions = await prisma.growthSession.findMany({
        include: {
          presenter: true, // Only this is a relation
        },
      });

      return res.status(200).json({
        message: "Growth sessions fetched",
        data: sessions,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Failed to fetch growth sessions",
        error: error.message,
      });
    }
  }

  if (req.method === "POST") {
    const {
      topic,
      presenterId,
      scheduledTime,
      notes,
      actionItems = [],
      feedback = [],
    } = req.body;

    if (!topic || !presenterId || !scheduledTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      const session = await prisma.growthSession.create({
        data: {
          topic,
          presenterId,
          scheduledTime: new Date(scheduledTime),
          notes,
          actionItems,
          feedback,
        },
        include: {
          presenter: true,
        },
      });

      return res.status(201).json({
        message: "Growth session created",
        data: session,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: "Growth session creation failed",
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
