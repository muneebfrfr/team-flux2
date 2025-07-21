import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id: projectId } = req.query;

  if (typeof projectId !== "string") {
    return res.status(400).json({ error: "Invalid projectId format" });
  }

  if (req.method === "GET") {
    try {
      const list = await prisma.deprecation.findMany({
        where: { projectId },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(list);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch deprecations" });
    }
  } else if (req.method === "POST") {
    try {
      const body = req.body;

      const newDeprecation = await prisma.deprecation.create({
        data: {
          projectId,
          deprecatedItem: body.deprecatedItem,
          suggestedReplacement: body.suggestedReplacement,
          migrationNotes: body.migrationNotes,
          timelineStart: new Date(body.timelineStart),
          deadline: new Date(body.deadline),
          progressStatus: body.progressStatus || "NOT_STARTED",
        },
      });

      return res.status(201).json(newDeprecation);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create deprecation" });
    }
  } else {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
