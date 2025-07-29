/**
 * @swagger
 * /api/growth-sessions/{id}:
 *   get:
 *     summary: Get a single growth session by ID
 *     tags:
 *       - Growth Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the growth session
 *     responses:
 *       200:
 *         description: Growth session fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Growth session fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/GrowthSession'
 *       404:
 *         description: Growth session not found
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a growth session by ID
 *     tags:
 *       - Growth Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the growth session
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *               presenterId:
 *                 type: string
 *               scheduledTime:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               actionItems:
 *                 type: array
 *                 items:
 *                   type: object
 *               feedback:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Growth session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Growth session updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/GrowthSession'
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Update failed
 *
 *   delete:
 *     summary: Delete a growth session by ID
 *     tags:
 *       - Growth Sessions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the growth session
 *     responses:
 *       200:
 *         description: Growth session deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Growth session deleted successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Deletion failed
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
        const session = await prisma.growthSession.findUnique({
          where: { id },
          include: {
            presenter: true,
          },
        });

        if (!session) {
          return res.status(404).json({ message: "Growth session not found" });
        }

        return res.status(200).json({
          message: "Growth session fetched successfully",
          data: session,
        });
      }

      case "PUT": {
        const {
          topic,
          presenterId,
          scheduledTime,
          notes,
          actionItems,
          feedback,
        } = req.body;

        const updated = await prisma.growthSession.update({
          where: { id },
          data: {
            topic,
            presenterId,
            scheduledTime,
            notes,
            // For embedded types, you can update them directly
            actionItems: actionItems ? actionItems : undefined,
            feedback: feedback ? feedback : undefined,
          },
        });

        return res.status(200).json({
          message: "Growth session updated successfully",
          data: updated,
        });
      }

      case "DELETE": {
        await prisma.growthSession.delete({ where: { id } });

        return res.status(200).json({
          message: "Growth session deleted successfully",
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
