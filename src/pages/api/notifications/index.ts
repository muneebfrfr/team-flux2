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
