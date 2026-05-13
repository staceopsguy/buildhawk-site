"use client";

import Tilt from "@/components/motion/Tilt";

type Tier = {
  name: string;
  price: string;
  cadence: string;
  note?: string;
  blurb: string;
  features: string[];
  cta: string;
  href: string;
  featured: boolean;
};

const builderTiers: Tier[] = [
  {
    name: "Full Estimates",
    price: "From $2,150",
    cadence: "+ GST",
    note: "Per estimate engagement",
    blurb:
      "Project-by-project estimating for builders who want a precise, client-ready proposal without committing to a monthly engagement.",
    features: [
      "Comprehensive trade and supplier RFQ process",
      "Detailed BOQ (Bill of Quantities)",
      "Scope and risk review summary",
      "Client-ready proposal completed for presentation",
      "Market-aligned pricing from real trade engagement",
      "Clear inclusions, exclusions and scope alignment",
      "Builder-led estimating focused on margin protection and project control",
    ],
    cta: "Start a brief",
    href: "#intake",
    featured: false,
  },
  {
    name: "Base Execution Layer",
    price: "From $3,150",
    cadence: "+ GST / month",
    note: "Based on a 12-month engagement",
    blurb:
      "Bridges the gap between estimating and on-site delivery. For builders running up to two live projects who want pre-construction discipline, procurement coordination and weekly operational cadence.",
    features: [
      "Support for up to 2 live projects",
      "Pre-construction planning and setup",
      "Procurement coordination",
      "Purchase Order (PO) management",
      "Monthly director reporting",
      "Weekly operations huddles",
      "Budget and cost tracking support",
      "Project execution oversight",
      "Workflow and communication coordination",
      "Builder-led commercial control support",
    ],
    cta: "Start a brief",
    href: "#intake",
    featured: false,
  },
  {
    name: "Unlimited Execution Layer",
    price: "From $5,850",
    cadence: "+ GST / month",
    note: "Pricing subject to builder turnover and volume",
    blurb:
      "An integrated estimating and execution partner for builders running a consistent pipeline across multiple live projects.",
    features: [
      "Everything in the Base Execution Layer",
      "Support for up to 4 live projects",
      "Unlimited estimating services",
      "Full trade and supplier RFQ management",
      "Ongoing procurement coordination",
      "Purchase Order (PO) management and tracking",
      "Monthly director reporting and commercial oversight",
      "Weekly operations and workflow huddles",
      "Budget tracking and cost control support",
      "Pre-construction planning and execution management",
      "Builder-led operational and commercial support",
      "Priority workflow coordination and estimating turnaround",
    ],
    cta: "Talk to us",
    href: "#intake",
    featured: true,
  },
];

const tradeTiers: Tier[] = [
  {
    name: "Trade Subscription · Base",
    price: "From $149",
    cadence: "+ GST / month",
    blurb:
      "For trades and suppliers wanting smarter project opportunities through a builder-led estimating and execution network.",
    features: [
      "Access to up to 2 quote opportunities per month",
      "Hawktress Intelligence project matching",
      "Connection to builders actively pricing projects",
      "Early visibility on upcoming tender opportunities",
      "Streamlined RFQ communication process",
      "Exposure to BuildHawk builder network",
      "Designed to reduce time chasing unsuitable work",
    ],
    cta: "Join the trade network",
    href: "#intake",
    featured: false,
  },
  {
    name: "Trade Subscription · Pro",
    price: "From $499",
    cadence: "+ GST / month",
    blurb:
      "For trades and suppliers wanting stronger builder exposure, priority opportunities and consistent project flow through the BuildHawk ecosystem.",
    features: [
      "Everything in the Base trade subscription",
      "Access to up to 5 quote opportunities per month",
      "Priority positioning for builder quote requests",
      "First inline access to selected RFQs and tenders",
      "Increased exposure across the BuildHawk network",
      "Hawktress Intelligence opportunity matching",
      "Streamlined communication and quote coordination",
      "Preferred trade network consideration for ongoing projects",
    ],
    cta: "Join the trade network",
    href: "#intake",
    featured: true,
  },
];

