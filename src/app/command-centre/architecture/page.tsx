import type { Metadata } from "next";
import Architecture from "./Architecture";

export const metadata: Metadata = {
  title: "Architecture · BuildHawk Cost Plan Console",
  description:
    "Technical workflow map for BuildHawk: data ingestion, Hawktress core, benchmark engine, and director surfaces. PRD v1.0 reference.",
  robots: { index: false, follow: false },
};

export default function ArchitecturePage() {
  return <Architecture />;
}
