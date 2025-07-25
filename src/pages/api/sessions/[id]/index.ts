import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;

  if (typeof id !== "string") {
    return res.status(400).json({ message: "Invalid session ID" });
  }

  try {
    switch (method) {
      case "GET": {
        const session = await prisma.growthSession.findUnique({
          where: { id },
          include: { 
            presenter: true,
            // actionItems are automatically included as they're embedded
            // feedback is also embedded so it's automatically included
          },
        });

        if (!session) {
          return res.status(404).json({ message: "Growth session not found" });
        }

        return res.status(200).json({
          message: "Growth session fetched successfully",
          data: session,
        });
      }

      case "PUT": {
        const { topic, presenterId, scheduledTime, notes, actionItems, feedback } = req.body;

        const updated = await prisma.growthSession.update({
          where: { id },
          data: {
            topic,
            presenterId,
            scheduledTime,
            notes,
            // For embedded types, you can update them directly
            actionItems: actionItems ? actionItems : undefined,
            feedback: feedback ? feedback : undefined
          },
        });

        return res.status(200).json({
          message: "Growth session updated successfully",
          data: updated,
        });
      }

      case "DELETE": {
        await prisma.growthSession.delete({ where: { id } });

        return res.status(200).json({
          message: "Growth session deleted successfully",
          success: true,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
        return res.status(405).json({
          message: `Method ${method} Not Allowed`,
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
}