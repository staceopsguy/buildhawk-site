import { NextResponse } from "next/server";
import { getActiveContext } from "@/lib/auth";
import { getGhlConfig, saveGhlConfig, disconnectGhl } from "@/lib/integrations";
import { isEncryptionConfigured } from "@/lib/crypto";

export const runtime = "nodejs";

export async function GET() {
  const ctx = await getActiveContext();
  if (!ctx) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const cfg = await getGhlConfig(ctx.tenant.id).catch(() => null);
  return NextResponse.json({
    ok: true,
    config: cfg
      ? {
          locationId: cfg.locationId,
          hasApiKey: Boolean(cfg.apiKey),
          projectDataFieldId: cfg.projectDataFieldId ?? null,
        }
      : null,
  });
}

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
  if (!isEncryptionConfigured()) {
    return NextResponse.json(
      { ok: false, error: "BH_ENCRYPTION_KEY not set in Vercel env." },
      { status: 503 },
    );
  }
  let body: { apiKey?: string; locationId?: string; projectDataFieldId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const locationId = (body.locationId ?? "").trim();
  if (!locationId) {
    return NextResponse.json({ ok: false, error: "locationId required" }, { status: 400 });
  }
  // If apiKey omitted but we already have a saved one, preserve it.
  const existing = await getGhlConfig(ctx.tenant.id).catch(() => null);
  const apiKey = (body.apiKey ?? "").trim() || existing?.apiKey;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "apiKey required" }, { status: 400 });
  }
  try {
    await saveGhlConfig(ctx.tenant.id, {
      apiKey,
      locationId,
      projectDataFieldId: body.projectDataFieldId?.trim() || undefined,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[integrations] save ghl error:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Save failed" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const ctx = await getActiveContext();
  if (!ctx) return NextResponse.json({ ok: false }, { status: 401 });
  if (ctx.membership.role !== "owner" && ctx.membership.role !== "admin") {
    return NextResponse.json(
      { ok: false, error: "Owner or admin role required" },
      { status: 403 },
    );
  }
  await disconnectGhl(ctx.tenant.id);
  return NextResponse.json({ ok: true });
}
