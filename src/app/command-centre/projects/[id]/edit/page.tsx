import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditProjectForm from "./EditProjectForm";
import {
  getProjectById,
  isGhlConnected,
  isProjectDataFieldConfigured,
  PIPELINE_OPTIONS,
} from "@/lib/ghl-homesbynh";
import { getActiveContext } from "@/lib/auth";
import { getGhlConfig, getLegacyGhlConfig } from "@/lib/integrations";

export const metadata: Metadata = {
  title: "Estimate Workbook · BuildHawk Cost Plan Console",
  description: "Update committed cost, invoiced, margin and stage for a Homes by NH estimate.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  const ctx = await getActiveContext().catch(() => null);
  const cfg =
    (ctx ? await getGhlConfig(ctx.tenant.id).catch(() => null) : null) ??
    getLegacyGhlConfig();
  const ghlOn = isGhlConnected(cfg);
  const overlayFieldOn = isProjectDataFieldConfigured(cfg);

  const project = ghlOn ? await getProjectById(id, cfg) : null;
  if (ghlOn && !project) notFound();

  return (
    <EditProjectForm
      project={project}
      projectId={id}
      pipelines={PIPELINE_OPTIONS}
      ghlConnected={ghlOn}
      overlayFieldConfigured={overlayFieldOn}
    />
  );
}
