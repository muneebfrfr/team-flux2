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
