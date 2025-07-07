import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        const notes = await prisma.note.findMany({
          where: { sessionId: id },
        });

        return res.status(200).json({
          message: "Notes fetched successfully",
          data: notes,
        });
      }

      case "POST": {
        const { content } = req.body;

        if (!content || typeof content !== "string") {
          return res.status(400).json({ message: "Content is required and must be a string" });
        }

        const note = await prisma.note.create({
          data: {
            sessionId: id,
            content,
          },
        });

        return res.status(201).json({
          message: "Note created successfully",
          data: note,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({
          message: `Method ${method} Not Allowed`,
        });
      }
    }
  } catch (error: any) {
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error.message,
    });
  }
}
