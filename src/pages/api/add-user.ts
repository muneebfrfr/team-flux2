/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from '@/lib/db';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST supported' });
  }

  try {
    const { name, email, password } = req.body;

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        passwordHash: password, // hash it later
        roles: ['user'],
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user', message: (error as any).message });
  }
}
