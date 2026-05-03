import Reveal from "@/components/motion/Reveal";
import Counter from "@/components/motion/Counter";

const stages = [
  {
    n: "01",
    name: "Estimating",
    function: "Trade quotes, BOQ, scope, RFQ management",
    role: "Captures all quote data. Flags costs outside the 5% regional threshold before the estimate is issued.",
  },
  {
    n: "02",
    name: "Pre-construction",
    function: "Feasibility, budget confirmation, procurement strategy",
    role: "Real market benchmarks validate the budget. Margin position locked before contract signed.",
  },
  {
    n: "03",
    name: "Contract admin",
    function: "Variation control, PO tracking, cost commitments",
    role: "Every variation checked against 5%. Out-of-threshold items referred to the Director.",
  },
  {
    n: "04",
    name: "Project execution",
    function: "Live cost tracking, supplier performance, programme",
    role: "Actual costs monitored against committed values. Margin erosion flagged in real time.",
  },
  {
    n: "05",
    name: "Practical completion",
    function: "Final cost reconciliation, defects liability, handover",
    role: "Final report. Quote vs. actual reconciled trade by trade and supplier by supplier.",
  },
  {
    n: "06",
    name: "Intelligence layer",
    function: "Data feeds back into the system",
    role: "Every completed job sharpens the benchmarks. The system gets more accurate with every project.",
  },
  {
    n: "07",
    name: "Reporting",
    function: "Monthly Director report",
    role: "All active jobs, margin position, variations, committed costs, forecast revenue, cash position.",
  },
];

export default function Lifecycle() {
  return (
    <section
      id="hawktress"
      className="relative bg-bh-white py-24 md:py-36 scroll-mt-20"
    >
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-14 md:mb-20">
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
            <p className="text-[18px] md:text-[20px] leading-[1.5] tracking-[-0.01em] text-bh-graphite">
              Most platforms stop at estimating. Hawktress connects intelligence
              across every stage of the project. It captures real quote-to-actual
              data from live Australian and New Zealand jobs, then uses that data
              to flag cost risk before it becomes margin loss.
            </p>
            <p className="mt-5 text-[14px] tracking-[-0.005em] text-bh-graphite">
              Powered by BuildHawk · Built by builders, for builders.
            </p>
          </Reveal>
        </div>

        {/* Stages — 7 column grid on desktop, scroll on mobile */}
        <div className="relative">
          {/* connecting hairline behind cards */}
          <div className="hidden md:block absolute left-0 right-0 top-[18px] h-px bg-bh-steel/60" />

          <div className="grid grid-cols-1 md:grid-cols-7 gap-px bg-bh-steel/60 border border-bh-steel/60">
            {stages.map((s, i) => (
              <Reveal
                as="article"
                key={s.n}
                delay={i * 90}
                duration={650}
                y={28}
                className="relative bg-bh-white p-5 md:p-6 flex flex-col min-h-[260px] md:min-h-[320px] hover:bg-bh-cloud transition-colors group"
              >
                {/* number dot */}
                <div className="flex items-center gap-3 mb-5 md:mb-6">
                  <span
                    className={`relative z-10 inline-flex items-center justify-center w-9 h-9 rounded-full text-[12px] font-medium tracking-[-0.005em] ${
                      i === stages.length - 1
                        ? "bg-bh-orange text-bh-white"
                        : "bg-bh-white border border-bh-steel/60 text-bh-graphite group-hover:border-bh-orange group-hover:text-bh-orange"
                    } transition-colors`}
                  >
                    {s.n}
                  </span>
                </div>

                <h3 className="text-[16px] md:text-[17px] font-medium tracking-[-0.015em] leading-[1.2] text-bh-black mb-2">
                  {s.name}
                </h3>
                <p className="text-[12px] tracking-[0.005em] text-bh-graphite mb-4 leading-[1.4]">
                  {s.function}
                </p>
                <p className="mt-auto text-[13px] leading-[1.45] tracking-[-0.005em] text-bh-black/85">
                  {s.role}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Threshold callout */}
          <Reveal
            as="div"
            duration={900}
            className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-center gap-5 md:gap-10"
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
