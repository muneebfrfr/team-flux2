import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const sessions = await prisma.session.findMany({
        include: { presenter: true, notes: true },
      });

      return res.status(200).json({
        message: "Sessions fetched successfully",
        data: sessions,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching sessions",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  if (req.method === "POST") {
    try {
      const { topic, description, presenterId, time, calendarId } = req.body;

      const session = await prisma.session.create({
        data: { topic, description, presenterId, time, calendarId },
      });

      return res.status(201).json({
        message: "Session created successfully",
        data: session,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error creating session",
        error: error instanceof Error ? error.message : error,
      });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
