import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST": {
      const { name, description, color } = req.body;

      if (!name || !color) {
        return res.status(400).json({ error: "Name and color are required." });
      }

      try {
        const project = await prisma.project.create({
          data: { name, description, color },
        });

        return res.status(201).json(project);
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    case "GET": {
      try {
        const projects = await prisma.project.findMany({
          orderBy: { createdAt: "desc" },
        });

        return res.status(200).json({
          message: "Projects fetched successfully",
          data: projects,
        });
      } catch (error: any) {
        return res.status(500).json({ error: error.message });
      }
    }

    default: {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  }
}
