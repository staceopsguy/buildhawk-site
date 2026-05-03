import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ArticleCard from "@/components/blog/ArticleCard";
import { getSortedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Insights · BuildHawk · Hawktress",
  description:
    "Field-tested writing on residential construction estimating, contract administration, variation control, and the data behind margin protection. From the BuildHawk team and the Hawktress platform.",
};

export default function InsightsPage() {
  const all = getSortedArticles();
  const [feature, ...rest] = all;

  return (
    <main className="relative bg-bh-white text-bh-black">
      <Nav />

      <section className="pt-32 md:pt-44 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1480px] px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 md:gap-8 mb-12 md:mb-16">
            <div className="col-span-12 md:col-span-3">
              <p className="text-[11px] tracking-[0.2em] uppercase text-bh-graphite">
                Insights
              </p>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h1 className="font-medium tracking-[-0.03em] leading-[1.0] text-[44px] md:text-[68px] lg:text-[88px] text-bh-black">
                Field-tested writing.
                <br />
                <span className="text-bh-graphite">
                  From operators, on operators.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl text-[17px] md:text-[19px] leading-[1.5] tracking-[-0.005em] text-bh-graphite">
                Methodology, field notes, and operator playbooks from the
                BuildHawk team and the Hawktress platform. Written by people who
                actually estimate and administer construction contracts for a
                living.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature article */}
      {feature && (
        <section className="pb-16 md:pb-24">
          <div className="mx-auto max-w-[1480px] px-6 md:px-10">
            <ArticleCard article={feature} variant="feature" />
          </div>
        </section>
      )}

      {/* Hairline divider */}
      <div className="mx-auto max-w-[1480px] px-6 md:px-10">
        <div className="border-t border-bh-steel/60" />
      </div>

      {/* Rest of the archive */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1480px] px-6 md:px-10">
          <div className="flex items-baseline justify-between mb-10 md:mb-12">
            <h2 className="text-[20px] md:text-[24px] font-medium tracking-[-0.015em] text-bh-black">
              Archive
            </h2>
            <p className="text-[12px] tracking-[0.18em] uppercase text-bh-graphite">
              {all.length} pieces · 2024 → 2026
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
            {rest.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-bh-black text-bh-white py-16">
        <div className="mx-auto max-w-[1480px] px-6 md:px-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-[14px] tracking-[-0.005em] text-bh-steel/80">
            © {new Date().getFullYear()} BuildHawk Pty Ltd · Geelong, VIC
          </p>
          <a
            href="/"
            className="text-[13px] tracking-[-0.005em] text-bh-white hover:text-bh-orange transition-colors"
          >
            ← Back to BuildHawk
          </a>
        </div>
        <div className="h-3 md:h-4 bg-bh-orange mt-16" />
      </footer>
    </main>
  );
}
