"use client";

import { useState } from "react";
import Tilt from "@/components/motion/Tilt";
import Reveal from "@/components/motion/Reveal";

type Audience = "builders" | "trades" | "suppliers";

const tabs: { id: Audience; label: string; tagline: string }[] = [
  {
    id: "builders",
    label: "Builders",
    tagline: "Estimating, CA and live margin tracking across all your projects.",
  },
  {
    id: "trades",
    label: "Trades",
    tagline: "Benchmark your category across every AU and NZ region.",
  },
  {
    id: "suppliers",
    label: "Suppliers",
    tagline: "Get on the platform. Win recommendations from active builders.",
  },
];

const builderTiers = [
  {
    name: "Base · Annual",
    price: "$35,000",
    cadence: "/yr ex GST",
    onboarding: "+ $3,500 one-off onboarding",
    projects: "2 active projects included",
    add: "$1,200 per additional project",
    estimating: "Estimating engaged per project",
    cta: "Start brief",
    href: "#intake",
    featured: false,
  },
  {
    name: "Unlimited · Annual",
    price: "$85,000",
    cadence: "/yr ex GST",
    onboarding: "+ $3,500 one-off onboarding",
    projects: "Up to 5 active projects",
    add: "Estimating included",
    estimating: "All lifecycle stages",
    cta: "Talk to us",
    href: "#intake",
    featured: true,
  },
  {
    name: "Base · Monthly",
    price: "$4,500",
    cadence: "/month ex GST",
    onboarding: "+ $3,500 one-off onboarding",
    projects: "2 active projects included",
    add: "$1,850 per additional project",
    estimating: "Estimating engaged per project",
    cta: "Start brief",
    href: "#intake",
    featured: false,
  },
];

const tradeTiers = [
  {
    name: "Annual",
    price: "$3,200",
    cadence: "/yr ex GST",
    onboarding: "Single trade category",
    projects: "All AU states + NZ regions",
    add: "Lifecycle benchmarks: quote · variation · final delivered",
    estimating: "Where your pricing sits vs. regional rolling average",
    cta: "Subscribe",
    href: "#intake",
    featured: true,
  },
  {
    name: "Monthly",
    price: "$350",
    cadence: "/month ex GST",
    onboarding: "Single trade category",
    projects: "All AU states + NZ regions",
    add: "Cancel with 14 days notice",
    estimating: "Same intelligence, monthly cadence",
    cta: "Subscribe",
    href: "#intake",
    featured: false,
  },
];

const supplierTiers = [
  {
    name: "Regional",
    price: "$4,500",
    cadence: "/yr ex GST",
    onboarding: "Single AU state or single NZ region",
    projects: "Builder recommendations in coverage area",
    add: "Performance rating displayed on profile",
    estimating: "Hawktress Alliance member",
    cta: "Apply",
    href: "#intake",
    featured: false,
  },
  {
    name: "Multi-regional",
    price: "$8,500",
    cadence: "/yr ex GST",
    onboarding: "Up to 4 regions",
    projects: "Recommendations across all covered regions",
    add: "Hawktress Alliance member",
    estimating: "Performance benchmarking",
    cta: "Apply",
    href: "#intake",
    featured: false,
  },
  {
    name: "National AU",
    price: "$14,000",
    cadence: "/yr ex GST",
    onboarding: "All AU states + territories",
    projects: "National recommendation visibility",
    add: "Hawktress Alliance member",
    estimating: "Preferred placement candidates",
    cta: "Apply",
    href: "#intake",
    featured: false,
  },
  {
    name: "AU + NZ",
    price: "$18,500",
    cadence: "/yr ex GST",
    onboarding: "Full platform coverage",
    projects: "Recommendations across both markets",
    add: "Hawktress Alliance member",
    estimating: "Preferred placement candidates",
    cta: "Apply",
    href: "#intake",
    featured: true,
  },
];

const tiersByAudience = {
  builders: builderTiers,
  trades: tradeTiers,
  suppliers: supplierTiers,
};

