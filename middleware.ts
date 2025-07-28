// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAuthPage =
    req.nextUrl.pathname === "/auth/login" || req.nextUrl.pathname === "/auth/signup";

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {

  matcher: ["/api/:path*", "/dashboard/:path*", "/sessions/:path*", "/auth/login", "/auth/signup"],

};
