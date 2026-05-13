/**
 * Standardized BuildHawk button.
 *
 * Matches the UI Button sheet:
 *   variant     primary | secondary | ghost
 *   size        lg (default) | sm
 *   states      default · hover · pressed · disabled
 *   trailing    optional circle-arrow icon (matches spec)
 *
 * Spec swatches:
 *   Primary    bg #DE5123 · hover #BC3C12 · pressed #9A2A06 · disabled #FFCEBE
 *   Secondary  border #DE5123 · hover bg #FFF0EB · pressed bg #FFCEBE
 */

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";

export type BrandButtonVariant = "primary" | "secondary" | "ghost";
export type BrandButtonSize = "lg" | "sm";

type CommonProps = {
  variant?: BrandButtonVariant;
  size?: BrandButtonSize;
  trailingIcon?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
  className?: string;
};

type ButtonProps = CommonProps & {
  href?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps>;

type AnchorProps = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | "href">;

export type BrandButtonProps = ButtonProps | AnchorProps;

const VARIANT_CLASSES: Record<BrandButtonVariant, string> = {
  primary: [
    "bg-bh-orange-500 text-bh-paper border border-bh-orange-500",
    "hover:bg-bh-orange-700 hover:border-bh-orange-700",
    "active:bg-bh-orange-900 active:border-bh-orange-900",
    "disabled:bg-bh-orange-200 disabled:border-bh-orange-200 disabled:text-bh-paper disabled:cursor-not-allowed",
    "aria-disabled:bg-bh-orange-200 aria-disabled:border-bh-orange-200 aria-disabled:text-bh-paper aria-disabled:cursor-not-allowed",
  ].join(" "),
  secondary: [
    "bg-transparent text-bh-orange-500 border border-bh-orange-500",
    "hover:bg-bh-orange-50 hover:border-bh-orange-500",
    "active:bg-bh-orange-200 active:border-bh-orange-200 active:text-bh-orange-900",
    "disabled:text-bh-orange-200 disabled:border-bh-orange-200 disabled:cursor-not-allowed",
    "aria-disabled:text-bh-orange-200 aria-disabled:border-bh-orange-200 aria-disabled:cursor-not-allowed",
  ].join(" "),
  ghost: [
    "bg-transparent text-bh-black border border-transparent",
    "hover:text-bh-orange-700 hover:bg-bh-orange-50",
    "active:text-bh-orange-900",
    "disabled:text-bh-graphite disabled:cursor-not-allowed",
  ].join(" "),
};

const SIZE_CLASSES: Record<BrandButtonSize, string> = {
  lg: "h-11 px-5 text-[13px] tracking-[-0.005em] rounded-[8px] gap-2",
  sm: "h-9 px-3.5 text-[12px] tracking-[-0.005em] rounded-[8px] gap-1.5",
};

const ICON_DIAMETER: Record<BrandButtonSize, number> = {
  lg: 20,
  sm: 16,
};

function TrailingArrowCircle({ size }: { size: BrandButtonSize }) {
  const d = ICON_DIAMETER[size];
  // White circle outline with arrow — same construction in either variant.
  // Stroke inherits currentColor so it matches the button text.
  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 opacity-90"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 8l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner({ size }: { size: BrandButtonSize }) {
  const d = ICON_DIAMETER[size];
  return (
    <svg
      width={d}
      height={d}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 animate-spin"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2.4" />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function inner({
  loading,
  children,
  trailingIcon,
  leadingIcon,
  size,
}: {
  loading?: boolean;
  children: ReactNode;
  trailingIcon?: boolean;
  leadingIcon?: ReactNode;
  size: BrandButtonSize;
}) {
  return (
    <>
      {leadingIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      <span className="whitespace-nowrap">{children}</span>
      {loading ? <Spinner size={size} /> : trailingIcon ? <TrailingArrowCircle size={size} /> : null}
    </>
  );
}

const baseClass =
  "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bh-orange-500 focus-visible:ring-offset-2";

export default function BrandButton(props: BrandButtonProps) {
  const variant = props.variant ?? "primary";
  const size = props.size ?? "lg";
  const fullWidth = props.fullWidth ? "w-full" : "";
  const cls = [
    baseClass,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    fullWidth,
    props.className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if ("href" in props && props.href !== undefined) {
    const { href, external, variant: _v, size: _s, trailingIcon, leadingIcon, loading, fullWidth: _f, children, className: _c, ...rest } = props;
    void _v;
    void _s;
    void _f;
    void _c;
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={cls}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {inner({ loading, children, trailingIcon, leadingIcon, size })}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...(rest as Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">)}>
        {inner({ loading, children, trailingIcon, leadingIcon, size })}
      </Link>
    );
  }

  const { variant: _v, size: _s, trailingIcon, leadingIcon, loading, fullWidth: _f, children, className: _c, ...rest } = props as ButtonProps;
  void _v;
  void _s;
  void _f;
  void _c;
  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner({ loading, children, trailingIcon, leadingIcon, size })}
    </button>
  );
}
