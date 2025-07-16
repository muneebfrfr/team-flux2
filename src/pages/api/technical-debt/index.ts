// /pages/api/technical-debt/index.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      try {
        const items = await prisma.technicalDebt.findMany({
          include: {
            project: true,
            owner: true,
            comments: {
              include: { user: true },
              orderBy: { createdAt: "desc" },
            },
          },
          orderBy: { createdAt: "desc" },
        });
        return res.status(200).json({ data: items });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    case "POST": {
      const { title, description, projectId, ownerId, priority, status, dueDate } = req.body;

      if (!title || !projectId || !ownerId || !priority || !status) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      try {
        const newItem = await prisma.technicalDebt.create({
          data: {
            title,
            description,
            projectId,
            ownerId,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate) : undefined,
          },
        });

        return res.status(201).json({ data: newItem });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}