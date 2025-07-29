/**
 * @swagger
 * /api/technical-debt/{id}/comment:
 *   get:
 *     summary: Get comments for a specific technical debt
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Technical Debt ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid technical debt ID
 *       500:
 *         description: Server error
 * 
 *   post:
 *     summary: Create a new comment for a technical debt item
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Technical Debt ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *               - userId
 *             properties:
 *               message:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
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
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid technical debt ID" });
  }

  if (req.method === "GET") {
    try {
      const comments = await prisma.comment.findMany({
        where: { technicalDebtId: id },
        orderBy: { createdAt: "asc" },
        include: { user: true },
      });
      return res.status(200).json({ data: comments });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === "POST") {
    const { message, userId } = req.body;
    if (!message || !userId) {
      return res.status(400).json({ error: "Message and userId are required" });
    }

    try {
      const comment = await prisma.comment.create({
        data: {
          message,
          userId,
          technicalDebtId: id,
        },
        include: { user: true },
      });
      return res.status(201).json({ data: comment });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
