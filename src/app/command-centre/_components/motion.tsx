"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animate a number from 0 → target over the given duration with ease-out cubic.
 * Returns the current display value. Snappy, GPU-friendly (no react re-render of children).
 */
export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  const toRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = value;
    toRef.current = target;
    startRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = t - startRef.current;
      const p = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(fromRef.current + (toRef.current - fromRef.current) * eased);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

/**
 * 3D parallax tilt on hover. Wrap a card to give it a subtle Apple-style depth.
 * Disabled on touch devices.
 */
export function TiltCard({
  children,
  intensity = 6,
  className = "",
  style,
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(hover: none)").matches) return;

    let raf = 0;
    const reset = () => {
      el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)";
    };
    const onMove = (e: MouseEvent) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateX(${(-y * intensity).toFixed(2)}deg) rotateY(${(x * intensity).toFixed(2)}deg) scale(1.012)`;
      });
    };
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf);
      reset();
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [intensity]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 220ms cubic-bezier(0.18, 1.4, 0.4, 1)",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Fade + slide-up reveal on mount. Used for grouped page entries.
 */
export function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        animation: `fadeUp 520ms cubic-bezier(0.22, 1.2, 0.36, 1) ${delay}ms both`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
