import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
