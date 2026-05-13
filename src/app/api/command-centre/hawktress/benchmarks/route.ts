/**
 * Cross-tenant Hawktress benchmark cohort.
 *
 * Returns aggregated cells (avg / min / max / sampleSize) for combinations of
 * region × trade × project type. Cells with sample < 5 are suppressed to
 * preserve anonymity. Caller must be signed into a tenant.
 */
import { NextResponse } from "next/server";
import { getActiveContext } from "@/lib/auth";
import { getBenchmarkCohort } from "@/lib/benchmarks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const ctx = await getActiveContext();
  if (!ctx) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }
  const url = new URL(req.url);
  const filter = {
    region: url.searchParams.get("region") || undefined,
    tradeSection: url.searchParams.get("trade") || undefined,
    projectType: url.searchParams.get("projectType") || undefined,
  };
  try {
    const cohort = await getBenchmarkCohort(filter);
    return NextResponse.json(
      { ok: true, ...cohort },
      { headers: { "Cache-Control": "private, max-age=60" } },
    );
  } catch (e) {
    console.error("[hawktress] cohort error:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Cohort fetch failed" },
      { status: 500 },
    );
  }
}
