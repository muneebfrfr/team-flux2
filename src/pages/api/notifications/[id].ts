/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Get a single notification by ID
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *           example: notif_123abc
 *     responses:
 *       200:
 *         description: Notification fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error

 *   put:
 *     summary: Update a notification by ID
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: You’ve been invited to a session.
 *               isRead:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Server error

 *   delete:
 *     summary: Delete a notification by ID
 *     tags:
 *       - Notifications
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Notification ID
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Notification deleted successfully
 *       400:
 *         description: Invalid ID
 *       500:
 *         description: Server error
 */

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const notification = await prisma.notification.findUnique({
        where: { id },
        include: {
          user: true,
          session: true,
        },
      });

      if (!notification) return res.status(404).json({ error: 'Not found' });
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching notification' });
    }
  }

  if (req.method === 'PUT') {
    const { message, isRead } = req.body;
    try {
      const updated = await prisma.notification.update({
        where: { id },
        data: { message, isRead },
      });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error updating notification' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.notification.delete({ where: { id } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting notification' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
}
