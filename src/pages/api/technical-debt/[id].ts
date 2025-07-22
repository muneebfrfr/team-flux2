// /pages/api/technical-debt/[id].ts
// new branch commit
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid ID" });
  }

  try {
    switch (req.method) {
      case "GET": {
        const item = await prisma.technicalDebt.findUnique({
          where: { id },
          include: {
            project: true,
            owner: true,
            comments: {
              include: { user: true },
              orderBy: { createdAt: "desc" },
            },
          },
        });

        if (!item) return res.status(404).json({ message: "Item not found" });

        return res.status(200).json({ data: item });
      }

      case "PUT": {
        const { title, description, priority, status, ownerId, dueDate } = req.body;

        const updated = await prisma.technicalDebt.update({
          where: { id },
          data: {
            title,
            description,
            priority,
            status,
            ownerId,
            dueDate: dueDate ? new Date(dueDate) : undefined,
          },
        });

        return res.status(200).json({ data: updated });
      }

      case "DELETE": {
        await prisma.technicalDebt.delete({ where: { id } });
        return res.status(200).json({ message: "Deleted successfully" });
      }

      default:
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}