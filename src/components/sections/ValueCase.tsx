import Counter from "@/components/motion/Counter";
import Reveal from "@/components/motion/Reveal";

const internalCosts = [
  ["Senior estimator", "$130,000"],
  ["Contract administrator", "$110,000"],
  ["Superannuation (12.5%)", "$30,000"],
  ["WorkCover (4%)", "$9,600"],
  ["Annual leave entitlements", "$18,500"],
  ["Recruitment fees (15%, year 1)", "$36,000"],
  ["Tools, software, onboarding", "$8,000"],
];

const hawktressIncludes = [
  "Estimating across AU and NZ regions",
  "Pre-construction benchmarking",
  "Variation control with 5% threshold enforcement",
  "Live cost tracking and PO management",
  "Contract administration function",
  "Monthly Director report",
  "Cost intelligence database that learns from every job",
];

export default function ValueCase() {
  return (
    <section className="relative bg-bh-cloud py-24 md:py-36">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-14 md:mb-20">
          <Reveal as="div" className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              The capability gap
            </p>
          </Reveal>
          <Reveal as="div" className="col-span-12 md:col-span-9" delay={80}>
            <h2 className="font-medium tracking-[-0.03em] leading-[1.0] text-[36px] md:text-[56px] lg:text-[72px] text-bh-black">
              An intelligence layer.
              <br />
              <span className="text-bh-graphite">
                Not a headcount.
              </span>
            </h2>
            <p className="mt-6 max-w-2xl text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.005em] text-bh-graphite">
              A senior estimator gives you one head. A contract administrator
              gives you another. Hawktress gives you the operating standard,
              the regional benchmarks and the discipline beneath every decision.
              The kind of capability you cannot hire for.
            </p>
          </Reveal>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Internal hire column */}
          <Reveal as="div" className="bg-bh-white border border-bh-steel/60 p-7 md:p-9" duration={800} delay={100}>
            <div className="flex items-baseline justify-between mb-7 pb-5 border-b border-bh-steel/60">
              <h3 className="text-[20px] md:text-[24px] font-medium tracking-[-0.015em] text-bh-black">
                Two senior hires
              </h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-bh-graphite">
                Year 1 · cost of capacity
              </p>
            </div>
            <ul className="divide-y divide-bh-steel/40">
              {internalCosts.map(([k, v]) => (
                <li
                  key={k}
                  className="flex items-baseline justify-between gap-4 py-3 text-[14px]"
                >
                  <span className="text-bh-graphite tracking-[-0.005em]">{k}</span>
                  <span className="text-bh-black tabular-nums">{v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-5 border-t-2 border-bh-black flex items-baseline justify-between">
              <span className="text-[14px] tracking-[0.18em] uppercase text-bh-black">
                Total
              </span>
              <span className="text-[28px] md:text-[36px] font-medium tracking-[-0.02em] text-bh-black tabular-nums">
                <Counter to={342100} prefix="$" duration={1500} />
              </span>
            </div>
            <p className="mt-5 text-[13px] text-bh-graphite leading-[1.5]">
              Two heads of overhead. No regional intelligence layer. No
              benchmarking. No record that compounds across jobs.
            </p>
          </Reveal>

          {/* Hawktress column */}
          <Reveal as="div" className="relative bg-bh-black text-bh-white p-7 md:p-9 overflow-hidden" duration={800} delay={250}>
            <div className="absolute top-0 left-0 right-0 h-1 bg-bh-orange" />
            <div className="flex items-baseline justify-between mb-7 pb-5 border-b border-bh-graphite/40">
              <h3 className="text-[20px] md:text-[24px] font-medium tracking-[-0.015em]">
                Hawktress · Base
              </h3>
              <p className="text-[11px] tracking-[0.18em] uppercase text-bh-steel/80">
                Year 1 · operating standard
              </p>
            </div>
            <ul className="space-y-2.5">
              {hawktressIncludes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px]">
                  <svg
                    className="mt-1 flex-none"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M3 7.5l3 3 5-6"
                      stroke="#de5123"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-bh-steel tracking-[-0.005em] leading-[1.45]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-7 pt-5 border-t-2 border-bh-orange flex items-baseline justify-between">
              <span className="text-[14px] tracking-[0.18em] uppercase">
                Total · Year 1
              </span>
              <span className="text-[28px] md:text-[36px] font-medium tracking-[-0.02em] tabular-nums">
                <Counter to={38500} prefix="$" duration={1500} />
              </span>
            </div>
            <p className="mt-3 text-[12px] text-bh-steel/80 tabular-nums">
              $35,000 annual subscription · $3,500 one-off onboarding
            </p>
          </Reveal>
        </div>

        {/* Reframed savings as a footnote, not a hero number */}
        <Reveal
          as="div"
          className="mt-12 md:mt-16 max-w-3xl text-[14px] md:text-[15px] tracking-[-0.005em] text-bh-graphite leading-[1.55]"
          duration={700}
          delay={400}
        >
          <p>
            Operators who replace internal estimating and CA capacity with
            Hawktress reallocate{" "}
            <span className="text-bh-black">
              <Counter to={303600} prefix="$" duration={1500} /> in year one
            </span>{" "}
            toward delivery, not overhead. The capability gap is the headline.
            The cost differential is the consequence.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
