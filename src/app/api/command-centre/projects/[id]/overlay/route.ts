import { NextResponse } from "next/server";
import { updateProjectOverlay, type ProjectOverlay } from "@/lib/ghl-homesbynh";
import { getActiveContext } from "@/lib/auth";
import { getGhlConfig, getLegacyGhlConfig } from "@/lib/integrations";
import { recordAudit } from "@/lib/audit";

export const runtime = "nodejs";

type Params = Promise<{ id: string }>;

const numField = (v: unknown): number | undefined => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
};

export async function POST(req: Request, { params }: { params: Params }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "Missing project id" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Accept either a flat overlay (legacy) or { overlay: {...} } envelope.
  const incoming =
    typeof body.overlay === "object" && body.overlay !== null
      ? (body.overlay as Record<string, unknown>)
      : body;

  // Trust the client-assembled overlay; coerce numerics on top-level fields,
  // pass collections through unchanged.
  const overlay: ProjectOverlay = {
    committed: numField(incoming.committed),
    invoiced: numField(incoming.invoiced),
    targetMarginPct: numField(incoming.targetMarginPct),
    liveMarginPct: numField(incoming.liveMarginPct),
    percentComplete: numField(incoming.percentComplete),
    durationMonths: numField(incoming.durationMonths),
    monthsElapsed: numField(incoming.monthsElapsed),
    status:
      incoming.status === "On track" ||
      incoming.status === "Margin erosion" ||
      incoming.status === "Variation pending"
        ? incoming.status
        : undefined,
    notes: typeof incoming.notes === "string" ? incoming.notes : undefined,
    setup:
      typeof incoming.setup === "object" && incoming.setup !== null
        ? (incoming.setup as ProjectOverlay["setup"])
        : undefined,
    boq: Array.isArray(incoming.boq) ? (incoming.boq as ProjectOverlay["boq"]) : undefined,
    rfqs: Array.isArray(incoming.rfqs) ? (incoming.rfqs as ProjectOverlay["rfqs"]) : undefined,
    quoteComparisons: Array.isArray(incoming.quoteComparisons)
      ? (incoming.quoteComparisons as ProjectOverlay["quoteComparisons"])
      : undefined,
    awardedSubs: Array.isArray(incoming.awardedSubs)
      ? (incoming.awardedSubs as ProjectOverlay["awardedSubs"])
      : undefined,
    variations: Array.isArray(incoming.variations)
      ? (incoming.variations as ProjectOverlay["variations"])
      : undefined,
    costToComplete: Array.isArray(incoming.costToComplete)
      ? (incoming.costToComplete as ProjectOverlay["costToComplete"])
      : undefined,
    claims: Array.isArray(incoming.claims)
      ? (incoming.claims as ProjectOverlay["claims"])
      : undefined,
    cashflow: Array.isArray(incoming.cashflow)
      ? (incoming.cashflow as ProjectOverlay["cashflow"])
      : undefined,
    risks: Array.isArray(incoming.risks) ? (incoming.risks as ProjectOverlay["risks"]) : undefined,
    suppliers: Array.isArray(incoming.suppliers)
      ? (incoming.suppliers as ProjectOverlay["suppliers"])
      : undefined,
  };

  const ctx = await getActiveContext().catch(() => null);
  const cfg =
    (ctx ? await getGhlConfig(ctx.tenant.id).catch(() => null) : null) ??
    getLegacyGhlConfig();

  const result = await updateProjectOverlay(
    {
      opportunityId: id,
      overlay,
      pipelineStageId:
        typeof body.pipelineStageId === "string" ? String(body.pipelineStageId) : undefined,
      budget: numField(body.budget),
      updatedBy:
        typeof body.updatedBy === "string"
          ? String(body.updatedBy)
          : ctx?.user.name ?? ctx?.user.email ?? undefined,
    },
    cfg,
  );

  if (!result.ok) return NextResponse.json(result, { status: 502 });
  if (ctx) {
    recordAudit({
      tenantId: ctx.tenant.id,
      actorUserId: ctx.user.id,
      actorEmail: ctx.user.email,
      action: "overlay.saved",
      target: id,
      metadata: {
        awardedSubsCount: overlay.awardedSubs?.length ?? 0,
        variationsCount: overlay.variations?.length ?? 0,
        costToCompleteCount: overlay.costToComplete?.length ?? 0,
      },
    });
  }
  return NextResponse.json(result, { status: 200 });
}
