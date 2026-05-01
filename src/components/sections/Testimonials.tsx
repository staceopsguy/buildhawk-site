const quotes = [
  {
    body:
      "BuildHawk's estimating gave us a tender we could actually defend. The margin held all the way to handover.",
    name: "Director",
    role: "Residential Builder, Brisbane",
  },
  {
    body:
      "We replaced three spreadsheets with one operating system. Cost visibility went from monthly to daily.",
    name: "Principal",
    role: "Boutique Developer, Melbourne",
  },
  {
    body:
      "The discipline they bring to variation tracking is the reason this project finished above forecast.",
    name: "Design Partner",
    role: "Architectural Practice, Auckland",
  },
];

export default function Testimonials() {
  return (
    <section className="relative bg-bh-white py-24 md:py-36">
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-8 mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-3">
            <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
              05 / Field Reports
            </p>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-medium tracking-[-0.03em] leading-[1.05] text-[32px] md:text-[48px] lg:text-[60px] text-bh-black">
              Built with operators
              <br />
              <span className="text-bh-graphite">who run a tight ship.</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bh-steel/60">
          {quotes.map((q, i) => (
            <figure
              key={i}
              className="bg-bh-white p-8 md:p-10 flex flex-col min-h-[340px]"
            >
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                aria-hidden
              >
                <path
                  d="M0 16V8C0 3.6 3.6 0 8 0v3C5.2 3 3 5.2 3 8h5v8H0zm12 0V8c0-4.4 3.6-8 8-8v3c-2.8 0-5 2.2-5 5h5v8h-8z"
                  fill="#de5123"
                />
              </svg>
              <blockquote className="mt-6 text-[20px] md:text-[22px] leading-[1.4] tracking-[-0.015em] text-bh-black">
                {q.body}
              </blockquote>
              <figcaption className="mt-auto pt-8 border-t border-bh-steel/60">
                <p className="text-[14px] text-bh-black tracking-[-0.01em]">
                  {q.name}
                </p>
                <p className="text-[12px] text-bh-graphite tracking-[-0.005em] mt-0.5">
                  {q.role}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
