import type { Metadata } from "next";
import NewProjectForm from "./NewProjectForm";
import { isGhlConnected, PIPELINE_OPTIONS } from "@/lib/ghl-homesbynh";

export const metadata: Metadata = {
  title: "New Estimate · BuildHawk Cost Plan Console",
  description: "Create a new estimate in Homes by NH.",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return <NewProjectForm pipelines={PIPELINE_OPTIONS} ghlConnected={isGhlConnected()} />;
}
