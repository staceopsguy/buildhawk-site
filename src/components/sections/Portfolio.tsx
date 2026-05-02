import Image from "next/image";
import Reveal from "@/components/motion/Reveal";

export default function Portfolio() {
  return (
    <section className="relative bg-bh-white py-24 md:py-36">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-12 md:mb-16">
          <Reveal as="div" className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              Built For
            </p>
          </Reveal>
          <Reveal as="div" className="col-span-12 md:col-span-9" delay={100}>
            <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[32px] md:text-[48px] lg:text-[60px] text-bh-black">
              Australian residential.
              <br />
              <span className="text-bh-graphite">Engineered for margin.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: tall residential portrait */}
          <Reveal as="figure" duration={900} className="col-span-12 md:col-span-7 relative aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-bh-cloud">
            <Image
              src="/images/residential-gable.webp"
              alt="Residential gable roof under clear sky"
              fill
              priority={false}
              sizes="(min-width: 768px) 58vw, 100vw"
              className="object-cover"
            />
            <figcaption className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-bh-white">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              <div className="relative">
                <p className="text-[11px] tracking-[0.2em] uppercase text-bh-steel/80 mb-2">
                  Project type
                </p>
                <p className="text-[20px] md:text-[24px] tracking-[-0.01em] font-medium">
                  New residential builds &amp; extensions
                </p>
              </div>
            </figcaption>
          </Reveal>

          {/* Right column: stacked */}
          <Reveal as="div" className="col-span-12 md:col-span-5 flex flex-col gap-6" delay={200} duration={900}>
            <figure className="relative aspect-[4/3] overflow-hidden bg-bh-cloud">
              <Image
                src="/images/modern-build.webp"
                alt="Modern multi-residential corner against dusk sky"
                fill
                sizes="(min-width: 768px) 41vw, 100vw"
                className="object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5 text-bh-white">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="relative">
                  <p className="text-[11px] tracking-[0.2em] uppercase text-bh-steel/80 mb-1">
                    Project type
                  </p>
                  <p className="text-[16px] md:text-[18px] tracking-[-0.01em] font-medium">
                    Multi-residential &amp; developer projects
                  </p>
                </div>
              </figcaption>
            </figure>

            {/* Stat block instead of a third image to keep weight balanced */}
            <div className="flex-1 bg-bh-cloud border border-bh-steel/40 p-6 md:p-7 flex flex-col justify-between min-h-[180px]">
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
                  Portfolio scope
                </p>
                <p className="mt-3 text-bh-black text-[18px] md:text-[20px] tracking-[-0.01em] leading-[1.35]">
                  Custom homes, knockdown rebuilds, dual occupancy,
                  townhouse developments, and luxury fit-outs across
                  Australia &amp; New Zealand.
                </p>
              </div>
              <p className="mt-6 text-[12px] tracking-[0.18em] uppercase text-bh-orange">
                25 years on site
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
