
/**
 * @swagger
 * /api/sessions:
 *   get:
 *     summary: Get all growth sessions
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of sessions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sessions fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Session'
 *       401:
 *         description: Unauthorized – missing or invalid token
 *       500:
 *         description: Server error while fetching sessions
 *
 *   post:
 *     summary: Create a new growth session
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *               - presenterId
 *               - time
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Weekly Sync-up
 *               description:
 *                 type: string
 *                 example: Discuss project progress
 *               presenterId:
 *                 type: string
 *                 example: clx123xyz456
 *               time:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-15T10:00:00.000Z
 *               calendarId:
 *                 type: string
 *                 example: cal_78910
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2"]
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session created
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Session creation failed
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/api-auth"; // 👈 import auth check helper

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ AUTH CHECK
  const auth = await requireAuth(req, res);
  if (!auth) return; // Already responded with 401 if unauthenticated

  if (req.method === "GET") {
    try {
      const sessions = await prisma.session.findMany({
        include: {
          presenter: true,
          notes: true,
          feedbacks: true,
          Notification: true,
        },
      });

      return res
        .status(200)
        .json({ message: "Sessions fetched", data: sessions });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch sessions", error: error.message });
    }
  }

  if (req.method === "POST") {
    const {
      topic,
      description,
      presenterId,
      time,
      calendarId,
      participantIds,
    } = req.body;

    if (!topic || !presenterId || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // 1. Create session with participantIds as sessionMembers (string array)
      const session = await prisma.session.create({
        data: {
          topic,
          description,
          presenterId,
          time: new Date(time),
          calendarId,
          sessionMembers: participantIds || [],
        },
      });

      // 2. Create notifications for each participant
      if (participantIds && participantIds.length > 0) {
        const notifications = participantIds.map((userId: string) => ({
          userId,
          sessionId: session.id,
          message: `You’ve been added as a participant in the session: ${session.topic}`,
        }));

        await prisma.notification.createMany({ data: notifications });
      }

      // 3. Return full session data
      const fullSession = await prisma.session.findUnique({
        where: { id: session.id },
        include: {
          presenter: true,
          notes: true,
          feedbacks: true,
          Notification: true,
        },
      });

      return res
        .status(201)
        .json({ message: "Session created", data: fullSession });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Session creation failed", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
