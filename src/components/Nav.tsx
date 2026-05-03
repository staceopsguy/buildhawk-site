"use client";

import { useEffect, useState } from "react";
import BrandLockup from "@/components/BrandLockup";

const links = [
  { href: "/#hawktress", label: "Hawktress" },
  { href: "/#how", label: "How It Works" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/#about", label: "About" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-md bg-bh-white/80 border-b border-bh-steel/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1480px] px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex items-center">
          <BrandLockup tone="light" size="sm" />
        </a>
        <nav className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] tracking-[-0.005em] text-bh-graphite hover:text-bh-black transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3 md:gap-4">
          <a
            href="tel:+61433366607"
            className="hidden lg:inline-flex items-center gap-2 text-[13px] tracking-[-0.005em] text-bh-graphite hover:text-bh-orange transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path
                d="M2.5 3a1 1 0 0 1 1-1h1.6a1 1 0 0 1 .98.8l.4 2a1 1 0 0 1-.27.93l-.86.86a8 8 0 0 0 3.06 3.06l.86-.86a1 1 0 0 1 .93-.27l2 .4a1 1 0 0 1 .8.98V11a1 1 0 0 1-1 1A9 9 0 0 1 2.5 3z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            +61 433 366 607
          </a>
          <a
            href="/#intake"
            className="inline-flex items-center h-10 px-5 rounded-[8px] bg-bh-black text-bh-white text-[13px] tracking-[-0.005em] hover:bg-bh-orange transition-colors"
          >
            Start Brief
          </a>
        </div>
      </div>
    </header>
  );
}
