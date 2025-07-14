// /pages/api/technical-debt/[id]/debt.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid project ID" });
  }

  try {
    const debts = await prisma.technicalDebt.findMany({
      where: { projectId: id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({
      message: "Technical debt items fetched successfully",
      data: debts,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}
