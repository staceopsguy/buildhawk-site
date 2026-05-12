import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifyEdgeSession } from "@/lib/auth-edge";

export const config = {
  // Gate /command-centre/* and /api/command-centre/* with these public exceptions:
  //   /command-centre/login, /signup, /request-access  (auth top-of-funnel)
  //   /api/command-centre/auth/*                        (auth handles its own validation)
  //   /api/command-centre/stripe/webhook                (Stripe-signed)
  matcher: [
    "/command-centre/:path*",
    "/api/command-centre/((?!auth|stripe/webhook|request-access).*)",
  ],
};

const PUBLIC_PATHS = new Set([
  "/command-centre/login",
  "/command-centre/signup",
  "/command-centre/request-access",
]);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  // If auth secret isn't set, the gate stays open (lets you bootstrap locally).
  const secret = process.env.BH_AUTH_SECRET;
  if (!secret) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifyEdgeSession(token, secret);
  if (session) {
    const res = NextResponse.next();
    res.headers.set("x-bh-user-id", session.userId);
    res.headers.set("x-bh-tenant-id", session.tenantId);
    return res;
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/command-centre/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}
