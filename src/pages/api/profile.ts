import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Get session from NextAuth
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Handle GET request - fetch profile
  if (req.method === "GET") {
    try {
      // Get user from database using session
      const user = await prisma.users.findUnique({
        where: {
          email: session.user.email, // NextAuth provides email
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error("Profile fetch error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Handle PUT request - update profile
  else if (req.method === "PUT") {
    try {
      const { name, phoneNumber, address } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Name is required" });
      }

      // Update user profile using session email
      const updatedUser = await prisma.users.update({
        where: {
          email: session.user.email,
        },
        data: {
          name,
          phoneNumber: phoneNumber || null,
          address: address || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          address: true,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Profile update error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
