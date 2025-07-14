/**
 * @swagger
 * /api/sessions/{id}/notes:
 *   get:
 *     summary: Get all notes for a session
 *     tags:
 *       - Notes
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid session ID
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a new note for a session
 *     tags:
 *       - Notes
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a discussion note from the session.
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Note created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *       400:
 *         description: Missing or invalid content
 *       500:
 *         description: Server error
 */

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
        const notes = await prisma.note.findMany({
          where: { sessionId: id },
        });

        return res.status(200).json({
          message: "Notes fetched successfully",
          data: notes,
        });
      }

      case "POST": {
        const { content } = req.body;

        if (!content || typeof content !== "string") {
          return res.status(400).json({ message: "Content is required and must be a string" });
        }

        const note = await prisma.note.create({
          data: {
            sessionId: id,
            content,
          },
        });

        return res.status(201).json({
          message: "Note created successfully",
          data: note,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
          message: `Method ${method} Not Allowed`,
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
}
