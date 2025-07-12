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
        const session = await prisma.session.findUnique({
          where: { id },
          include: { presenter: true, notes: true, feedbacks: true },
        });

        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({
          message: "Session fetched successfully",
          data: session,
        });
      }

      case "PUT": {
        const { topic, description, participants } = req.body;

        const updated = await prisma.session.update({
          where: { id },
          data: {
            topic,
            description,
            sessionMembers: participants, 
          },
        });

        return res.status(200).json({
          message: "Session updated successfully",
          data: updated,
        });
      }

      case "DELETE": {
        await prisma.session.delete({ where: { id } });

        return res.status(200).json({
          message: "Session deleted successfully",
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
