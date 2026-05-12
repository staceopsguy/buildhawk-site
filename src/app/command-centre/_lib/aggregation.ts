/**
 * Client-safe aggregation helpers for views that need raw overlay data.
 *
 * The full GHL lib (@/lib/ghl-homesbynh) is server-only; this module re-exports
 * the data shapes it produces in a form the client can consume without pulling
 * server fetch code into the bundle.
 *
 * Real-data discipline: no synthesis. When inputs are empty, return empty.
 * Callers render "Awaiting data" states rather than placeholder numbers.
 */

export type AwardedSubLike = {
  tradeSection?: string;
  awardedValue?: number;
  awardDate?: string;
};

export type VariationLike = {
  tradeSection?: string;
  costImpact?: number;
  revenueImpact?: number;
  dateRaised?: string;
  directorGate?: "Not required" | "Pending" | "Approved" | "Rejected";
  status?: string;
};

export type CostToCompleteLike = {
  tradeSection?: string;
  budget?: number;
  committed?: number;
  spentToDate?: number;
  forecastAtCompletion?: number;
};

export type OverlayLike = {
  setup?: { regionCode?: string; projectType?: string };
  awardedSubs?: AwardedSubLike[];
  variations?: VariationLike[];
  costToComplete?: CostToCompleteLike[];
  lastUpdated?: string;
  lastUpdatedBy?: string;
  liveMarginPct?: number;
  targetMarginPct?: number;
};

export type RawProjectLike = {
  id: string;
  name: string;
  region: string;
  type: string;
  budget: number;
  overlay: OverlayLike | null;
};

/* ------------------------------------------------------------------
 * Hawktress benchmark aggregation
 * ----------------------------------------------------------------- */

export type BenchmarkCell = {
  region: string;
  trade: string;
  projectType: string;
  sampleSize: number;
  averageAwardedValue: number;
  minAwardedValue: number;
  maxAwardedValue: number;
  contributingProjects: number;
};

export type RecentLookup = {
  projectName: string;
  region: string;
  projectType: string;
  tradeSection: string;
  awardedValue: number;
  awardDate?: string;
};

export type HawktressDataset = {
  benchmarkCells: BenchmarkCell[];
  awardedDataPoints: number;
  variationDataPoints: number;
  projectsContributing: number;
  regionsRepresented: string[];
  tradesRepresented: string[];
  projectTypesRepresented: string[];
  recentAwards: RecentLookup[];
};

const norm = (s: string | undefined | null): string =>
  (s ?? "").trim();

export function aggregateHawktress(projects: RawProjectLike[] | null): HawktressDataset {
  const empty: HawktressDataset = {
    benchmarkCells: [],
    awardedDataPoints: 0,
    variationDataPoints: 0,
    projectsContributing: 0,
    regionsRepresented: [],
    tradesRepresented: [],
    projectTypesRepresented: [],
    recentAwards: [],
  };
  if (!projects || projects.length === 0) return empty;

  // Group awards by (region × trade × projectType)
  const groups = new Map<
    string,
    {
      region: string;
      trade: string;
      projectType: string;
      values: number[];
      projectIds: Set<string>;
    }
  >();
  const recentAwards: RecentLookup[] = [];
  const regions = new Set<string>();
  const trades = new Set<string>();
  const projectTypes = new Set<string>();
  let awarded = 0;
  let variations = 0;
  const contributors = new Set<string>();

  for (const p of projects) {
    const overlay = p.overlay;
    if (!overlay) continue;
    const region = norm(overlay.setup?.regionCode) || norm(p.region);
    const projectType = norm(overlay.setup?.projectType) || norm(p.type);

    for (const a of overlay.awardedSubs ?? []) {
      const trade = norm(a.tradeSection);
      const value = a.awardedValue ?? 0;
      if (!trade || !region || value <= 0) continue;
      const key = `${region}::${trade}::${projectType}`;
      const g =
        groups.get(key) ??
        { region, trade, projectType, values: [], projectIds: new Set() };
      g.values.push(value);
      g.projectIds.add(p.id);
      groups.set(key, g);
      regions.add(region);
      trades.add(trade);
      if (projectType) projectTypes.add(projectType);
      awarded += 1;
      contributors.add(p.id);
      recentAwards.push({
        projectName: p.name,
        region,
        projectType,
        tradeSection: trade,
        awardedValue: value,
        awardDate: a.awardDate,
      });
    }

    for (const v of overlay.variations ?? []) {
      if (v.directorGate === "Approved" || v.status === "Approved") variations += 1;
    }
  }

  const benchmarkCells: BenchmarkCell[] = Array.from(groups.values()).map((g) => {
    const sum = g.values.reduce((a, b) => a + b, 0);
    return {
      region: g.region,
      trade: g.trade,
      projectType: g.projectType,
      sampleSize: g.values.length,
      averageAwardedValue: sum / g.values.length,
      minAwardedValue: Math.min(...g.values),
      maxAwardedValue: Math.max(...g.values),
      contributingProjects: g.projectIds.size,
    };
  });

  recentAwards.sort((a, b) => {
    const da = a.awardDate ? Date.parse(a.awardDate) : 0;
    const db = b.awardDate ? Date.parse(b.awardDate) : 0;
    return db - da;
  });

  return {
    benchmarkCells,
    awardedDataPoints: awarded,
    variationDataPoints: variations,
    projectsContributing: contributors.size,
    regionsRepresented: Array.from(regions).sort(),
    tradesRepresented: Array.from(trades).sort(),
    projectTypesRepresented: Array.from(projectTypes).sort(),
    recentAwards: recentAwards.slice(0, 8),
  };
}

