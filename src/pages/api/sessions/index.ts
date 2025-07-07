// pages/api/sessions/index.ts (rename from route.ts)

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const sessions = await prisma.session.findMany({
      include: { presenter: true, notes: true },
    });
    return res.status(200).json(sessions);
  }

  if (req.method === "POST") {
    const { topic, description, presenterId, time, calendarId } = req.body;

    const session = await prisma.session.create({
      data: { topic, description, presenterId, time, calendarId },
    });

    return res.status(201).json(session);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
