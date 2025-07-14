/**
 * @swagger
 * /api/sessions/{id}/feedbacks:
 *   get:
 *     summary: Get feedbacks for a session
 *     tags:
 *       - Feedbacks
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
 *         description: Feedbacks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feedbacks fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Submit feedback for a session
 *     tags:
 *       - Feedbacks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the session
 *         schema:
 *           type: string
 *           example: sess_abc123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Great session, learned a lot!
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Feedback submitted successfully
 *                 data:
 *                   $ref: '#/components/schemas/Feedback'
 *       400:
 *         description: Validation failed (e.g., missing or invalid rating)
 *       500:
 *         description: Server error
 */


// pages/api/sessions/[id]/feedbacks/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const feedbacks = await prisma.feedback.findMany({
          where: { sessionId: id },
        });

        return res.status(200).json({
          message: "Feedbacks fetched successfully",
          data: feedbacks,
        });
      }

      case "POST": {
        const { rating, comment } = req.body;

        if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
          return res.status(400).json({
            message: "Rating must be a number between 1 and 5",
          });
        }

        const feedback = await prisma.feedback.create({
          data: {
            sessionId: id,
            rating,
            comment,
          },
        });

        return res.status(201).json({
          message: "Feedback submitted successfully",
          data: feedback,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
