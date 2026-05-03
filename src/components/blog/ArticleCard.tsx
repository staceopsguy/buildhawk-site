import Image from "next/image";
import Link from "next/link";
import { authors, type Article } from "@/lib/articles";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Variant = "feature" | "default" | "compact";

export default function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: Variant;
}) {
  const author = authors[article.authorId];
  const href = `/insights/${article.slug}`;

  if (variant === "feature") {
    return (
      <article className="group">
        <Link href={href} className="block">
          <figure className="relative aspect-[16/10] overflow-hidden bg-bh-cloud mb-6">
            <Image
              src={article.cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              priority
            />
            {article.videoSrc !== undefined || article.videoLabel ? (
              <span className="absolute top-5 left-5 inline-flex items-center gap-2 h-7 px-3 rounded-full bg-bh-black/70 backdrop-blur-sm text-bh-white text-[11px] tracking-[0.18em] uppercase">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 5v14l12-7z" />
                </svg>
                Video
              </span>
            ) : null}
          </figure>
        </Link>
        <div>
          <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase text-bh-graphite mb-3">
            <span className="text-bh-orange">{article.category}</span>
            <span className="w-px h-3 bg-bh-steel" />
            <span>{formatDate(article.date)}</span>
            <span className="w-px h-3 bg-bh-steel" />
            <span>{article.readingTime} min read</span>
          </div>
          <h3 className="text-[28px] md:text-[36px] lg:text-[44px] font-medium tracking-[-0.025em] leading-[1.1] text-bh-black group-hover:text-bh-orange transition-colors">
            <Link href={href}>{article.title}</Link>
          </h3>
          <p className="mt-4 max-w-2xl text-[16px] md:text-[18px] leading-[1.55] tracking-[-0.005em] text-bh-graphite">
            {article.dek}
          </p>
          <p className="mt-5 text-[13px] tracking-[-0.005em] text-bh-graphite">
            By <span className="text-bh-black">{author.name}</span> ·{" "}
            {author.title}
          </p>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex gap-4">
        <Link href={href} className="flex-none">
          <figure className="relative w-24 h-24 md:w-28 md:h-28 overflow-hidden bg-bh-cloud">
            <Image
              src={article.cover}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
            />
          </figure>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-[0.18em] uppercase text-bh-graphite mb-1.5">
            {formatDate(article.date)} · {article.readingTime} min
          </p>
          <h3 className="text-[15px] md:text-[16px] font-medium tracking-[-0.01em] leading-[1.3] text-bh-black group-hover:text-bh-orange transition-colors">
            <Link href={href}>{article.title}</Link>
          </h3>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col h-full">
      <Link href={href} className="block">
        <figure className="relative aspect-[4/3] overflow-hidden bg-bh-cloud mb-5">
          <Image
            src={article.cover}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          {article.videoSrc !== undefined || article.videoLabel ? (
            <span className="absolute top-4 left-4 inline-flex items-center gap-2 h-6 px-2.5 rounded-full bg-bh-black/70 backdrop-blur-sm text-bh-white text-[10px] tracking-[0.18em] uppercase">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M7 5v14l12-7z" />
              </svg>
              Video
            </span>
          ) : null}
        </figure>
      </Link>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2.5 text-[11px] tracking-[0.18em] uppercase text-bh-graphite mb-2.5">
          <span className="text-bh-orange">{article.category}</span>
          <span className="w-px h-3 bg-bh-steel" />
          <span>{formatDate(article.date)}</span>
        </div>
        <h3 className="text-[19px] md:text-[22px] font-medium tracking-[-0.015em] leading-[1.2] text-bh-black group-hover:text-bh-orange transition-colors">
          <Link href={href}>{article.title}</Link>
        </h3>
        <p className="mt-3 text-[14px] leading-[1.5] tracking-[-0.005em] text-bh-graphite line-clamp-3">
          {article.dek}
        </p>
        <p className="mt-4 text-[12px] tracking-[-0.005em] text-bh-graphite">
          By <span className="text-bh-black">{author.name}</span> · {article.readingTime} min read
        </p>
      </div>
    </article>
  );
}
