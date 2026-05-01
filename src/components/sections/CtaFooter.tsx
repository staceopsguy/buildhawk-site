"use client";

import { useEffect, useRef } from "react";
import BrandLockup from "@/components/BrandLockup";
import Button from "@/components/Button";

export default function CtaFooter() {
  const sweepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sweepRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("bh-sweep-on");
            obs.unobserve(el);
          }
        }
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="contact"
      ref={sweepRef}
      className="relative overflow-hidden bg-bh-black text-bh-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-1/4 -top-1/2 h-[200%] origin-left rotate-[-12deg] opacity-0 bh-sweep-anim"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(222,81,35,0) 30%, rgba(222,81,35,0.18) 50%, rgba(222,81,35,0) 70%, transparent 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div className="relative mx-auto max-w-[1480px] px-6 md:px-10 py-24 md:py-36">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-steel/70">
              06 / Engage
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-medium tracking-[-0.03em] leading-[0.95] text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px]">
              Where every build
              <br />
              <span className="text-bh-orange">starts with clarity.</span>
            </h2>
            <p className="mt-8 max-w-2xl text-bh-steel text-[17px] md:text-[19px] leading-[1.55] tracking-[-0.01em]">
              We work with a deliberate number of operators each year. If
              margin protection is a priority on your next project, start with
              a call.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button
                href="https://www.buildhawk.com.au/contact-us"
                external
              >
                Open Intake Form
              </Button>
              <Button href="tel:+61433366607" variant="ghost-dark">
                Call +61 433 366 607
              </Button>
            </div>
          </div>
        </div>

        {/* Highlighted contact panel */}
        <div className="mt-16 md:mt-20 rounded-[12px] border border-bh-orange/40 bg-bh-orange-900/15 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <a
              href="mailto:info@buildhawk.com.au"
              className="group flex items-start gap-4 p-6 md:p-7 border-b md:border-b-0 md:border-r border-bh-orange/25 hover:bg-bh-orange-900/25 transition-colors"
            >
              <span className="mt-1 inline-flex w-9 h-9 rounded-full bg-bh-orange/15 items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M2 4h12v8H2z M2 4l6 4 6-4" stroke="#de5123" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-bh-steel/80">
                  Email
                </p>
                <p className="mt-1 text-bh-white text-[18px] md:text-[20px] tracking-[-0.01em] group-hover:text-bh-orange transition-colors">
                  info@buildhawk.com.au
                </p>
              </div>
            </a>

            <a
              href="tel:+61433366607"
              className="group flex items-start gap-4 p-6 md:p-7 border-b md:border-b-0 md:border-r border-bh-orange/25 hover:bg-bh-orange-900/25 transition-colors"
            >
              <span className="mt-1 inline-flex w-9 h-9 rounded-full bg-bh-orange/15 items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 4a1 1 0 0 1 1-1h1.7a1 1 0 0 1 .98.8l.4 2a1 1 0 0 1-.27.93l-.86.86a8 8 0 0 0 3.06 3.06l.86-.86a1 1 0 0 1 .93-.27l2 .4a1 1 0 0 1 .8.98V12a1 1 0 0 1-1 1A9 9 0 0 1 3 4z"
                    stroke="#de5123"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-bh-steel/80">
                  Phone
                </p>
                <p className="mt-1 text-bh-white text-[18px] md:text-[20px] tracking-[-0.01em] group-hover:text-bh-orange transition-colors">
                  +61 433 366 607
                </p>
              </div>
            </a>

            <a
              href="https://www.buildhawk.com.au/contact-us"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 p-6 md:p-7 hover:bg-bh-orange-900/25 transition-colors"
            >
              <span className="mt-1 inline-flex w-9 h-9 rounded-full bg-bh-orange/15 items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path d="M3 3h7l3 3v7H3z M10 3v3h3" stroke="#de5123" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 8h6 M5 10.5h6" stroke="#de5123" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
              </span>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-bh-steel/80">
                  Intake Form
                </p>
                <p className="mt-1 text-bh-white text-[18px] md:text-[20px] tracking-[-0.01em] group-hover:text-bh-orange transition-colors">
                  buildhawk.com.au/contact-us
                </p>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-20 md:mt-28 pt-10 border-t border-bh-graphite/40 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <BrandLockup tone="dark" size="md" showTagline />
          <div className="flex flex-col md:flex-row md:items-end md:gap-12 gap-3 text-[12px] tracking-[-0.005em] text-bh-steel/70">
            <p>© {new Date().getFullYear()} BuildHawk Pty Ltd</p>
            <p>Geelong, VIC · Australia</p>
            <a className="hover:text-bh-white" href="#top">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>

      {/* Brand signature: bottom orange band (from stationery) */}
      <div className="relative h-3 md:h-4 bg-bh-orange" aria-hidden />

      <style jsx>{`
        .bh-sweep-anim {
          animation: none;
        }
        :global(.bh-sweep-on) .bh-sweep-anim,
        .bh-sweep-on .bh-sweep-anim {
          animation: bh-sweep 2.6s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
        }
        @keyframes bh-sweep {
          0% {
            opacity: 0;
            transform: translateX(-120%) rotate(-12deg);
          }
          15% {
            opacity: 1;
          }
          85% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(120%) rotate(-12deg);
          }
        }
      `}</style>
    </section>
  );
}
