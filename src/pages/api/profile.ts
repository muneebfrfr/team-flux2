/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get the currently authenticated user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Authentication required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phoneNumber:
 *                 type: string
 *                 example: +1234567890
 *               address:
 *                 type: string
 *                 example: 123 Main St, City, Country
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       400:
 *         description: Name is required
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Internal server error
 */

// pages/api/profile.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/auth/requireAuth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Reuse the session from requireAuth
  const session = await requireAuth(req, res);
  if (!session) return; // already handled by requireAuth with 401 response

  if (req.method === "GET") {
    try {
      const user = await prisma.users.findUnique({
        where: { email: session.user.email! },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { name, phoneNumber, address } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      const updatedUser = await prisma.users.update({
        where: { email: session.user.email! },
        data: {
          name,
          phoneNumber: phoneNumber || null,
          address: address || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
