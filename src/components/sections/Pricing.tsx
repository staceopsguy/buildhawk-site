"use client";

import Tilt from "@/components/motion/Tilt";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

const tiers: Tier[] = [
  {
    name: "Starter",
    price: "$149",
    cadence: "/ month",
    blurb:
      "For solo directors. Get cost discipline into a small portfolio of estimates with AI briefs and a single GHL connection.",
    features: [
      "Up to 3 estimators",
      "25 active estimates",
      "Cost Plan Console + AI briefs",
      "GHL connector",
      "Email support",
    ],
    cta: "Start free trial",
    href: "/command-centre/signup?plan=starter",
    featured: false,
  },
  {
    name: "Pro",
    price: "$399",
    cadence: "/ month",
    blurb:
      "For multi-estimator teams. Unlimited estimates, Hawktress regional benchmarks, Buildxact + Xero connectors.",
    features: [
      "Up to 10 estimators",
      "Unlimited active estimates",
      "Hawktress benchmarks",
      "Buildxact + Xero connectors",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/command-centre/signup?plan=pro",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    blurb:
      "For builders running over $50M annual revenue across multiple regions. SSO, audit log, custom benchmark cohorts.",
    features: [
      "Unlimited seats",
      "SSO + audit log",
      "Custom benchmark cohorts",
      "Dedicated CSM",
      "Volume pricing",
    ],
    cta: "Talk to sales",
    href: "mailto:sales@buildhawk.com.au?subject=Enterprise%20enquiry",
    featured: false,
  },
];

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-bh-white py-16 md:py-36 scroll-mt-20"
    >
      <div className="mx-auto max-w-[1480px] px-5 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-8 md:mb-14">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              Pricing
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px] text-bh-black">
              Precision pricing.
              <br />
              <span className="text-bh-graphite">Pre-contract clarity.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[14px] md:text-[17px] leading-[1.5] tracking-[-0.005em] text-bh-graphite">
              14-day free trial. No credit card. Cancel any time. AUD, GST not included. For a fully managed estimating engagement, see{" "}
              <a className="underline" href="/partners">
                BuildHawk delivery services
              </a>
              .
            </p>
          </div>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 bh-pricing-grid">
          {tiers.map((t, i) => (
            <Tilt
              as="article"
              key={t.name}
              max={3}
              lift={4}
              className={`relative flex flex-col p-6 md:p-7 min-h-[440px] border transition-colors bh-pricing-card ${
                t.featured
                  ? "bg-bh-ink text-bh-paper border-bh-ink shadow-[0_30px_60px_-20px_rgba(222,81,35,0.25)]"
                  : "bg-bh-white text-bh-black border-bh-steel/60 hover:border-bh-graphite/60"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {t.featured && (
                <span className="absolute -top-3 left-6 inline-flex items-center h-6 px-2.5 rounded-full bg-bh-orange text-bh-paper text-[10px] tracking-[0.18em] uppercase font-medium">
                  Most popular
                </span>
              )}
              <h3
                className={`text-[18px] md:text-[20px] font-medium tracking-[-0.015em] mb-5 ${
                  t.featured ? "text-bh-paper" : "text-bh-black"
                }`}
              >
                {t.name}
              </h3>
              <div className="mb-4">
                <span
                  className={`text-[36px] md:text-[44px] font-medium tracking-[-0.02em] leading-none ${
                    t.featured ? "text-bh-paper" : "text-bh-black"
                  }`}
                >
                  {t.price}
                </span>
                {t.cadence && (
                  <span
                    className={`ml-1 text-[14px] tracking-[-0.005em] ${
                      t.featured ? "text-bh-paper/70" : "text-bh-graphite"
                    }`}
                  >
                    {t.cadence}
                  </span>
                )}
              </div>
              <p
                className={`text-[13px] md:text-[14px] leading-[1.55] tracking-[-0.005em] mb-5 ${
                  t.featured ? "text-bh-paper/80" : "text-bh-graphite"
                }`}
              >
                {t.blurb}
              </p>
              <ul className="space-y-2.5 mb-7">
                {t.features.map((f) => (
                  <li
                    key={f}
                    className={`text-[13px] tracking-[-0.005em] leading-[1.4] flex items-start gap-2 ${
                      t.featured ? "text-bh-paper/90" : "text-bh-black"
                    }`}
                  >
                    <span
                      className={`mt-1 inline-flex w-1.5 h-1.5 rounded-full shrink-0 ${
                        t.featured ? "bg-bh-orange" : "bg-bh-black"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={t.href}
                className={`mt-auto inline-flex items-center justify-center h-11 px-5 rounded-[8px] text-[13px] tracking-[-0.005em] transition-colors ${
                  t.featured
                    ? "bg-bh-orange text-bh-paper hover:bg-bh-paper hover:text-bh-ink"
                    : "bg-bh-ink text-bh-paper hover:bg-bh-orange"
                }`}
              >
                {t.cta}
              </a>
            </Tilt>
          ))}
        </div>

        <p className="mt-10 text-[12px] tracking-[-0.005em] text-bh-graphite text-center">
          Indicative monthly prices, ex GST. Annual billing saves 15%. Founding-cohort pricing locks in for 12 months.
        </p>
      </div>
    </section>
  );
}
