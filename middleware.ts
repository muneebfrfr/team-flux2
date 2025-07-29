import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Add your protected routes here
const protectedRoutes = [
  "/dashboard",
  "/sessions",
  "/technical-debt",
  "/deprecations",
  "/projects",
  "/api/sessions",
  "/api/technical-debt",
  "/api/deprecations",
  "/api/projects",
  "/api/profile",
];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup");

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!token && isProtected && !isAuthPage) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/sessions/:path*",
    "/technical-debt/:path*",
    "/deprecations/:path*",
    "/projects/:path*",
    "/api/sessions/:path*",
    "/api/technical-debt/:path*",
    "/api/deprecations/:path*",
    "/api/projects/:path*",
    "/api/profile",
  ],
};
