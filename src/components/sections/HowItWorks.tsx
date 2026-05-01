"use client";

import dynamic from "next/dynamic";

const BuildSequence = dynamic(
  () => import("@/components/three/BuildSequence"),
  { ssr: false }
);

export default function HowItWorks() {
  return (
    <section id="how" className="relative bg-bh-black">
      <BuildSequence />
    </section>
  );
}
