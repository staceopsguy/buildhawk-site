import { NextResponse } from "next/server";
import { getActiveContext } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/billing/stripe";
import { PLANS, type PlanTier } from "@/lib/billing/plans";

export const runtime = "nodejs";

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
  let body: { tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const tier = body.tier as PlanTier;
  if (!tier || !(tier in PLANS) || tier === "enterprise") {
    return NextResponse.json(
      { ok: false, error: "Invalid plan tier" },
      { status: 400 },
    );
  }
  try {
    const session = await createCheckoutSession({
      tenantId: ctx.tenant.id,
      email: ctx.user.email,
      name: ctx.user.name ?? undefined,
      tier,
    });
    return NextResponse.json({ ok: true, url: session.url });
  } catch (e) {
    console.error("[stripe] checkout error:", e);
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Checkout failed",
      },
      { status: 500 },
    );
  }
}
