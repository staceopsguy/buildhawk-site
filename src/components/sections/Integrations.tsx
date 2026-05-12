"use client";

import Reveal from "@/components/motion/Reveal";
import { CONNECTORS, statusLabel, connectorGroups } from "@/lib/integrations/connectors";

const STATUS_TONE: Record<string, string> = {
  live: "bg-emerald-50 text-emerald-700 border-emerald-200",
  beta: "bg-sky-50 text-sky-700 border-sky-200",
  planned: "bg-amber-50 text-amber-700 border-amber-200",
  "on-request": "bg-slate-50 text-slate-600 border-slate-200",
};

export default function Integrations() {
  return (
    <section
      id="integrations"
      className="relative bg-bh-cloud py-16 md:py-32 scroll-mt-20"
    >
      <div className="mx-auto max-w-[1480px] px-5 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-10 md:mb-14">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              Integrations
            </p>
          </div>
          <Reveal as="div" className="col-span-12 md:col-span-9" duration={700}>
            <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[32px] sm:text-[40px] md:text-[56px] lg:text-[68px] text-bh-black">
              Bring your own stack.
              <br />
              <span className="text-bh-graphite">Hawktress plugs into it.</span>
            </h2>
            <p className="mt-6 max-w-2xl text-[14px] md:text-[17px] leading-[1.55] tracking-[-0.005em] text-bh-graphite">
              No swap-and-pray migration. Hawktress connects to whatever PM, CRM, trade-management or accounting tool you already run, pulls the data the Cost Plan Console needs, and writes nothing back unless you ask it to. Don&apos;t see your tool? Request it from inside the app and we&apos;ll scope a connector.
            </p>
          </Reveal>
        </div>

        <div className="space-y-8">
          {connectorGroups.map((group) => {
            const inGroup = CONNECTORS.filter((c) => c.group === group);
            if (inGroup.length === 0) return null;
            return (
              <div key={group}>
                <div className="text-[11px] tracking-[0.18em] uppercase text-bh-graphite font-semibold mb-3">
                  {group}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {inGroup.map((c) => (
                    <div
                      key={c.id}
                      className="bg-bh-white rounded-[10px] border border-bh-steel/60 p-4 hover:border-bh-graphite/60 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-medium text-bh-black text-[15px] tracking-[-0.01em]">
                          {c.name}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-wider font-bold rounded px-1.5 py-0.5 border ${STATUS_TONE[c.status]}`}
                        >
                          {statusLabel[c.status]}
                        </span>
                      </div>
                      <p className="text-[12px] text-bh-graphite leading-[1.45]">{c.blurb}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 md:mt-14 text-center">
          <p className="text-[13px] tracking-[-0.005em] text-bh-graphite mb-3">
            Built on a different tool? We&apos;ll build the connector.
          </p>
          <a
            href="/command-centre/signup"
            className="inline-flex items-center h-11 px-5 rounded-[8px] bg-bh-ink text-bh-paper text-[13px] tracking-[-0.005em] hover:bg-bh-orange transition-colors"
          >
            Start free trial · request a connector
          </a>
        </div>
      </div>
    </section>
  );
}
