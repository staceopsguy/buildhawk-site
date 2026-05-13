import { NextResponse } from "next/server";
import { createProject, type CreateProjectInput } from "@/lib/ghl-homesbynh";
import { getActiveContext } from "@/lib/auth";
import { getGhlConfig, getLegacyGhlConfig } from "@/lib/integrations";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Partial<CreateProjectInput>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const required: (keyof CreateProjectInput)[] = [
    "projectName",
    "budget",
    "pipelineId",
    "pipelineStageId",
    "contactName",
    "contactEmail",
  ];
  for (const k of required) {
    if (!body[k]) {
      return NextResponse.json(
        { ok: false, error: `Missing required field: ${k}` },
        { status: 400 },
      );
    }
  }

  const budget = Number(body.budget);
  if (!Number.isFinite(budget) || budget < 0) {
    return NextResponse.json({ ok: false, error: "Invalid budget" }, { status: 400 });
  }

  const ctx = await getActiveContext().catch(() => null);
  const cfg = ctx
    ? await getGhlConfig(ctx.tenant.id).catch(() => null)
    : getLegacyGhlConfig();

  const result = await createProject(
    {
      projectName: String(body.projectName),
      address: body.address ? String(body.address) : undefined,
      budget,
      pipelineId: String(body.pipelineId),
      pipelineStageId: String(body.pipelineStageId),
      contactName: String(body.contactName),
      contactEmail: String(body.contactEmail),
      contactPhone: body.contactPhone ? String(body.contactPhone) : undefined,
      notes: body.notes ? String(body.notes) : undefined,
    },
    cfg,
  );

  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }
  return NextResponse.json(result, { status: 201 });
}
