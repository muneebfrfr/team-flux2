import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import { requireAuth } from "@/lib/api-auth"; // 👈 import auth check helper

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // ✅ AUTH CHECK
  const auth = await requireAuth(req, res);
  if (!auth) return; // Already responded with 401 if unauthenticated

  if (req.method === "GET") {
    try {
      const sessions = await prisma.session.findMany({
        include: {
          presenter: true,
          notes: true,
          feedbacks: true,
          Notification: true,
        },
      });

      return res
        .status(200)
        .json({ message: "Sessions fetched", data: sessions });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Failed to fetch sessions", error: error.message });
    }
  }

  if (req.method === "POST") {
    const {
      topic,
      description,
      presenterId,
      time,
      calendarId,
      participantIds,
    } = req.body;

    if (!topic || !presenterId || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    try {
      // 1. Create session with participantIds as sessionMembers (string array)
      const session = await prisma.session.create({
        data: {
          topic,
          description,
          presenterId,
          time: new Date(time),
          calendarId,
          sessionMembers: participantIds || [],
        },
      });

      // 2. Create notifications for each participant
      if (participantIds && participantIds.length > 0) {
        const notifications = participantIds.map((userId: string) => ({
          userId,
          sessionId: session.id,
          message: `You’ve been added as a participant in the session: ${session.topic}`,
        }));

        await prisma.notification.createMany({ data: notifications });
      }

      // 3. Return full session data
      const fullSession = await prisma.session.findUnique({
        where: { id: session.id },
        include: {
          presenter: true,
          notes: true,
          feedbacks: true,
          Notification: true,
        },
      });

      return res
        .status(201)
        .json({ message: "Session created", data: fullSession });
    } catch (error: any) {
      return res
        .status(500)
        .json({ message: "Session creation failed", error: error.message });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
