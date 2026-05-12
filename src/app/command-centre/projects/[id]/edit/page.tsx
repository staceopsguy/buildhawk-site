import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EditProjectForm from "./EditProjectForm";
import {
  getProjectById,
  isGhlConnected,
  isProjectDataFieldConfigured,
  PIPELINE_OPTIONS,
} from "@/lib/ghl-homesbynh";

export const metadata: Metadata = {
  title: "Estimate Workbook · BuildHawk Cost Plan Console",
  description: "Update committed cost, invoiced, margin and stage for a Homes by NH estimate.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProjectPage({ params }: { params: Params }) {
  const { id } = await params;
  const ghlOn = isGhlConnected();
  const overlayFieldOn = isProjectDataFieldConfigured();

  const project = ghlOn ? await getProjectById(id) : null;
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
