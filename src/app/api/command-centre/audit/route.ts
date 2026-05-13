/**
 * Audit log for the active tenant.
 *
 * Owners + admins see the full log. Lower roles get 403.
 * Returns the most recent 100 events.
 */
import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getActiveContext } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { auditEvents } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
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
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "100", 10) || 100, 500);
  const rows = await db()
    .select()
    .from(auditEvents)
    .where(eq(auditEvents.tenantId, ctx.tenant.id))
    .orderBy(desc(auditEvents.createdAt))
    .limit(limit);
  return NextResponse.json({ ok: true, events: rows });
}
