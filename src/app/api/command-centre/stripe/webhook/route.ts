import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/billing/stripe";
import { db } from "@/lib/db/client";
import { tenants } from "@/lib/db/schema";
import { PLANS, type PlanTier } from "@/lib/billing/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const tierFromPrice = (priceId: string | null | undefined): PlanTier | null => {
  if (!priceId) return null;
  for (const t of Object.values(PLANS)) {
    if (process.env[t.stripePriceIdEnv] === priceId) return t.id;
  }
  return null;
};

const subscriptionStatusToTenant = (
  s: Stripe.Subscription.Status,
): "trialing" | "active" | "past_due" | "canceled" | "paused" => {
  switch (s) {
    case "trialing":
      return "trialing";
    case "active":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    case "paused":
      return "paused";
    default:
      return "active";
  }
};

async function applySubscription(sub: Stripe.Subscription) {
  const tenantId =
    (typeof sub.metadata?.tenantId === "string" && sub.metadata.tenantId) ||
    (await resolveTenantByCustomer(
      typeof sub.customer === "string" ? sub.customer : sub.customer.id,
    ));
  if (!tenantId) return;
  const item = sub.items.data[0];
  const priceId = item?.price.id ?? null;
  const tier = tierFromPrice(priceId) ?? "starter";
  const periodEnd = item?.current_period_end
    ? new Date(item.current_period_end * 1000)
    : null;
  await db()
    .update(tenants)
    .set({
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      plan: tier,
      status: subscriptionStatusToTenant(sub.status),
      currentPeriodEnd: periodEnd,
      updatedAt: new Date(),
    })
    .where(eq(tenants.id, tenantId));
}

async function resolveTenantByCustomer(customerId: string): Promise<string | null> {
  const row = (
    await db()
      .select()
      .from(tenants)
      .where(eq(tenants.stripeCustomerId, customerId))
      .limit(1)
  )[0];
  return row?.id ?? null;
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json(
      { ok: false, error: "Webhook secret not configured" },
      { status: 400 },
    );
  }
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("[stripe] signature verification failed:", e);
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const sub = await stripe().subscriptions.retrieve(
            session.subscription as string,
          );
          await applySubscription(sub);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.trial_will_end": {
        await applySubscription(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const tenantId =
          (typeof sub.metadata?.tenantId === "string" && sub.metadata.tenantId) ||
          (await resolveTenantByCustomer(
            typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          ));
        if (tenantId) {
          await db()
            .update(tenants)
            .set({ status: "canceled", updatedAt: new Date() })
            .where(eq(tenants.id, tenantId));
        }
        break;
      }
    }
  } catch (e) {
    console.error("[stripe] webhook handler error:", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
