import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await clearSession();
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/command-centre/login", url.origin), {
    status: 303,
  });
}

export async function GET(req: Request) {
  await clearSession();
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/command-centre/login", url.origin));
}
