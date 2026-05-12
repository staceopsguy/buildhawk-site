/**
 * Plan catalog. Hardcoded so the marketing site and the in-app checkout flow
 * stay in sync. Stripe price IDs come from env vars so test vs. live can be
 * switched without code changes.
 */

export type PlanTier = "starter" | "pro" | "enterprise";

export type PlanLimits = {
  maxEstimators: number;
  maxActiveEstimates: number;
  aiBriefsPerMonth: number;
  benchmarks: boolean;
  buildxact: boolean;
  xero: boolean;
  sso: boolean;
  auditLog: boolean;
};

export type Plan = {
  id: PlanTier;
  name: string;
  priceMonthlyAud: number | null;
  priceLabel: string;
  blurb: string;
  highlights: string[];
  limits: PlanLimits;
  // Stripe price IDs (one per billing interval, monthly only for v1).
  stripePriceIdEnv: string;
  ctaLabel: string;
};

export const PLANS: Record<PlanTier, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    priceMonthlyAud: 149,
    priceLabel: "$149 / mo",
    blurb: "For solo directors getting cost discipline into a small portfolio.",
    highlights: [
      "Up to 3 estimators",
      "25 active estimates",
      "Cost Plan Console + AI briefs",
      "GHL connector",
      "Email support",
    ],
    limits: {
      maxEstimators: 3,
      maxActiveEstimates: 25,
      aiBriefsPerMonth: 100,
      benchmarks: false,
      buildxact: false,
      xero: false,
      sso: false,
      auditLog: false,
    },
    stripePriceIdEnv: "STRIPE_PRICE_STARTER",
    ctaLabel: "Start Starter",
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthlyAud: 399,
    priceLabel: "$399 / mo",
    blurb: "For multi-estimator teams running continuous cost intelligence.",
    highlights: [
      "Up to 10 estimators",
      "Unlimited active estimates",
      "Hawktress benchmarks",
      "Buildxact + Xero connectors",
      "Priority support",
    ],
    limits: {
      maxEstimators: 10,
      maxActiveEstimates: 1_000_000,
      aiBriefsPerMonth: 1000,
      benchmarks: true,
      buildxact: true,
      xero: true,
      sso: false,
      auditLog: true,
    },
    stripePriceIdEnv: "STRIPE_PRICE_PRO",
    ctaLabel: "Start Pro",
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    priceMonthlyAud: null,
    priceLabel: "Contact us",
    blurb: "For builders running >$50M annual revenue across multiple regions.",
    highlights: [
      "Unlimited seats",
      "Unlimited estimates",
      "SSO + audit log",
      "Custom benchmark cohorts",
      "Dedicated CSM",
    ],
    limits: {
      maxEstimators: 1_000_000,
      maxActiveEstimates: 1_000_000,
      aiBriefsPerMonth: 1_000_000,
      benchmarks: true,
      buildxact: true,
      xero: true,
      sso: true,
      auditLog: true,
    },
    stripePriceIdEnv: "STRIPE_PRICE_ENTERPRISE",
    ctaLabel: "Talk to sales",
  },
};

export const isCheckoutAvailable = (tier: PlanTier) =>
  tier !== "enterprise" && Boolean(process.env[PLANS[tier].stripePriceIdEnv]);

export const planLimit = (tier: PlanTier): PlanLimits => PLANS[tier].limits;

export const allPlans = (): Plan[] => [PLANS.starter, PLANS.pro, PLANS.enterprise];
