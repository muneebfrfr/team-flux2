import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  switch (req.method) {
    case "GET": {
      try {
        const deprecation = await prisma.deprecation.findUnique({
          where: { id },
          include: {
            project: true,
          },
        });

        if (!deprecation) {
          return res.status(404).json({ error: "Deprecation not found" });
        }

        return res.status(200).json(deprecation);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    case "PUT": {
      try {
        const body = req.body;

        const updated = await prisma.deprecation.update({
          where: { id },
          data: {
            deprecatedItem: body.deprecatedItem,
            suggestedReplacement: body.suggestedReplacement,
            migrationNotes: body.migrationNotes,
            timelineStart: body.timelineStart
              ? new Date(body.timelineStart)
              : undefined,
            deadline: body.deadline ? new Date(body.deadline) : undefined,
            progressStatus: body.progressStatus,
          },
        });

        return res.status(200).json({
          message: "Deprecation updated successfully",
          data: updated,
        });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    case "DELETE": {
      try {
        await prisma.deprecation.delete({ where: { id } });

        return res.status(200).json({ message: "Deprecation deleted" });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} not allowed` });
    }
  }
}
