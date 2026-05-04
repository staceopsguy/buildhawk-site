"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";

type Stage = {
  n: string;
  name: string;
  function: string;
  role: string;
  read: { slug: string; label: string };
};

const stages: Stage[] = [
  {
    n: "01",
    name: "Estimating",
    function: "Trade quotes, BOQ, scope, RFQ management",
    role: "Captures all quote data. Flags costs outside the 5% regional threshold before the estimate is issued.",
    read: {
      slug: "five-percent-variance-threshold",
      label: "The 5% variance threshold",
    },
  },
  {
    n: "02",
    name: "Pre-construction",
    function: "Feasibility, budget confirmation, procurement strategy",
    role: "Real market benchmarks validate the budget. Margin position locked before contract signed.",
    read: {
      slug: "underpricing-sitework-year-one",
      label: "Why builders underprice sitework",
    },
  },
  {
    n: "03",
    name: "Contract admin",
    function: "Variation control, PO tracking, cost commitments",
    role: "Every variation checked against 5%. Out-of-threshold items referred to the Director.",
    read: {
      slug: "variation-control-three-questions",
      label: "Three questions before you approve",
    },
  },
  {
    n: "04",
    name: "Project execution",
    function: "Live cost tracking, supplier performance, programme",
    role: "Actual costs monitored against committed values. Margin erosion flagged in real time.",
    read: {
      slug: "five-percent-variance-threshold",
      label: "Holding the line on live cost",
    },
  },
  {
    n: "05",
    name: "Practical completion",
    function: "Final cost reconciliation, defects liability, handover",
    role: "Final report. Quote vs. actual reconciled trade by trade and supplier by supplier.",
    read: {
      slug: "monthly-director-report-walkthrough",
      label: "How the final report reconciles",
    },
  },
  {
    n: "06",
    name: "Intelligence layer",
    function: "Data feeds back into the system",
    role: "Every completed job sharpens the benchmarks. The system gets more accurate with every project.",
    read: {
      slug: "building-hawktress-builder-builds-software",
      label: "How a builder builds the data layer",
    },
  },
  {
    n: "07",
    name: "Reporting",
    function: "Monthly Director report",
    role: "All active jobs, margin position, variations, committed costs, forecast revenue, cash position.",
    read: {
      slug: "monthly-director-report-walkthrough",
      label: "Reading the monthly Director report",
    },
  },
];

