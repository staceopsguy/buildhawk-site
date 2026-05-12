/**
 * Tenant access gate for the Cost Plan Console.
 *
 * Pure function (no DB calls) — pass the tenant row and get a verdict. Callers
 * decide what to do: redirect, show billing-required page, render banner, etc.
 */

import type { InferSelectModel } from "drizzle-orm";
import type { tenants } from "@/lib/db/schema";

type Tenant = InferSelectModel<typeof tenants>;

export type TenantAccess = {
  allowed: boolean;
  state: "active" | "trialing" | "trial_expired" | "past_due" | "canceled" | "paused";
  daysRemaining: number | null;
  reason: string | null;
};

const DAY_MS = 86_400_000;

export function getTenantAccess(tenant: Pick<Tenant, "status" | "trialEndsAt">): TenantAccess {
  const now = Date.now();

  if (tenant.status === "active") {
    return { allowed: true, state: "active", daysRemaining: null, reason: null };
  }

  if (tenant.status === "trialing") {
    if (!tenant.trialEndsAt) {
      // Unbounded trial — uncommon, but treat as access granted.
      return { allowed: true, state: "trialing", daysRemaining: null, reason: null };
    }
    const remaining = tenant.trialEndsAt.getTime() - now;
    if (remaining <= 0) {
      return {
        allowed: false,
        state: "trial_expired",
        daysRemaining: 0,
        reason: "Your 14-day trial has ended. Pick a plan to keep using the Cost Plan Console.",
      };
    }
    return {
      allowed: true,
      state: "trialing",
      daysRemaining: Math.max(1, Math.ceil(remaining / DAY_MS)),
      reason: null,
    };
  }

  if (tenant.status === "past_due") {
    return {
      allowed: false,
      state: "past_due",
      daysRemaining: null,
      reason: "Your last invoice failed. Update your payment method to restore access.",
    };
  }

  if (tenant.status === "canceled") {
    return {
      allowed: false,
      state: "canceled",
      daysRemaining: null,
      reason: "This workspace's subscription was canceled. Reactivate to continue.",
    };
  }

  if (tenant.status === "paused") {
    return {
      allowed: false,
      state: "paused",
      daysRemaining: null,
      reason: "This workspace is paused. Contact support to resume.",
    };
  }

  return {
    allowed: false,
    state: "canceled",
    daysRemaining: null,
    reason: "Subscription not in good standing.",
  };
}
