/**
 * @swagger
 * /api/get-users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Internal server error
 */

import prisma from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await requireAuth(req, res);
  if (!session) return; // Auth failed, response already sent

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET supported" });
  }

  try {
    const users = await prisma.users.findMany();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({
        error: "Failed to fetch users",
        message: (error as any).message,
      });
  }
}
