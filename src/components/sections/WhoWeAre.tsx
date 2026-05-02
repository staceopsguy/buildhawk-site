export default function WhoWeAre() {
  return (
    <section id="about" className="relative bg-bh-cloud py-24 md:py-36">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              04 / Who We Are
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <p className="text-[28px] md:text-[40px] lg:text-[52px] leading-[1.15] tracking-[-0.025em] text-bh-black font-medium">
              BuildHawk is a back-end partner for builders, developers, and
              owner-builders. We{" "}
              <span className="text-bh-orange">protect profit margins</span>,
              control project costs, and strengthen execution.
            </p>
            <p className="mt-8 max-w-3xl text-[17px] md:text-[19px] leading-[1.55] tracking-[-0.01em] text-bh-graphite">
              We do not just prepare estimates. We help construction
              professionals build reliable systems that win projects and deliver
              them successfully from tender through completion. The brand
              stands for structure, clarity, and operational confidence. Calm
              authority, not hype.
            </p>

            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-bh-steel/60">
              {[
                { k: "Industry experience", v: "25 years residential" },
                { k: "Margin protection", v: "First principle" },
                { k: "Office", v: "Geelong, VIC" },
                { k: "Engagement", v: "Tender → Completion" },
              ].map((item) => (
                <div
                  key={item.k}
                  className="bg-bh-cloud p-5 md:p-6 flex flex-col gap-2"
                >
                  <p className="text-[11px] tracking-[0.18em] uppercase text-bh-graphite">
                    {item.k}
                  </p>
                  <p className="text-[18px] md:text-[20px] tracking-[-0.01em] text-bh-black">
                    {item.v}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
