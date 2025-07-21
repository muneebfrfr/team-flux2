import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      try {
        const deprecations = await prisma.deprecation.findMany({
          include: { project: true },
          orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({
          message: "Deprecations fetched successfully",
          data: deprecations,
        });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    case "POST": {
      const {
        projectId,
        deprecatedItem,
        suggestedReplacement,
        migrationNotes,
        timelineStart,
        deadline,
        progressStatus,
      } = req.body;

      if (!projectId || !deprecatedItem || !progressStatus) {
        return res.status(400).json({
          error: "projectId, deprecatedItem, and progressStatus are required.",
        });
      }

      try {
        const newDeprecation = await prisma.deprecation.create({
          data: {
            projectId,
            deprecatedItem,
            suggestedReplacement,
            migrationNotes,
            timelineStart: new Date(timelineStart),
            deadline: new Date(deadline),

            progressStatus,
          },
        });

        return res.status(201).json({
          message: "Deprecation created successfully",
          data: newDeprecation,
        });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      return res
        .status(405)
        .json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}
