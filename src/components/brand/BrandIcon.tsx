/**
 * Brand icon library wrapper.
 *
 * Renders an icon from the official BuildHawk iconography set
 * (/public/brand/icons/*.svg). Icons inherit currentColor for stroke when
 * the underlying SVG uses stroke="currentColor"; for filled icons inherit
 * fill via the `style` prop.
 *
 * Usage:
 *   <BrandIcon name="search" size={18} className="text-bh-graphite" />
 */

import Image from "next/image";

export const BRAND_ICON_NAMES = [
  "Menu-vertical",
  "Search",
  "Zoom-in",
  "add",
  "arrow_to_left",
  "arrow_to_right",
  "chat_2",
  "chevron_left_square",
  "chevron_right_square",
  "envelope",
  "envelope_open",
  "heart",
  "home",
  "image",
  "layout",
  "lock",
  "mobile",
  "notification_stop",
  "notifications",
  "pin",
  "share",
  "share-1",
  "star",
  "tag",
  "tag_square",
  "time",
  "trash_2",
  "user",
  "video",
  "view_eye",
] as const;

export type BrandIconName = (typeof BRAND_ICON_NAMES)[number];

const aliases: Record<string, BrandIconName> = {
  search: "Search",
  menu: "Menu-vertical",
  bell: "notifications",
  clock: "time",
  trash: "trash_2",
  chat: "chat_2",
  zoom: "Zoom-in",
  email: "envelope",
  mail: "envelope",
  chevronLeft: "chevron_left_square",
  chevronRight: "chevron_right_square",
  arrowLeft: "arrow_to_left",
  arrowRight: "arrow_to_right",
};

export type BrandIconProps = {
  name: BrandIconName | keyof typeof aliases;
  size?: number;
  className?: string;
  alt?: string;
};

export default function BrandIcon({
  name,
  size = 20,
  className,
  alt = "",
}: BrandIconProps) {
  const resolved: BrandIconName = (aliases[name as string] ?? name) as BrandIconName;
  return (
    <Image
      src={`/brand/icons/${resolved}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={className}
      aria-hidden={alt === "" ? true : undefined}
    />
  );
}
