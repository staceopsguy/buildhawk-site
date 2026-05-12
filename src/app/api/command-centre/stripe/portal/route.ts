import { NextResponse } from "next/server";
import { getActiveContext } from "@/lib/auth";
import { createPortalSession } from "@/lib/billing/stripe";

export const runtime = "nodejs";

export async function POST() {
  const ctx = await getActiveContext();
  if (!ctx) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  if (ctx.membership.role !== "owner" && ctx.membership.role !== "admin") {
    return NextResponse.json(
      { ok: false, error: "Owner or admin role required" },
      { status: 403 },
    );
  }
  try {
    const session = await createPortalSession(ctx.tenant.id);
    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    console.error("[stripe] portal error:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Portal failed" },
      { status: 500 },
    );
  }
}
