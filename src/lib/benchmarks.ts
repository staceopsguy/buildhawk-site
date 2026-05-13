/**
 * Hawktress cross-tenant benchmark layer.
 *
 * Writes: every awarded subcontract from a saved workbook is upserted into
 * benchmark_samples (deduped per opportunity+award id). Builder, supplier and
 * tenant identifiers are stripped — only the cohort dimensions land here.
 *
 * Reads: aggregated cells with k-anonymity (cells with sample < 5 are
 * suppressed so individual rows can't be identified).
 */

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { benchmarkSamples } from "@/lib/db/schema";
import { ids } from "@/lib/db/ids";

const K_MIN = 5;

export type AwardSample = {
  sourceAwardId: string;
  tradeSection?: string;
  awardedValue?: number;
  awardDate?: string;
};

export type RecordContext = {
  tenantId: string;
  sourceOpportunityId: string;
  region: string;
  projectType?: string;
};

export async function recordBenchmarkSamples(ctx: RecordContext, awards: AwardSample[]) {
  if (!ctx.region) return { written: 0 };
  const region = ctx.region.trim();
  const projectType = ctx.projectType?.trim() || null;
  if (!region) return { written: 0 };

  // Build the list of valid sample rows.
  const rows: Array<{
    id: string;
    tenantId: string;
    sourceOpportunityId: string;
    sourceAwardId: string;
    region: string;
    tradeSection: string;
    projectType: string | null;
    awardedValue: string;
    awardDate: string | null;
  }> = [];

  for (const a of awards) {
    if (!a.sourceAwardId) continue;
    const trade = a.tradeSection?.trim();
    const value = a.awardedValue;
    if (!trade || !value || value <= 0) continue;
    rows.push({
      id: ids.audit(), // prefixed nanoid; doesn't have to be benchmark-specific
      tenantId: ctx.tenantId,
      sourceOpportunityId: ctx.sourceOpportunityId,
      sourceAwardId: a.sourceAwardId,
      region,
      tradeSection: trade,
      projectType,
      awardedValue: value.toFixed(2),
      awardDate: a.awardDate ?? null,
    });
  }
  if (rows.length === 0) return { written: 0 };

  // Upsert by (sourceOpportunityId, sourceAwardId) — the unique dedup index.
  await db()
    .insert(benchmarkSamples)
    .values(rows)
    .onConflictDoUpdate({
      target: [benchmarkSamples.sourceOpportunityId, benchmarkSamples.sourceAwardId],
      set: {
        region: sql`EXCLUDED.region`,
        tradeSection: sql`EXCLUDED.trade_section`,
        projectType: sql`EXCLUDED.project_type`,
        awardedValue: sql`EXCLUDED.awarded_value`,
        awardDate: sql`EXCLUDED.award_date`,
      },
    });

  return { written: rows.length };
}

export type BenchmarkCell = {
  region: string;
  tradeSection: string;
  projectType: string | null;
  sampleSize: number;
  averageAwardedValue: number;
  minAwardedValue: number;
  maxAwardedValue: number;
};

export type BenchmarkResult = {
  cells: BenchmarkCell[];
  totalSamples: number;
  trades: string[];
  regions: string[];
  projectTypes: string[];
  suppressedCells: number;
};

/**
 * Return aggregated benchmark cells. Cells with sample < K_MIN are suppressed
 * from the response entirely (their existence is signalled via suppressedCells).
 */
export async function getBenchmarkCohort(filter?: {
  region?: string;
  tradeSection?: string;
  projectType?: string;
}): Promise<BenchmarkResult> {
  // Build aggregation in SQL for efficiency.
  const result = await db()
    .select({
      region: benchmarkSamples.region,
      tradeSection: benchmarkSamples.tradeSection,
      projectType: benchmarkSamples.projectType,
      sampleSize: sql<number>`count(*)::int`,
      avg: sql<number>`avg(${benchmarkSamples.awardedValue})::float`,
      min: sql<number>`min(${benchmarkSamples.awardedValue})::float`,
      max: sql<number>`max(${benchmarkSamples.awardedValue})::float`,
    })
    .from(benchmarkSamples)
    .where(
      and(
        filter?.region ? eq(benchmarkSamples.region, filter.region) : undefined,
        filter?.tradeSection ? eq(benchmarkSamples.tradeSection, filter.tradeSection) : undefined,
        filter?.projectType ? eq(benchmarkSamples.projectType, filter.projectType) : undefined,
      ),
    )
    .groupBy(
      benchmarkSamples.region,
      benchmarkSamples.tradeSection,
      benchmarkSamples.projectType,
    );

  const allCells: BenchmarkCell[] = result.map((r) => ({
    region: r.region,
    tradeSection: r.tradeSection,
    projectType: r.projectType ?? null,
    sampleSize: r.sampleSize,
    averageAwardedValue: r.avg,
    minAwardedValue: r.min,
    maxAwardedValue: r.max,
  }));
  const visibleCells = allCells.filter((c) => c.sampleSize >= K_MIN);
  const suppressedCells = allCells.length - visibleCells.length;

  const regions = Array.from(new Set(visibleCells.map((c) => c.region))).sort();
  const trades = Array.from(new Set(visibleCells.map((c) => c.tradeSection))).sort();
  const projectTypes = Array.from(
    new Set(visibleCells.map((c) => c.projectType).filter((v): v is string => Boolean(v))),
  ).sort();

  return {
    cells: visibleCells,
    totalSamples: visibleCells.reduce((s, c) => s + c.sampleSize, 0),
    trades,
    regions,
    projectTypes,
    suppressedCells,
  };
}
