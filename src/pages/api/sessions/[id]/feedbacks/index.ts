// pages/api/sessions/[id]/feedbacks/index.ts
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
          select: { feedback: true }
        });

        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }

        return res.status(200).json({
          message: "Feedbacks fetched successfully",
          data: session.feedback || [],
        });
      }

      case "POST": {
        const { userId, rating, comments } = req.body;

        // Validation
        if (!userId || typeof userId !== "string") {
          return res.status(400).json({ message: "Valid userId is required" });
        }

        if (typeof rating !== "number" || rating < 1 || rating > 5) {
          return res.status(400).json({
            message: "Rating must be a number between 1 and 5",
          });
        }

        // Get existing feedback array
        const session = await prisma.growthSession.findUnique({
          where: { id },
          select: { feedback: true }
        });

        if (!session) {
          return res.status(404).json({ message: "Session not found" });
        }

        // Create new feedback object
        const newFeedback = {
          userId,
          rating,
          comments: comments || null,
          createdAt: new Date()
        };

        // Update session with new feedback
        const updatedSession = await prisma.growthSession.update({
          where: { id },
          data: {
            feedback: {
              set: [...(session.feedback || []), newFeedback]
            }
          },
          select: { feedback: true }
        });

        return res.status(201).json({
          message: "Feedback submitted successfully",
          data: updatedSession.feedback,
        });
      }

      default: {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: `Method ${method} Not Allowed` });
      }
    }
  } catch (error: any) {
    console.error("Feedback error:", error);
    return res.status(500).json({ 
      message: "Server error", 
      error: error.message 
    });
  }
}