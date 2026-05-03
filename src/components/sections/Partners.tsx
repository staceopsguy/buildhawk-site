import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { partners } from "@/lib/partners";

export default function Partners() {
  return (
    <section
      id="partners"
      className="relative bg-bh-white py-20 md:py-28 border-t border-bh-steel/40"
    >
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-10 md:mb-14">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              05 / Partners
            </p>
          </div>
          <div className="col-span-12 md:col-span-9 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <Reveal as="h2" className="text-[28px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-0.025em] text-bh-black font-medium">
                Operators we work alongside.
              </Reveal>
              <Reveal as="p" className="mt-4 max-w-2xl text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.005em] text-bh-graphite" delay={120}>
                Builders, integrations and accredited specialists supporting
                the Hawktress<sup className="text-[0.5em] align-super">™</sup> platform.
              </Reveal>
            </div>
            <Link
              href="/partners"
              className="group inline-flex items-center gap-3 text-[13px] tracking-[-0.005em] text-bh-black hover:text-bh-orange transition-colors flex-none"
            >
              Partners and accreditation
              <span className="inline-flex items-center justify-center rounded-full w-7 h-7 bg-bh-black/5 group-hover:bg-bh-orange/15 transition-colors">
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
          </div>
        </div>

        <Reveal>
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-bh-steel/40">
            {partners.map((p) => {
              const inner = (
                <>
                  <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                    <Image
                      src={p.src}
                      alt={p.name}
                      width={p.width}
                      height={p.height}
                      className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </div>
                  {p.badge && (
                    <span className="absolute top-3 right-3 inline-flex items-center h-5 px-2 rounded-full bg-bh-orange/10 text-bh-orange text-[9px] tracking-[0.18em] uppercase font-medium">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.2em] uppercase text-[#6e7180] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {p.name}
                  </span>
                </>
              );
              const tileClass =
                "group relative aspect-[5/3] border-r border-b border-bh-steel/40 bg-bh-paper hover:brightness-95 transition-[filter] block";
              return p.url ? (
                <li key={p.name} className="contents">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${p.name} (opens in new tab)`}
                    className={tileClass}
                  >
                    {inner}
                  </a>
                </li>
              ) : (
                <li key={p.name} className={tileClass}>
                  {inner}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
