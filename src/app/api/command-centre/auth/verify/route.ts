import { NextResponse } from "next/server";
import { verifyToken, setSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const payload = await verifyToken(token);

  if (!payload || payload.kind !== "magic") {
    return NextResponse.redirect(
      new URL("/command-centre/login?error=expired", url.origin),
    );
  }

  await setSessionCookie(payload.email);

  const target = payload.redirect && payload.redirect.startsWith("/")
    ? payload.redirect
    : "/command-centre";
  return NextResponse.redirect(new URL(target, url.origin));
}
