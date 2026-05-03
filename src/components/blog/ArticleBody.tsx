import VideoEmbed from "./VideoEmbed";
import type { Article } from "@/lib/articles";

/**
 * Tiny markdown-ish renderer matching the syntax in src/lib/articles.ts.
 * Supports: ## H2, ### H3, > pull-quote, • bullet, --- HR, plain paragraphs.
 * Optionally interpolates a video embed at the [VIDEO] marker, or after the
 * first H2 if no marker is present.
 */
export default function ArticleBody({ article }: { article: Article }) {
  const lines = article.body.split("\n");
  const blocks: React.ReactNode[] = [];
  let paraBuffer: string[] = [];
  let bulletBuffer: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (paraBuffer.length) {
      blocks.push(
        <p key={`p-${key++}`} className="my-5">
          {paraBuffer.join(" ")}
        </p>
      );
      paraBuffer = [];
    }
  };
  const flushBullets = () => {
    if (bulletBuffer.length) {
      blocks.push(
        <ul key={`u-${key++}`} className="my-5 space-y-2">
          {bulletBuffer.map((b, i) => (
            <li key={i} className="relative pl-5">
              <span className="absolute left-0 top-[0.7em] w-2 h-px bg-bh-orange" />
              {b}
            </li>
          ))}
        </ul>
      );
      bulletBuffer = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (!line) {
      flushPara();
      flushBullets();
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      flushBullets();
      blocks.push(
        <h2
          key={`h2-${key++}`}
          className="mt-12 md:mt-14 mb-4 text-[26px] md:text-[32px] font-medium tracking-[-0.02em] leading-[1.2] text-bh-black"
        >
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      flushPara();
      flushBullets();
      blocks.push(
        <h3
          key={`h3-${key++}`}
          className="mt-8 mb-3 text-[19px] font-medium tracking-[-0.015em] text-bh-black"
        >
          {line.slice(4)}
        </h3>
      );
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      flushBullets();
      blocks.push(
        <blockquote
          key={`q-${key++}`}
          className="my-10 md:my-12 pl-6 md:pl-8 border-l-2 border-bh-orange text-[22px] md:text-[26px] font-medium tracking-[-0.015em] leading-[1.3] text-bh-black"
        >
          {line.slice(2)}
        </blockquote>
      );
      continue;
    }
    if (line.startsWith("• ")) {
      flushPara();
      bulletBuffer.push(line.slice(2));
      continue;
    }
    if (line === "---") {
      flushPara();
      flushBullets();
      blocks.push(
        <hr
          key={`hr-${key++}`}
          className="my-12 md:my-14 border-0 h-px bg-bh-steel/60"
        />
      );
      continue;
    }
    // bold inline rendering: **bold**
    paraBuffer.push(line);
  }
  flushPara();
  flushBullets();

  // Insert video embed after the first H2 if article has video metadata.
  let withVideo = blocks;
  if (article.videoLabel || article.youtubeId) {
    const firstH2Index = blocks.findIndex((b: React.ReactNode) => {
      if (typeof b === "object" && b && "type" in b) {
        return (b as React.ReactElement).type === "h2";
      }
      return false;
    });
    const insertAt = firstH2Index === -1 ? 1 : firstH2Index + 2;
    withVideo = [
      ...blocks.slice(0, insertAt),
      <div key="video-embed" className="my-12 md:my-14">
        <VideoEmbed
          poster={article.videoPoster ?? article.cover}
          label={article.videoLabel ?? "Featured walkthrough"}
          src={article.videoSrc}
          youtubeId={article.youtubeId}
          credit={article.videoCredit}
          alt=""
        />
      </div>,
      ...blocks.slice(insertAt),
    ];
  }

  // Render bold within paragraphs by post-processing children
  const renderBold = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === "string") {
      const parts = node.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((p, i) =>
        /^\*\*.+\*\*$/.test(p) ? (
          <strong key={i} className="text-bh-black font-medium">
            {p.slice(2, -2)}
          </strong>
        ) : (
          p
        )
      );
    }
    return node;
  };

  const transformed = withVideo.map((block, i) => {
    if (
      typeof block === "object" &&
      block &&
      "type" in block &&
      "props" in block
    ) {
      const el = block as React.ReactElement<{ children?: React.ReactNode }>;
      if (
        el.type === "p" ||
        el.type === "h2" ||
        el.type === "h3" ||
        el.type === "blockquote"
      ) {
        const children = el.props.children;
        const newChildren =
          typeof children === "string"
            ? renderBold(children)
            : children;
        return (
          <el.type
            {...(el.props as Record<string, unknown>)}
            key={`tx-${i}`}
          >
            {newChildren}
          </el.type>
        );
      }
    }
    return block;
  });

  return (
    <div className="text-[17px] md:text-[18px] leading-[1.7] tracking-[-0.005em] text-bh-graphite">
      {transformed}
    </div>
  );
}
