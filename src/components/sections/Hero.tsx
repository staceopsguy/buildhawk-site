"use client";

import dynamic from "next/dynamic";
import Button from "@/components/Button";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-bh-cloud"
    >
      <div className="absolute inset-0 z-0">
        <HeroCanvas />
      </div>

      {/* Top hairline */}
      <div className="absolute top-20 md:top-24 left-0 right-0 h-px bg-bh-steel/50" />

      {/* Hawk silhouette accent in the corner field — recurring brand motif */}
      <div className="hidden md:block absolute right-[-4%] top-[18%] w-[34vw] max-w-[520px] aspect-[255/196] opacity-[0.07] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "url(/brand/emblem-1.svg)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-6 md:px-10 pt-32 md:pt-44 pb-24 md:pb-32 min-h-[100svh] flex flex-col">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mt-auto">
          <div className="col-span-12 md:col-span-8 lg:col-span-7">
            <p className="text-[12px] md:text-[13px] tracking-[0.2em] uppercase text-bh-graphite mb-6 md:mb-10">
              <span className="inline-block w-2 h-2 rounded-full bg-bh-orange mr-3 align-middle" />
              Precision Estimating. Disciplined Delivery.
            </p>
            <h1 className="font-medium tracking-[-0.03em] leading-[0.95] text-bh-black text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px]">
              Structured Estimates.
              <br />
              <span className="text-bh-orange">Stronger Builds.</span>
            </h1>
            <p className="mt-8 max-w-xl text-bh-graphite text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.01em]">
              The back-end partner for builders, developers, and owner-builders.
              We protect margins, control costs, and strengthen execution from
              tender through completion.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="#contact">Book a Call</Button>
              <Button href="#services" variant="secondary">
                Explore Services
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom meta strip */}
        <div className="mt-auto pt-16 md:pt-24 grid grid-cols-12 gap-6 md:gap-8 items-end">
          <div className="col-span-6 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite mb-2">
              Office
            </p>
            <p className="text-bh-black text-[14px] md:text-[15px] tracking-[-0.01em]">
              Geelong, VIC · Australia
            </p>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite mb-2">
              Stage
            </p>
            <p className="text-bh-black text-[14px] md:text-[15px] tracking-[-0.01em]">
              Tender → Completion
            </p>
          </div>
          <div className="hidden md:block md:col-span-3" />
          <div className="col-span-12 md:col-span-3 text-right">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              Scroll
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-bh-steel/60" />
    </section>
  );
}