export default function Pricing() {
  const [audience, setAudience] = useState<Audience>("builders");
  const tiers = tiersByAudience[audience];
  const active = tabs.find((t) => t.id === audience)!;

  return (
    <section
      id="pricing"
      className="relative bg-bh-white py-24 md:py-36 scroll-mt-20"
    >
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-10 md:mb-14">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              Pricing
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[36px] md:text-[56px] lg:text-[72px] text-bh-black">
              Three audiences.
              <br />
              <span className="text-bh-graphite">One platform.</span>
            </h2>
          </div>
        </div>

        {/* Audience tabs */}
        <div className="mb-10 md:mb-12">
          <div
            role="tablist"
            aria-label="Pricing audience"
            className="inline-flex p-1 rounded-[10px] bg-bh-cloud border border-bh-steel/60"
          >
            {tabs.map((t) => {
              const selected = audience === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setAudience(t.id)}
                  className={`px-5 md:px-7 h-11 rounded-[8px] text-[13px] tracking-[-0.005em] font-medium transition-colors ${
                    selected
                      ? "bg-bh-black text-bh-white"
                      : "bg-transparent text-bh-graphite hover:text-bh-black"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
          <p className="mt-5 max-w-2xl text-[15px] md:text-[17px] leading-[1.5] tracking-[-0.005em] text-bh-graphite">
            {active.tagline}
          </p>
        </div>

        {/* Tier cards */}
        <div
          key={audience}
          className={`grid gap-6 bh-pricing-grid ${
            tiers.length === 4
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              : tiers.length === 3
              ? "grid-cols-1 md:grid-cols-3"
              : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {tiers.map((t, i) => (
            <Tilt
              as="article"
              key={t.name}
              max={3}
              lift={4}
              className={`relative flex flex-col p-6 md:p-7 min-h-[420px] border transition-colors bh-pricing-card ${
                t.featured
                  ? "bg-bh-black text-bh-white border-bh-black shadow-[0_30px_60px_-20px_rgba(222,81,35,0.25)]"
                  : "bg-bh-white text-bh-black border-bh-steel/60 hover:border-bh-graphite/60"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {t.featured && (
                <span className="absolute -top-3 left-6 inline-flex items-center h-6 px-2.5 rounded-full bg-bh-orange text-bh-white text-[10px] tracking-[0.18em] uppercase font-medium">
                  Recommended
                </span>
              )}
              <h3
                className={`text-[18px] md:text-[20px] font-medium tracking-[-0.015em] mb-5 ${
                  t.featured ? "text-bh-white" : "text-bh-black"
                }`}
              >
                {t.name}
              </h3>
              <div className="mb-6">
                <p className="flex items-baseline gap-2">
                  <span
                    className={`font-medium tracking-[-0.03em] tabular-nums ${
                      t.featured ? "text-bh-orange" : "text-bh-black"
                    } text-[44px] md:text-[52px] leading-[1]`}
                  >
                    {t.price}
                  </span>
                  <span
                    className={`text-[12px] tracking-[0.04em] uppercase ${
                      t.featured ? "text-bh-steel/80" : "text-bh-graphite"
                    }`}
                  >
                    {t.cadence}
                  </span>
                </p>
                <p
                  className={`mt-2 text-[12px] tracking-[-0.005em] ${
                    t.featured ? "text-bh-steel/80" : "text-bh-graphite"
                  }`}
                >
                  {t.onboarding}
                </p>
              </div>

              <ul
                className={`space-y-2.5 mb-8 ${
                  t.featured
                    ? "divide-bh-graphite/30"
                    : "divide-bh-steel/40"
                }`}
              >
                {[t.projects, t.add, t.estimating].map((line) => (
                  <li
                    key={line}
                    className={`flex items-start gap-2.5 text-[13px] leading-[1.45] ${
                      t.featured ? "text-bh-steel" : "text-bh-graphite"
                    }`}
                  >
                    <span
                      className={`mt-1.5 inline-block w-1 h-1 rounded-full flex-none ${
                        t.featured ? "bg-bh-orange" : "bg-bh-orange"
                      }`}
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <a
                href={t.href}
                className={`mt-auto inline-flex items-center justify-between gap-4 rounded-[8px] pl-5 pr-2 h-11 text-[13px] tracking-[-0.005em] font-medium transition-colors ${
                  t.featured
                    ? "bg-bh-orange text-bh-white hover:bg-bh-orange-700"
                    : "bg-bh-black text-bh-white hover:bg-bh-orange"
                }`}
              >
                {t.cta}
                <span
                  className={`inline-flex items-center justify-center rounded-full w-7 h-7 ${
                    t.featured ? "bg-bh-white/20" : "bg-bh-white/15"
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </Tilt>
          ))}
        </div>

        {/* Footnote */}
        <div className="mt-10 md:mt-12 grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <p className="text-[12px] tracking-[-0.005em] text-bh-graphite leading-[1.5]">
              All prices ex GST. AUD for Australian subscribers; NZD equivalents for
              New Zealand. Payment terms 14 days from invoice. Annual fees invoiced in
              full at the start of the subscription period. Full conditions in the
              relevant subscriber terms below.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px] tracking-[-0.005em]">
              <a href="/terms-builders" className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4">
                Builder terms
              </a>
              <a href="/terms-trades" className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4">
                Trade terms
              </a>
              <a href="/terms-suppliers" className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4">
                Supplier terms
              </a>
              <a href="/data-policy" className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4">
                Data policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
