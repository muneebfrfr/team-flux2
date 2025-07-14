/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags:
 *       - Notifications
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Failed to fetch notifications
 *
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - message
 *               - sessionId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: user_abc123
 *               message:
 *                 type: string
 *                 example: You’ve been added to a new session.
 *               sessionId:
 *                 type: string
 *                 example: sess_xyz456
 *     responses:
 *       201:
 *         description: Notification created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Failed to create notification
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const notifications = await prisma.notification.findMany({
        include: {
          user: true,
          session: true,
        },
      });
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }

  if (req.method === 'POST') {
    const { userId, message, sessionId } = req.body;

    try {
      const notification = await prisma.notification.create({
        data: {
          userId,
          message,
          sessionId,
        },
      });
      res.status(201).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create notification' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
