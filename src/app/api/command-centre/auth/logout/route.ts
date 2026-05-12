import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await clearSessionCookie();
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/command-centre/login", url.origin), {
    status: 303,
  });
}

export async function GET(req: Request) {
  await clearSessionCookie();
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/command-centre/login", url.origin));
}
