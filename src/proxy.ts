import { NextRequest, NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export const config = {
  // Apply to everything under /command-centre, plus /api/command-centre except /auth/*
  matcher: ["/command-centre/:path*", "/api/command-centre/((?!auth).*)"],
};

const PUBLIC_PATHS = ["/command-centre/login"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes (login) pass through unchanged.
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // If auth is not configured, treat the gate as transparent — keeps the
  // prototype usable without env vars. Once BH_AUTH_SECRET + allowlist are set,
  // the gate engages.
  if (!process.env.BH_AUTH_SECRET || !process.env.BH_AUTHORIZED_EMAILS) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const payload = token ? await verifyToken(token) : null;
  if (payload && payload.kind === "session") {
    return NextResponse.next();
  }

  // API calls get 401 JSON; pages redirect to login with a return path.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/command-centre/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}
