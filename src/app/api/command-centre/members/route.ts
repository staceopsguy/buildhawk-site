import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getActiveContext } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { invitations, memberships, users } from "@/lib/db/schema";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getActiveContext();
  if (!ctx) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const rows = await db()
    .select({
      id: memberships.id,
      role: memberships.role,
      userId: users.id,
      email: users.email,
      name: users.name,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .where(eq(memberships.tenantId, ctx.tenant.id));

  const pendingInvites = await db()
    .select()
    .from(invitations)
    .where(
      and(eq(invitations.tenantId, ctx.tenant.id), eq(invitations.status, "pending")),
    );

  const members = [
    ...rows.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      role: r.role,
      isInvite: false,
    })),
    ...pendingInvites.map((i) => ({
      id: i.id,
      email: i.email,
      name: null,
      role: i.role,
      isInvite: true,
    })),
  ];
  return NextResponse.json({ ok: true, members });
}
