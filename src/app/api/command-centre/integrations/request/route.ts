/**
 * Builder requests a connector that isn't live yet. Logs the request as an
 * audit event (so we can see which connectors are most-wanted across tenants)
 * and emails sales@buildhawk.com.au.
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getActiveContext } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { findConnector } from "@/lib/integrations/connectors";

export const runtime = "nodejs";

const TO_EMAIL = process.env.CONNECTOR_REQUEST_TO_EMAIL || "sales@buildhawk.com.au";
const FROM_EMAIL =
  process.env.BH_AUTH_FROM_EMAIL ||
  "BuildHawk Cost Plan Console <noreply@buildhawk.com.au>";

export async function POST(req: Request) {
  const ctx = await getActiveContext();
  if (!ctx) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  let body: { connectorId?: string; note?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const connectorId = (body.connectorId ?? "").trim();
  const connector = findConnector(connectorId);
  if (!connector) {
    return NextResponse.json(
      { ok: false, error: "Unknown connector" },
      { status: 400 },
    );
  }
  const note = (body.note ?? "").trim().slice(0, 800);

  recordAudit({
    tenantId: ctx.tenant.id,
    actorUserId: ctx.user.id,
    actorEmail: ctx.user.email,
    action: "integration.requested",
    target: connector.id,
    metadata: { name: connector.name, status: connector.status, note: note || null },
  });

  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `Connector request: ${connector.name} (${ctx.tenant.name})`,
        text: `Tenant: ${ctx.tenant.name} (${ctx.tenant.id})
Requested by: ${ctx.user.email}
Connector: ${connector.name} (${connector.id}) · current status: ${connector.status}

Note from user:
${note || "(none provided)"}`,
      });
    } catch (e) {
      console.error("[integrations/request] email error:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