export default function Lifecycle() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stage = stages[active];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const inView = r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4;
      if (!inView) return;
      e.preventDefault();
      setActive((i) =>
        e.key === "ArrowRight"
          ? (i + 1) % stages.length
          : (i - 1 + stages.length) % stages.length
      );
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      id="hawktress"
      ref={sectionRef}
      className="relative bg-bh-white py-16 md:py-36 scroll-mt-20"
    >
      <div className="mx-auto max-w-[1480px] px-5 md:px-10">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-12 md:mb-16">
          <Reveal as="div" className="col-span-12 md:col-span-4" duration={750}>
            <span className="inline-flex items-center gap-2 px-3 h-7 rounded-full bg-bh-orange-50 border border-bh-orange/30 text-[11px] tracking-[0.18em] uppercase text-bh-orange-700 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-bh-orange" />
              Hawktress
            </span>
            <h2 className="font-medium tracking-[-0.03em] leading-[1.0] text-[36px] md:text-[52px] lg:text-[68px] text-bh-black">
              The cost intelligence
              <br />
              <span className="text-bh-graphite">platform inside every build.</span>
            </h2>
          </Reveal>
          <Reveal as="div" className="col-span-12 md:col-span-7 md:col-start-6 md:pt-3" delay={180} duration={750}>
            <p className="text-[16px] md:text-[19px] leading-[1.5] tracking-[-0.01em] text-bh-graphite">
              Hawktress connects intelligence across every stage of the project.
              Real quote-to-actual data from live Australian and New Zealand
              jobs, used to flag cost risk before it becomes margin loss.
            </p>
            <p className="mt-4 text-[12px] md:text-[13px] tracking-[0.04em] text-bh-graphite/80">
              Powered by BuildHawk · Built by builders, for builders.
            </p>
          </Reveal>
        </div>

        {/* Stage chip strip — horizontally scrollable on mobile */}
        <div className="relative">
          <div
            role="tablist"
            aria-label="Hawktress lifecycle stages"
            className="-mx-5 md:mx-0 px-5 md:px-0 overflow-x-auto md:overflow-visible flex md:grid md:grid-cols-7 gap-2 md:gap-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory"
          >
            {stages.map((s, i) => {
              const selected = i === active;
              return (
                <button
                  key={s.n}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`lifecycle-panel-${s.n}`}
                  onClick={() => setActive(i)}
                  className={`group relative snap-start flex-none md:flex-auto flex flex-col items-start text-left px-4 md:px-5 py-3 md:py-4 border-t-2 transition-colors min-w-[150px] md:min-w-0 ${
                    selected
                      ? "border-bh-orange"
                      : "border-bh-steel/40 hover:border-bh-graphite/60"
                  }`}
                >
                  <span
                    className={`text-[10px] tracking-[0.2em] uppercase mb-1.5 transition-colors ${
                      selected ? "text-bh-orange" : "text-bh-graphite"
                    }`}
                  >
                    {s.n}
                  </span>
                  <span
                    className={`text-[14px] md:text-[15px] tracking-[-0.01em] font-medium leading-[1.2] transition-colors ${
                      selected ? "text-bh-black" : "text-bh-graphite group-hover:text-bh-black"
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel — re-mounts on active change so the fade-in plays */}
          <div
            key={active}
            id={`lifecycle-panel-${stage.n}`}
            role="tabpanel"
            aria-labelledby={`lifecycle-tab-${stage.n}`}
            className="mt-8 md:mt-10 grid grid-cols-12 gap-6 md:gap-10 bh-stage-in"
          >
            <div className="col-span-12 md:col-span-7">
              <p className="text-[10px] tracking-[0.2em] uppercase text-bh-graphite mb-4">
                {stage.function}
              </p>
              <p className="text-[22px] md:text-[28px] lg:text-[32px] leading-[1.25] tracking-[-0.02em] text-bh-black font-medium max-w-2xl">
                {stage.role}
              </p>
            </div>
            <div className="col-span-12 md:col-span-5 md:pl-8 md:border-l border-bh-steel/40">
              <p className="text-[10px] tracking-[0.2em] uppercase text-bh-orange mb-3">
                Read field note
              </p>
              <Link
                href={`/insights/${stage.read.slug}`}
                className="group inline-flex items-start gap-3 text-bh-black hover:text-bh-orange transition-colors"
              >
                <span className="text-[18px] md:text-[20px] tracking-[-0.01em] font-medium leading-[1.3] max-w-xs">
                  {stage.read.label}
                </span>
                <span className="mt-1 inline-flex items-center justify-center rounded-full w-7 h-7 bg-bh-black/5 group-hover:bg-bh-orange/15 transition-colors flex-none">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
              <p className="mt-4 text-[12px] tracking-[0.04em] text-bh-graphite/80">
                {active + 1} of {stages.length} · use ← / → keys
              </p>
            </div>
          </div>

          {/* Progress dots — clickable + reflect active stage */}
          <div className="mt-10 md:mt-12 flex items-center gap-2">
            {stages.map((s, i) => (
              <button
                key={s.n}
                type="button"
                aria-label={`Go to stage ${s.n} ${s.name}`}
                onClick={() => setActive(i)}
                className={`h-1 rounded-full transition-all ${
                  i === active ? "w-10 bg-bh-orange" : "w-5 bg-bh-steel/60 hover:bg-bh-graphite/60"
                }`}
              />
            ))}
          </div>

          {/* Threshold callout */}
          <Reveal
            as="div"
            duration={900}
            className="mt-12 md:mt-16 pt-10 md:pt-12 border-t border-bh-steel/40 flex flex-col md:flex-row md:items-center gap-5 md:gap-10"
          >
            <p className="flex-none font-medium tracking-[-0.03em] leading-[0.95] text-bh-orange text-[64px] md:text-[88px] tabular-nums whitespace-nowrap">
              <Counter to={5} suffix="%" duration={1100} />
            </p>
            <p className="flex-1 max-w-3xl text-[16px] md:text-[18px] leading-[1.5] tracking-[-0.01em] text-bh-black">
              <span className="font-medium">The variance threshold.</span>{" "}
              <span className="text-bh-graphite">
                Any quote, variation, or actual cost more than 5% outside the
                rolling regional average triggers an automatic flag.
                Out-of-threshold items require Director approval before the CA
                can proceed.
              </span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
