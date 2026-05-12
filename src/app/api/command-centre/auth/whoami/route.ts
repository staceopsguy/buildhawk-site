import { NextResponse } from "next/server";
import { getSessionEmail } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const email = await getSessionEmail();
  return NextResponse.json(
    { signedIn: !!email, email: email ?? null },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0, must-revalidate",
      },
    },
  );
}
