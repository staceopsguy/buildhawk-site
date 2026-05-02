// Motion tokens shared across the site.
// Calm-authority: slow eases, no bounces, no springs.

export const easeOutExpo = (t: number): number =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

// (0.2, 0.7, 0.2, 1) — slow start, smooth end. Brand default.
export const cubicBezier = "cubic-bezier(0.2, 0.7, 0.2, 1)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Format number with comma thousand separators
export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}
