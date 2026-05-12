"use client";

import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import ChatWidget from "./chat/ChatWidget";

export default function MarketingChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/command-centre")) return null;
  return (
    <>
      <SmoothScroll />
      <ChatWidget />
    </>
  );
}
