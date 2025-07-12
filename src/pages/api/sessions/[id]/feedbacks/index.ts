// pages/api/sessions/[id]/feedbacks/index.ts
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
        const feedbacks = await prisma.feedback.findMany({
          where: { sessionId: id },
        });

        return res.status(200).json({
          message: "Feedbacks fetched successfully",
          data: feedbacks,
        });
      }

      case "POST": {
        const { rating, comment } = req.body;

        if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
          return res.status(400).json({
            message: "Rating must be a number between 1 and 5",
          });
        }

        const feedback = await prisma.feedback.create({
          data: {
            sessionId: id,
            rating,
            comment,
          },
        });

        return res.status(201).json({
          message: "Feedback submitted successfully",
          data: feedback,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
      }
    }
  } catch (error: any) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
