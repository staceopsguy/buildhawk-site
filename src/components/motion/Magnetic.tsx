"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  /** Max pull distance in px. Default 8. */
  pull?: number;
  /** Activation radius multiplier. Larger = wider field. Default 1.4. */
  field?: number;
  className?: string;
};

export default function Magnetic({
  children,
  pull = 8,
  field = 1.4,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    const apply = () => {
      curX += (targetX - curX) * 0.22;
      curY += (targetY - curY) * 0.22;
      el.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0)`;
      if (
        Math.abs(targetX - curX) > 0.05 ||
        Math.abs(targetY - curY) > 0.05
      ) {
        raf = requestAnimationFrame(apply);
      }
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const fieldR = (Math.max(r.width, r.height) / 2) * field;
      const dist = Math.hypot(dx, dy);
      if (dist > fieldR) {
        targetX = 0;
        targetY = 0;
      } else {
        const t = 1 - dist / fieldR;
        targetX = (dx / dist) * pull * t || 0;
        targetY = (dy / dist) * pull * t || 0;
      }
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(apply);
    };

    el.style.willChange = "transform";
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [pull, field]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
