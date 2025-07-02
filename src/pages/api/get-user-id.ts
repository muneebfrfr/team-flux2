/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Only GET method is supported" });
  }

  const {
    query: { name, id },
    method,
  } = req;
  console.log("id->", id);
  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({
      error: "Failed to fetch user",
      message: (error as any).message,
    });
  }
}
