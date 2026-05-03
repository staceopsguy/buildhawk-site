import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/Nav";
import CtaFooter from "@/components/sections/CtaFooter";
import Reveal from "@/components/motion/Reveal";
import {
  accreditations,
  featuredCaseStudy,
  partners,
} from "@/lib/partners";

export const metadata: Metadata = {
  title: "Partners and Accreditation · BuildHawk · Powered by Hawktress™",
  description:
    "BuildHawk partners and accreditation: featured case studies, integrations and credentialed specialists supporting the Hawktress™ platform.",
};

export default function PartnersPage() {
  return (
    <main className="relative bg-bh-white">
      <Nav />

      {/* Page header */}
      <section className="relative pt-32 md:pt-44 pb-16 md:pb-20 border-b border-bh-steel/40">
        <div className="mx-auto max-w-[1480px] px-6 md:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-bh-graphite hover:text-bh-orange transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M11 7H3m0 0L6.5 3.5M3 7l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to BuildHawk
          </Link>
          <div className="mt-8 grid grid-cols-12 gap-6 md:gap-8">
            <div className="col-span-12 md:col-span-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
                Network
              </p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h1 className="text-[40px] md:text-[64px] lg:text-[88px] leading-[1.0] tracking-[-0.03em] text-bh-black font-medium">
                Partners and{" "}
                <span className="text-bh-orange">Accreditation.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] md:text-[19px] leading-[1.55] tracking-[-0.01em] text-bh-graphite">
                The operators who run a tight book, the integrations that
                strengthen the Hawktress<sup className="text-[0.5em] align-super">™</sup> platform,
                and the credentials that sit behind our finance and compliance
                stack.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured case study */}
      <section className="relative py-20 md:py-28">
        <div className="mx-auto max-w-[1480px] px-6 md:px-10">
          <Reveal as="p" className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite mb-6">
            01 / Featured case study
          </Reveal>
          <a
            href={featuredCaseStudy.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${featuredCaseStudy.name} — case study (opens in new tab)`}
            className="group relative grid grid-cols-12 border border-bh-steel/40 bg-bh-cloud hover:border-bh-orange/60 transition-colors overflow-hidden"
          >
            <div className="col-span-12 md:col-span-5 relative bg-bh-white p-8 md:p-12 flex items-center justify-center min-h-[200px] md:min-h-[420px] border-b md:border-b-0 md:border-r border-bh-steel/40">
              <span className="absolute top-4 left-4 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-bh-orange">
                <span className="inline-block w-3 h-px bg-bh-orange" />
                {featuredCaseStudy.category}
              </span>
              <Image
                src={featuredCaseStudy.src}
                alt={featuredCaseStudy.name}
                width={featuredCaseStudy.width}
                height={featuredCaseStudy.height}
                className="max-w-[80%] max-h-[160px] md:max-h-[200px] w-auto h-auto object-contain"
              />
            </div>
            <div className="col-span-12 md:col-span-7 p-8 md:p-12 flex flex-col">
              <p className="text-[11px] tracking-[0.18em] uppercase text-bh-graphite mb-4">
                {featuredCaseStudy.name}
              </p>
              <h2 className="text-[28px] md:text-[36px] lg:text-[44px] leading-[1.1] tracking-[-0.025em] text-bh-black font-medium">
                {featuredCaseStudy.headline}
              </h2>
              <p className="mt-5 text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.005em] text-bh-graphite max-w-xl">
                {featuredCaseStudy.blurb}
              </p>
              <dl className="mt-7 grid grid-cols-3 gap-4 md:gap-6 max-w-md">
                {featuredCaseStudy.metrics.map((m) => (
                  <div key={m.k}>
                    <dt className="text-[10px] tracking-[0.2em] uppercase text-bh-graphite mb-1.5">
                      {m.k}
                    </dt>
                    <dd className="text-[15px] md:text-[16px] tracking-[-0.005em] text-bh-black">
                      {m.v}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 pt-7 border-t border-bh-steel/40">
                <p className="text-[10px] tracking-[0.2em] uppercase text-bh-graphite mb-4">
                  Owners
                </p>
                <ul className="space-y-4 max-w-md">
                  {featuredCaseStudy.owners.map((o) => (
                    <li key={o.name} className="flex items-center gap-4">
                      <span className="relative w-14 h-14 rounded-full overflow-hidden border border-bh-steel/60 bg-bh-cloud flex-none">
                        <Image
                          src={o.src}
                          alt={o.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </span>
                      <span className="flex flex-col leading-tight min-w-0">
                        <span className="text-[14px] tracking-[-0.005em] text-bh-black font-medium">
                          {o.name}
                        </span>
                        <span className="text-[11px] tracking-[0.06em] text-bh-graphite">
                          {o.role}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <span className="mt-8 inline-flex items-center gap-3 text-[13px] tracking-[-0.005em] text-bh-black group-hover:text-bh-orange transition-colors">
                Visit ockendengroup.com
                <span className="inline-flex items-center justify-center rounded-full w-7 h-7 bg-bh-black/5 group-hover:bg-bh-orange/15 transition-colors">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M3.5 10.5 L 10.5 3.5 M 5 3.5 H 10.5 V 9"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </div>
          </a>
        </div>
      </section>

      {/* Operators in the network */}
      <section className="relative py-20 md:py-28 border-t border-bh-steel/40 bg-bh-cloud">
        <div className="mx-auto max-w-[1480px] px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 md:gap-8 mb-10 md:mb-14">
            <div className="col-span-12 md:col-span-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
                02 / Network
              </p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <Reveal as="h2" className="text-[28px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-0.025em] text-bh-black font-medium">
                Operators, integrations and trade specialists.
              </Reveal>
              <Reveal as="p" className="mt-4 max-w-2xl text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.005em] text-bh-graphite" delay={120}>
                A working network of builders, developers, integrations and
                advisors who run alongside Hawktress on live jobs.
              </Reveal>
            </div>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-bh-steel/40 bg-bh-white">
            {partners.map((p) => {
              const inner = (
                <>
                  <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                    <Image
                      src={p.src}
                      alt={p.name}
                      width={p.width}
                      height={p.height}
                      className="max-h-full max-w-full w-auto h-auto object-contain transition-[filter,opacity] duration-500 [@media(hover:hover)]:grayscale [@media(hover:hover)]:opacity-60 [@media(hover:hover)]:group-hover:grayscale-0 [@media(hover:hover)]:group-hover:opacity-100"
                    />
                  </div>
                  {p.badge && (
                    <span className="absolute top-3 right-3 inline-flex items-center h-5 px-2 rounded-full bg-bh-orange/10 text-bh-orange text-[9px] tracking-[0.18em] uppercase font-medium">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 left-4 text-[10px] tracking-[0.2em] uppercase text-bh-graphite opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-300">
                    {p.name}
                  </span>
                </>
              );
              const tileClass =
                "group relative aspect-[5/3] border-r border-b border-bh-steel/40 bg-bh-white hover:bg-bh-cloud transition-colors block";
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
        </div>
      </section>

      {/* Accreditation */}
      <section className="relative py-20 md:py-28 border-t border-bh-steel/40">
        <div className="mx-auto max-w-[1480px] px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 md:gap-8 mb-10 md:mb-14">
            <div className="col-span-12 md:col-span-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
                03 / Accreditation
              </p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <Reveal as="h2" className="text-[28px] md:text-[40px] lg:text-[48px] leading-[1.15] tracking-[-0.025em] text-bh-black font-medium">
                Credentials behind the finance stack.
              </Reveal>
              <Reveal as="p" className="mt-4 max-w-2xl text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.005em] text-bh-graphite" delay={120}>
                Awards and recognition held by the partners we engage. Carried
                through to BuildHawk projects via our integrated finance
                workflow with{" "}
                <a
                  href="https://xactaccounting.com.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-bh-black underline underline-offset-4 hover:text-bh-orange transition-colors"
                >
                  Xact Accounting
                </a>
                .
              </Reveal>
            </div>
          </div>

          {/* Awards strip — Xact Accounting 2025 */}
          <Reveal>
            <a
              href="https://xactaccounting.com.au/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Xact Accounting 2025 awards (opens in new tab)"
              className="group block bg-bh-white border border-bh-steel/40 hover:border-bh-orange/60 transition-colors p-6 md:p-10"
            >
              <div className="grid grid-cols-12 gap-6 md:gap-8 items-center">
                <div className="col-span-12 md:col-span-4">
                  <p className="text-[11px] tracking-[0.18em] uppercase text-bh-orange mb-3">
                    Through Xact Accounting · 2025
                  </p>
                  <h3 className="text-[22px] md:text-[26px] tracking-[-0.02em] text-bh-black font-medium leading-[1.2]">
                    Three industry awards.{" "}
                    <span className="text-bh-graphite">One finance partner.</span>
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.55] text-bh-graphite max-w-xs">
                    Australian Accounting Awards · AFR Top 100 · Commercial
                    Finance Awards. The discipline behind every BuildHawk
                    director report.
                  </p>
                </div>
                <div className="col-span-12 md:col-span-8 relative bg-bh-cloud">
                  <Image
                    src="/images/xact-awards-2025.png"
                    alt="Xact Accounting 2025 awards: Australian Accounting Awards Firm of the Year, Financial Review Top 100 Accounting Firms, Commercial Finance Awards Accounting Practice of the Year"
                    width={1178}
                    height={400}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>
            </a>
          </Reveal>

          {/* Itemised list of accreditations */}
          <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-px bg-bh-steel/40 border border-bh-steel/40">
            {accreditations.map((a) => (
              <li key={a.name} className="bg-bh-white p-6 md:p-7 flex flex-col">
                <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-bh-orange mb-3">
                  <span className="inline-block w-3 h-px bg-bh-orange" />
                  Award · 2025
                </span>
                <p className="text-[15px] md:text-[16px] tracking-[-0.01em] text-bh-black font-medium leading-[1.35]">
                  {a.name}
                </p>
                <p className="mt-3 text-[13px] leading-[1.55] text-bh-graphite flex-1">
                  {a.description}
                </p>
                <a
                  href={a.throughUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-bh-graphite hover:text-bh-orange transition-colors"
                >
                  Held by {a.through}
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M3.5 10.5 L 10.5 3.5 M 5 3.5 H 10.5 V 9"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaFooter />
    </main>
  );
}
