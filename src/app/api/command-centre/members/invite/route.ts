import { NextResponse } from "next/server";
import { Resend } from "resend";
import { eq } from "drizzle-orm";
import {
  getActiveContext,
  hashToken,
  issueMagicLink,
  normalizeEmail,
} from "@/lib/auth";
import { db } from "@/lib/db/client";
import { invitations } from "@/lib/db/schema";
import { ids } from "@/lib/db/ids";
import { magicLinkUrl, renderMagicLinkEmail, sendAuthEmail } from "../../auth/_email";

export const runtime = "nodejs";

const ROLES = ["admin", "director", "estimator", "viewer"] as const;
type Role = (typeof ROLES)[number];

export async function POST(req: Request) {
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
  let body: { email?: string; role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const email = normalizeEmail(body.email ?? "");
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Valid email required" }, { status: 400 });
  }
  const role: Role = (ROLES as readonly string[]).includes(body.role ?? "")
    ? (body.role as Role)
    : "director";

  const inviteId = ids.invite();
  const rawToken = await issueMagicLink({
    email,
    purpose: "invite",
    metadata: { inviteId },
  });
  const tokenHash = hashToken(rawToken);

  await db().insert(invitations).values({
    id: inviteId,
    tenantId: ctx.tenant.id,
    email,
    role,
    invitedByUserId: ctx.user.id,
    status: "pending",
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 86400 * 1000),
  });

  if (process.env.RESEND_API_KEY) {
    try {
      const link = magicLinkUrl(rawToken);
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { text, html } = renderMagicLinkEmail({
        link,
        mode: "invite",
        tenantName: ctx.tenant.name,
        invitedBy: ctx.user.name ?? ctx.user.email,
      });
      await sendAuthEmail(resend, {
        to: email,
        subject: `${ctx.user.name ?? "Your colleague"} invited you to ${ctx.tenant.name}`,
        html,
        text,
      });
    } catch (e) {
      console.error("[invite] email send error:", e);
    }
  }

  return NextResponse.json({ ok: true, inviteId });
}

export async function DELETE(req: Request) {
  const ctx = await getActiveContext();
  if (!ctx) return NextResponse.json({ ok: false }, { status: 401 });
  if (ctx.membership.role !== "owner" && ctx.membership.role !== "admin") {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  await db()
    .update(invitations)
    .set({ status: "revoked" })
    .where(eq(invitations.id, id));
  return NextResponse.json({ ok: true });
}