export function findBenchmark(
  dataset: HawktressDataset,
  region: string,
  trade: string,
  projectType: string,
): BenchmarkCell | null {
  return (
    dataset.benchmarkCells.find(
      (c) => c.region === region && c.trade === trade && c.projectType === projectType,
    ) ?? null
  );
}

/* ------------------------------------------------------------------
 * Director Reports snapshot
 * ----------------------------------------------------------------- */

export type DirectorReportsSnapshot = {
  reportsDelivered: number;
  nextReportIso: string; // first of next month
  blendedNetMarginPct: number | null;
  projectsWithFinancials: number;
  openVariations: number;
  approvedVariations: number;
  totalContract: number;
  totalForecastAtCompletion: number;
  lastWorkbookSaveIso: string | null;
  lastWorkbookSaveProject: string | null;
};

export function buildReportsSnapshot(
  projects: RawProjectLike[] | null,
): DirectorReportsSnapshot {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 5);
  // Format as local YYYY-MM-DD to avoid UTC slipping the date back one day
  // when the server runs in UTC.
  const nextReportIso = `${nextMonth.getFullYear()}-${String(
    nextMonth.getMonth() + 1,
  ).padStart(2, "0")}-${String(nextMonth.getDate()).padStart(2, "0")}`;
  const baseline: DirectorReportsSnapshot = {
    reportsDelivered: 0,
    nextReportIso,
    blendedNetMarginPct: null,
    projectsWithFinancials: 0,
    openVariations: 0,
    approvedVariations: 0,
    totalContract: 0,
    totalForecastAtCompletion: 0,
    lastWorkbookSaveIso: null,
    lastWorkbookSaveProject: null,
  };
  if (!projects || projects.length === 0) return baseline;

  let projectsWithFinancials = 0;
  let openVariations = 0;
  let approvedVariations = 0;
  let totalContract = 0;
  let totalForecast = 0;
  let lastSave = 0;
  let lastSaveProject: string | null = null;
  const marginWeights: Array<{ pct: number; weight: number }> = [];

  for (const p of projects) {
    const o = p.overlay;
    if (!o) continue;
    const ccc = o.costToComplete ?? [];
    const facSum = ccc.reduce((s, l) => s + (l.forecastAtCompletion ?? 0), 0);
    const committedSum = ccc.reduce((s, l) => s + (l.committed ?? 0), 0);
    const hasFinancials =
      facSum > 0 ||
      committedSum > 0 ||
      !!o.liveMarginPct ||
      (o.awardedSubs?.length ?? 0) > 0;
    if (hasFinancials) projectsWithFinancials += 1;

    for (const v of o.variations ?? []) {
      const gate = v.directorGate;
      if (gate === "Pending") openVariations += 1;
      if (gate === "Approved" || v.status === "Approved") approvedVariations += 1;
    }

    totalContract += p.budget ?? 0;
    totalForecast += facSum;

    if (typeof o.liveMarginPct === "number" && p.budget > 0) {
      marginWeights.push({ pct: o.liveMarginPct, weight: p.budget });
    } else if (facSum > 0 && p.budget > 0) {
      const pct = ((p.budget - facSum) / p.budget) * 100;
      marginWeights.push({ pct, weight: p.budget });
    }

    if (o.lastUpdated) {
      const t = Date.parse(o.lastUpdated);
      if (!Number.isNaN(t) && t > lastSave) {
        lastSave = t;
        lastSaveProject = p.name;
      }
    }
  }

  const totalWeight = marginWeights.reduce((s, m) => s + m.weight, 0);
  const blendedNetMarginPct =
    totalWeight > 0
      ? marginWeights.reduce((s, m) => s + (m.pct * m.weight) / totalWeight, 0)
      : null;

  return {
    reportsDelivered: 0,
    nextReportIso,
    blendedNetMarginPct,
    projectsWithFinancials,
    openVariations,
    approvedVariations,
    totalContract,
    totalForecastAtCompletion: totalForecast,
    lastWorkbookSaveIso: lastSave > 0 ? new Date(lastSave).toISOString() : null,
    lastWorkbookSaveProject: lastSaveProject,
  };
}
