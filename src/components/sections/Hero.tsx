"use client";

import dynamic from "next/dynamic";
import Button from "@/components/Button";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";

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

      {/* Hawk emblem accent in the corner field — recurring brand motif */}
      <div className="hidden md:block absolute right-[-4%] top-[14%] w-[36vw] max-w-[560px] aspect-[255/196] opacity-[0.16] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "url(/brand/emblem-bh.svg)",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-5 md:px-10 pt-24 md:pt-44 pb-14 md:pb-32 min-h-[100svh] flex flex-col">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mt-auto">
          <div className="col-span-12 md:col-span-8 lg:col-span-7">
            <Reveal as="p" className="text-[11px] md:text-[13px] tracking-[0.2em] uppercase text-bh-graphite mb-5 md:mb-10 inline-flex items-center gap-2.5 md:gap-3 flex-wrap" duration={700}>
              <span className="relative inline-flex items-center justify-center w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-bh-orange bh-pulse" />
                <span className="relative inline-block w-2 h-2 rounded-full bg-bh-orange" />
              </span>
              <span className="text-bh-orange font-semibold">25 years</span>
              <span className="inline-block w-px h-3 bg-bh-steel/70" />
              <span>Residential construction</span>
            </Reveal>
            <Reveal as="h1" className="font-medium tracking-[-0.03em] leading-[0.95] text-bh-black text-[44px] min-[420px]:text-[52px] sm:text-[80px] md:text-[112px] lg:text-[148px]" duration={900} delay={120}>
              Precision Estimating.
              <br />
              <span className="text-bh-orange">Disciplined Delivery.</span>
            </Reveal>
            <Reveal as="p" className="mt-6 md:mt-8 max-w-xl text-bh-graphite text-[15px] md:text-[19px] leading-[1.5] tracking-[-0.01em]" duration={700} delay={300}>
              Twenty-five years inside Australian residential construction.
              The back-end partner for builders, developers and owner-builders.
              We protect margins, control costs and strengthen execution from
              tender through completion.
            </Reveal>
            <Reveal as="div" className="mt-7 md:mt-10 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 w-full sm:w-auto" duration={700} delay={420}>
              <Magnetic pull={6} className="w-full sm:w-auto">
                <Button href="#intake">Start Your Brief</Button>
              </Magnetic>
              <Button href="#hawktress" variant="secondary">
                Explore Hawktress
              </Button>
            </Reveal>
          </div>
        </div>

        {/* Bottom meta strip */}
        <div className="mt-auto pt-10 md:pt-24 grid grid-cols-2 md:grid-cols-12 gap-y-5 gap-x-4 md:gap-6 lg:gap-8 items-end">
          <div className="md:col-span-3">
            <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-bh-graphite mb-1.5 md:mb-2">
              Experience
            </p>
            <p className="text-bh-black text-[13px] md:text-[15px] tracking-[-0.01em]">
              <span className="text-bh-orange font-semibold">25 yrs</span>{" "}
              residential construction
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-bh-graphite mb-1.5 md:mb-2">
              Office
            </p>
            <p className="text-bh-black text-[13px] md:text-[15px] tracking-[-0.01em]">
              Geelong, VIC · Australia
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-bh-graphite mb-1.5 md:mb-2">
              Stage
            </p>
            <p className="text-bh-black text-[13px] md:text-[15px] tracking-[-0.01em]">
              Tender → Completion
            </p>
          </div>
          <div className="hidden md:block md:col-span-3 md:text-right">
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
