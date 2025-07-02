// src/pages/api/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";
import { NextApiRequest, NextApiResponse } from "next";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TeamFlux API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/pages/api/*.ts"], // ✅ Must match actual file path
};

const swaggerSpec = swaggerJSDoc(options);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(swaggerSpec);
}
