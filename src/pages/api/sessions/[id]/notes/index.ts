/**
 * @swagger
 * /api/growth-sessions/{id}/notes:
 *   get:
 *     summary: Get notes and action items for a specific growth session
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
 *         description: Notes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notes fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     notes:
 *                       type: string
 *                       nullable: true
 *                       example: These are the session notes.
 *                     actionItems:
 *                       type: array
 *                       items:
 *                         type: object
 *       404:
 *         description: Session not found
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update notes and/or action items for a specific growth session
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
 *               notes:
 *                 type: string
 *                 example: Updated session notes.
 *               actionItems:
 *                 type: array
 *                 items:
 *                   type: object
 *             example:
 *               notes: Updated session notes
 *               actionItems: []
 *     responses:
 *       200:
 *         description: Session notes updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Session notes updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     notes:
 *                       type: string
 *                       example: Updated session notes
 *                     actionItems:
 *                       type: array
 *                       items:
 *                         type: object
 *       400:
 *         description: Either notes or actionItems must be provided
 *       500:
 *         description: Update failed
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
        // Get the notes field from the growth session
        const session = await prisma.growthSession.findUnique({
          where: { id },
          select: {
            notes: true,
            actionItems: true // Including actionItems since they might be related
          }
        });

        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({
          message: "Notes fetched successfully",
          data: {
            notes: session.notes,
            actionItems: session.actionItems
          },
        });
      }

      case "PUT": {
        // Update the notes field
        const { notes, actionItems } = req.body;

        // Validate at least one field is provided
        if (notes === undefined && actionItems === undefined) {
          return res.status(400).json({ 
            message: "Either notes or actionItems must be provided" 
          });
        }

        const updatedSession = await prisma.growthSession.update({
          where: { id },
          data: {
            ...(notes !== undefined && { notes }),
            ...(actionItems !== undefined && { actionItems })
          },
          select: {
            notes: true,
            actionItems: true
          }
        });

        return res.status(200).json({
          message: "Session notes updated successfully",
          data: updatedSession,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({
          message: `Method ${method} Not Allowed`,
        });
      }
    }
  } catch (error: any) {
    console.error("Error processing request:", error);
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
}