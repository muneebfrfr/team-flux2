
/**
 * @swagger
 * /api/auth/callback/credentials:
 *   post:
 *     summary: Login with email and password using NextAuth Credentials Provider
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       302:
 *         description: Redirects to callback URL on success
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Get the current session
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Current user session data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 */

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

export default NextAuth(authOptions);