function TierCard({ t, i }: { t: Tier; i: number }) {
  return (
    <Tilt
      as="article"
      max={3}
      lift={4}
      className={`relative flex flex-col p-6 md:p-7 min-h-[460px] border transition-colors bh-pricing-card ${
        t.featured
          ? "bg-bh-ink text-bh-paper border-bh-ink shadow-[0_30px_60px_-20px_rgba(222,81,35,0.25)]"
          : "bg-bh-white text-bh-black border-bh-steel/60 hover:border-bh-graphite/60"
      }`}
      style={{ animationDelay: `${i * 80}ms` }}
    >
      {t.featured && (
        <span className="absolute -top-3 left-6 inline-flex items-center h-6 px-2.5 rounded-full bg-bh-orange text-bh-paper text-[10px] tracking-[0.18em] uppercase font-medium">
          Recommended
        </span>
      )}
      <h3
        className={`text-[18px] md:text-[20px] font-medium tracking-[-0.015em] mb-5 ${
          t.featured ? "text-bh-paper" : "text-bh-black"
        }`}
      >
        {t.name}
      </h3>
      <div className="mb-6">
        <p className="flex items-baseline gap-2 flex-wrap">
          <span
            className={`font-medium tracking-[-0.03em] tabular-nums ${
              t.featured ? "text-bh-orange" : "text-bh-black"
            } text-[34px] md:text-[40px] leading-[1]`}
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
        {t.note && (
          <p
            className={`mt-2 text-[11px] tracking-[0.04em] uppercase ${
              t.featured ? "text-bh-steel/70" : "text-bh-graphite/80"
            }`}
          >
            {t.note}
          </p>
        )}
        <p
          className={`mt-3 text-[13px] leading-[1.5] tracking-[-0.005em] ${
            t.featured ? "text-bh-steel/90" : "text-bh-graphite"
          }`}
        >
          {t.blurb}
        </p>
      </div>

      <ul className="space-y-2.5 mb-8">
        {t.features.map((line) => (
          <li
            key={line}
            className={`flex items-start gap-2.5 text-[13px] leading-[1.45] ${
              t.featured ? "text-bh-steel" : "text-bh-graphite"
            }`}
          >
            <span className="mt-1.5 inline-block w-1 h-1 rounded-full flex-none bg-bh-orange" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <a
        href={t.href}
        className={`mt-auto inline-flex items-center justify-between gap-4 rounded-[8px] pl-5 pr-2 h-11 text-[13px] tracking-[-0.005em] font-medium transition-colors ${
          t.featured
            ? "bg-bh-orange text-bh-paper hover:bg-bh-orange-700"
            : "bg-bh-ink text-bh-paper hover:bg-bh-orange"
        }`}
      >
        {t.cta}
        <span
          className={`inline-flex items-center justify-center rounded-full w-7 h-7 ${
            t.featured ? "bg-bh-paper/20" : "bg-bh-paper/15"
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
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative bg-bh-white py-16 md:py-36 scroll-mt-20"
    >
      <div className="mx-auto max-w-[1480px] px-5 md:px-10">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-8 md:mb-14">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              Pricing
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[32px] sm:text-[40px] md:text-[56px] lg:text-[72px] text-bh-black">
              Built around your build.
              <br />
              <span className="text-bh-graphite">Priced around your scope.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[14px] md:text-[17px] leading-[1.5] tracking-[-0.005em] text-bh-graphite">
              Three ways to engage. A one-off estimate for a single project, a
              monthly execution layer for builders running consistent pipeline,
              or a trade subscription if you supply rather than build. Every
              engagement is shaped after a short brief.
            </p>
          </div>
        </div>

        {/* Builder pricing group */}
        <div className="mb-10 md:mb-14">
          <div className="mb-5 md:mb-7 flex items-baseline gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-bh-orange" />
            <h3 className="text-[14px] tracking-[0.18em] uppercase text-bh-black font-medium">
              For builders
            </h3>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 bh-pricing-grid">
            {builderTiers.map((t, i) => (
              <TierCard key={t.name} t={t} i={i} />
            ))}
          </div>
        </div>

        {/* Trade pricing group */}
        <div className="mb-10 md:mb-14">
          <div className="mb-5 md:mb-7 flex items-baseline gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-bh-orange" />
            <h3 className="text-[14px] tracking-[0.18em] uppercase text-bh-black font-medium">
              For trades and suppliers
            </h3>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 bh-pricing-grid">
            {tradeTiers.map((t, i) => (
              <TierCard key={t.name} t={t} i={i} />
            ))}
          </div>
        </div>

        {/* Hawktress Alliance */}
        <div className="mb-10 md:mb-14">
          <div className="mb-5 md:mb-7 flex items-baseline gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-bh-orange" />
            <h3 className="text-[14px] tracking-[0.18em] uppercase text-bh-black font-medium">
              For supplier partners
            </h3>
          </div>
          <article className="relative flex flex-col md:flex-row gap-6 md:gap-10 p-6 md:p-10 border border-bh-steel/60 bg-bh-white">
            <div className="md:w-1/3">
              <p className="text-[11px] tracking-[0.18em] uppercase text-bh-graphite font-medium">
                Hawktress Alliance
              </p>
              <p className="mt-2 text-[28px] md:text-[34px] font-medium tracking-[-0.02em] leading-[1.05] text-bh-black">
                Complimentary supplier listing.
              </p>
              <p className="mt-3 text-[13px] leading-[1.55] tracking-[-0.005em] text-bh-graphite">
                A connected supplier and builder ecosystem focused on better
                procurement visibility, stronger estimating accuracy, improved
                project coordination, and long-term industry alignment. Not a
                supplier directory: a strategic alliance designed to support
                builders operating within the BuildHawk execution ecosystem.
              </p>
              <a
                href="/partners"
                className="mt-5 inline-flex items-center justify-between gap-4 rounded-[8px] pl-5 pr-2 h-11 text-[13px] tracking-[-0.005em] font-medium bg-bh-ink text-bh-paper hover:bg-bh-orange transition-colors"
              >
                Apply for Alliance listing
                <span className="inline-flex items-center justify-center rounded-full w-7 h-7 bg-bh-paper/15">
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
            </div>
            <div className="md:w-1/3">
              <p className="text-[12px] tracking-[0.04em] uppercase text-bh-graphite font-medium">
                What is included
              </p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Supplier listing within the Hawktress Alliance network",
                  "Exposure to builders operating within the BuildHawk + Hawktress ecosystem",
                  "Inclusion in relevant procurement, estimating and RFQ workflows",
                  "Opportunity to showcase products, systems and supply capabilities to active building companies",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-[13px] leading-[1.45] text-bh-graphite"
                  >
                    <span className="mt-1.5 inline-block w-1 h-1 rounded-full flex-none bg-bh-orange" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/3">
              <p className="text-[12px] tracking-[0.04em] uppercase text-bh-graphite font-medium">
                Alliance requirements
              </p>
              <ul className="mt-3 space-y-2.5">
                {[
                  "Provide current pricing catalogues and product information",
                  "Maintain accurate lead times, supply capabilities and quotation responsiveness",
                  "Support the BuildHawk and Hawktress ecosystem through collaborative engagement",
                  "Include the Hawktress Alliance within broader marketing and partnership activity where reasonably applicable",
                  "Participate in aligned co-branded campaigns, supplier features or ecosystem promotion opportunities",
                ].map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2.5 text-[13px] leading-[1.45] text-bh-graphite"
                  >
                    <span className="mt-1.5 inline-block w-1 h-1 rounded-full flex-none bg-bh-orange" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        {/* Footnote */}
        <div className="mt-10 md:mt-12 grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-9 md:col-start-4">
            <p className="text-[12px] tracking-[-0.005em] text-bh-graphite leading-[1.5]">
              Indicative starting prices, ex GST. Final pricing is set after a
              short brief so it matches your scope, project count and cadence.
              Payment terms 14 days from invoice. Full conditions in the
              builder, trade and supplier terms.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[12px] tracking-[-0.005em]">
              <a
                href="/terms-builders"
                className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4"
              >
                Builder terms
              </a>
              <a
                href="/terms-trades"
                className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4"
              >
                Trade terms
              </a>
              <a
                href="/terms-suppliers"
                className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4"
              >
                Supplier terms
              </a>
              <a
                href="/data-policy"
                className="text-bh-orange hover:text-bh-orange-700 underline underline-offset-4"
              >
                Data policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
