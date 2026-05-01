import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-dark";

const base =
  "group inline-flex items-center justify-between gap-4 rounded-[8px] pl-5 pr-2 h-11 md:h-12 text-[14px] tracking-[-0.005em] transition-colors";

const variants: Record<Variant, string> = {
  primary:
    "bg-bh-orange text-bh-white hover:bg-bh-orange-700 active:bg-bh-orange-900",
  secondary:
    "bg-transparent border border-bh-orange text-bh-orange hover:bg-bh-orange-50",
  "ghost-dark":
    "bg-transparent border border-bh-steel/30 text-bh-white hover:border-bh-white",
};

function ArrowChip({ tone }: { tone: "light" | "dark" }) {
  const bg =
    tone === "light"
      ? "bg-bh-white/20 group-hover:bg-bh-white/30"
      : "bg-bh-orange/15 group-hover:bg-bh-orange/25";
  const stroke = tone === "light" ? "stroke-bh-white" : "stroke-bh-orange";
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full w-8 h-8 md:w-9 md:h-9 ${bg} transition-colors`}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className={stroke}
        aria-hidden
      >
        <path
          d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export default function Button({
  href,
  children,
  variant = "primary",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
}) {
  const tone =
    variant === "primary" || variant === "ghost-dark" ? "light" : "dark";
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} ${variants[variant]}`}
      >
        <span className="font-medium">{children}</span>
        <ArrowChip tone={tone} />
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${variants[variant]}`}>
      <span className="font-medium">{children}</span>
      <ArrowChip tone={tone} />
    </Link>
  );
}
