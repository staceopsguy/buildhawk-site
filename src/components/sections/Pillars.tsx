"use client";

import dynamic from "next/dynamic";

const PillarPrimitive = dynamic(
  () => import("@/components/three/PillarPrimitive"),
  { ssr: false }
);

const pillars = [
  {
    n: "01",
    title: "Precision Estimating",
    body:
      "Tender-grade quantities. Line-item discipline. Assumption logs that hold up under scrutiny. Built on a margin-protective basis, not a race to the lowest number.",
    variant: "cube" as const,
  },
  {
    n: "02",
    title: "Systems & Implementation",
    body:
      "Embedded operating systems for cost control, procurement and reporting. Replace ad-hoc spreadsheets with workflows that scale with your business.",
    variant: "lattice" as const,
  },
  {
    n: "03",
    title: "Execution Support",
    body:
      "Hands-on partnership through contract administration, variation tracking and progress claim discipline. Margin protection survives the full project life.",
    variant: "plinth" as const,
  },
];

export default function Pillars() {
  return (
    <section id="services" className="relative bg-bh-white py-16 md:py-36">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              02 / Capabilities
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[36px] md:text-[56px] lg:text-[72px] text-bh-black">
              Three disciplines.
              <br />
              <span className="text-bh-graphite">One operating standard.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p) => (
            <article
              key={p.n}
              className="group relative bg-bh-cloud rounded-[2px] p-6 md:p-8 flex flex-col min-h-[520px] md:min-h-[600px] overflow-hidden border border-bh-steel/40 hover:border-bh-graphite/60 transition-colors"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="text-[12px] tracking-[0.2em] text-bh-graphite uppercase">
                  {p.n}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-bh-orange mt-1.5" />
              </div>

              <div className="relative h-56 md:h-72 -mx-2">
                <PillarPrimitive variant={p.variant} />
              </div>

              <div className="mt-auto pt-8">
                <h3 className="text-[24px] md:text-[28px] font-medium tracking-[-0.02em] leading-[1.15] text-bh-black mb-3">
                  {p.title}
                </h3>
                <p className="text-bh-graphite text-[15px] leading-[1.55] tracking-[-0.01em]">
                  {p.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
