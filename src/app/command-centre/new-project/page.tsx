import type { Metadata } from "next";
import NewProjectForm from "./NewProjectForm";
import { isGhlConnected, PIPELINE_OPTIONS } from "@/lib/ghl-homesbynh";
import { getActiveContext } from "@/lib/auth";
import { getGhlConfig, getLegacyGhlConfig } from "@/lib/integrations";

export const metadata: Metadata = {
  title: "New Estimate · BuildHawk Cost Plan Console",
  description: "Create a new estimate.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const ctx = await getActiveContext().catch(() => null);
  const cfg =
    (ctx ? await getGhlConfig(ctx.tenant.id).catch(() => null) : null) ??
    getLegacyGhlConfig();
  return <NewProjectForm pipelines={PIPELINE_OPTIONS} ghlConnected={isGhlConnected(cfg)} />;
}
