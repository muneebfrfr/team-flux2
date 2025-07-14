
/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     summary: Get a single session by ID
 *     tags:
 *       - Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the session
 *         schema:
 *           type: string
 *           example: sess_abc123
 *     responses:
 *       200:
 *         description: Session fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       404:
 *         description: Session not found
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Server error

 *   put:
 *     summary: Update a session by ID
 *     tags:
 *       - Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the session
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: Updated Sprint Planning
 *               description:
 *                 type: string
 *                 example: Planning updates and improvements
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user_123", "user_456"]
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Session'
 *       400:
 *         description: Invalid session ID or request body
 *       500:
 *         description: Server error

 *   delete:
 *     summary: Delete a session by ID
 *     tags:
 *       - Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the session
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session deleted successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Server error
 */

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid session ID" });
  }

  try {
    switch (method) {
      case "GET": {
        const session = await prisma.session.findUnique({
          where: { id },
          include: { presenter: true, notes: true, feedbacks: true },
        });

        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({
          message: "Session fetched successfully",
          data: session,
        });
      }

      case "PUT": {
        const { topic, description, participants } = req.body;

        const updated = await prisma.session.update({
          where: { id },
          data: {
            topic,
            description,
            sessionMembers: participants, 
          },
        });

        return res.status(200).json({
          message: "Session updated successfully",
          data: updated,
        });
      }

      case "DELETE": {
        await prisma.session.delete({ where: { id } });

        return res.status(200).json({
          message: "Session deleted successfully",
          success: true,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({
          message: `Method ${method} Not Allowed`,
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}
