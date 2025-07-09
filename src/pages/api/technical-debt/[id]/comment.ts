// /pages/api/technical-debt/[id]/comment.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid technical debt ID" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

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
    });

    return res.status(201).json({ data: comment });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
