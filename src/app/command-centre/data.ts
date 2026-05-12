// Mock data for the Command Centre prototype.
// Tuned to BuildHawk PRD v1.0 § 7.4.1 and Appendix C commercial reference.

export type Project = {
  id: string;
  name: string;
  type: string;
  region: string;
  budget: number;
  committed: number;
  invoiced: number;
  percentComplete: number;
  targetMargin: number;
  liveMargin: number;
  status: "On track" | "Margin erosion" | "Variation pending" | "Awaiting data";
  flags: number;
  durationMonths: number;
  monthsElapsed: number;
  /**
   * True when this project has overlay data saved (committed/invoiced/margin entered
   * via the workbook editor). When false, financial fields are zero placeholders and
   * the UI shows "no data" rather than computed numbers.
   */
  hasFinancialData: boolean;
};

export const TENANT = {
  name: "Homes by NH",
  abn: "TBC",
  primaryRegion: "VIC",
  tier: "Founding · Unlimited",
  lastSync: "2 min ago",
};

export const PROJECTS: Project[] = [
  {
    id: "P-2041",
    name: "Marra Court Duplex",
    type: "Duplex",
    region: "Sydney NSW",
    budget: 1_250_000,
    committed: 810_500,
    invoiced: 780_000,
    percentComplete: 65,
    targetMargin: 17.0,
    liveMargin: 16.4,
    status: "On track",
    flags: 0,
    durationMonths: 11,
    monthsElapsed: 7,
    hasFinancialData: true,
  },
  {
    id: "P-2052",
    name: "Northcote Knockdown Rebuild",
    type: "Knockdown Rebuild",
    region: "Melbourne VIC",
    budget: 1_820_000,
    committed: 1_510_200,
    invoiced: 1_390_000,
    percentComplete: 82,
    targetMargin: 18.0,
    liveMargin: 8.4,
    status: "Margin erosion",
    flags: 2,
    durationMonths: 12,
    monthsElapsed: 10,
    hasFinancialData: true,
  },
  {
    id: "P-2068",
    name: "Brunswick Heads Passivhaus",
    type: "Single Dwelling · Passivhaus",
    region: "Northern NSW",
    budget: 2_400_000,
    committed: 750_000,
    invoiced: 620_000,
    percentComplete: 28,
    targetMargin: 19.0,
    liveMargin: 19.6,
    status: "On track",
    flags: 0,
    durationMonths: 14,
    monthsElapsed: 4,
    hasFinancialData: true,
  },
  {
    id: "P-2074",
    name: "Glenelg Townhouse Pair",
    type: "Townhouse",
    region: "Adelaide SA",
    budget: 1_650_000,
    committed: 1_100_000,
    invoiced: 1_050_000,
    percentComplete: 58,
    targetMargin: 17.0,
    liveMargin: 14.2,
    status: "Variation pending",
    flags: 1,
    durationMonths: 11,
    monthsElapsed: 6,
    hasFinancialData: true,
  },
];

export type Variation = {
  id: string;
  projectId: string;
  project: string;
  scope: string;
  value: number;
  regionalAvg: number;
  deltaPct: number;
  flagged: boolean;
  submittedDays: number;
};

export const PENDING_VARIATIONS: Variation[] = [
  {
    id: "V-8821",
    projectId: "P-2052",
    project: "Northcote KDR",
    scope: "Structural steel upgrade · primary beam",
    value: 42_800,
    regionalAvg: 39_900,
    deltaPct: 7.3,
    flagged: true,
    submittedDays: 3,
  },
  {
    id: "V-8829",
    projectId: "P-2074",
    project: "Glenelg Townhouse Pair",
    scope: "Additional wet area tiling · second ensuite",
    value: 18_500,
    regionalAvg: 17_550,
    deltaPct: 5.4,
    flagged: true,
    submittedDays: 2,
  },
  {
    id: "V-8836",
    projectId: "P-2041",
    project: "Marra Court Duplex",
    scope: "Roof tile substitution · spec match",
    value: 9_200,
    regionalAvg: 9_400,
    deltaPct: -2.1,
    flagged: false,
    submittedDays: 1,
  },
  {
    id: "V-8842",
    projectId: "P-2068",
    project: "Brunswick Passivhaus",
    scope: "Triple-glazed window package, upgrade",
    value: 28_600,
    regionalAvg: 27_400,
    deltaPct: 4.4,
    flagged: false,
    submittedDays: 1,
  },
];

export type ErosionFlag = {
  id: string;
  projectId: string;
  project: string;
  trigger: string;
  impactPct: number;
  impactValue: number;
  ageHours: number;
  severity: "high" | "med" | "low";
};

export const EROSION_FLAGS: ErosionFlag[] = [
  {
    id: "F-441",
    projectId: "P-2052",
    project: "Northcote KDR",
    trigger: "Committed cost overrun · framing",
    impactPct: -9.6,
    impactValue: -174_800,
    ageHours: 4,
    severity: "high",
  },
  {
    id: "F-447",
    projectId: "P-2052",
    project: "Northcote KDR",
    trigger: "Variation V-8821 above regional benchmark",
    impactPct: -2.1,
    impactValue: -38_200,
    ageHours: 9,
    severity: "med",
  },
  {
    id: "F-452",
    projectId: "P-2074",
    project: "Glenelg Townhouse Pair",
    trigger: "Forecast margin tightening below target",
    impactPct: -2.8,
    impactValue: -46_300,
    ageHours: 21,
    severity: "med",
  },
];

export type TradeVariance = {
  trade: string;
  samples: number;
  deltaPct: number;
  flagged: boolean;
};

export const VARIANCE_BY_TRADE: TradeVariance[] = [
  { trade: "Framing (timber and steel)", samples: 6, deltaPct: 6.8, flagged: true },
  { trade: "Tiling (wet area)", samples: 4, deltaPct: 5.4, flagged: true },
  { trade: "Electrical fit-off", samples: 7, deltaPct: 3.4, flagged: false },
  { trade: "Roofing (metal)", samples: 5, deltaPct: 1.2, flagged: false },
  { trade: "Plumbing rough-in", samples: 6, deltaPct: -2.1, flagged: false },
  { trade: "Painting", samples: 4, deltaPct: -3.6, flagged: false },
];

export type CashflowPoint = { week: number; balance: number; ar: number; ap: number };

export const CASHFLOW: CashflowPoint[] = (() => {
  const start = 312_000;
  const moves = [
    { ar: 95000, ap: -78000 },
    { ar: 142000, ap: -110000 },
    { ar: 78000, ap: -94000 },
    { ar: 168000, ap: -130000 },
    { ar: 64000, ap: -82000 },
    { ar: 210000, ap: -154000 },
    { ar: 92000, ap: -118000 },
    { ar: 134000, ap: -96000 },
    { ar: 88000, ap: -102000 },
    { ar: 176000, ap: -148000 },
    { ar: 102000, ap: -84000 },
    { ar: 188000, ap: -132000 },
    { ar: 110000, ap: -94000 },
  ];
  let bal = start;
  const points: CashflowPoint[] = [{ week: 0, balance: start, ar: 0, ap: 0 }];
  moves.forEach((m, i) => {
    bal = bal + m.ar + m.ap;
    points.push({ week: i + 1, balance: bal, ar: m.ar, ap: m.ap });
  });
  return points;
})();

export type TradeLine = {
  trade: string;
  budget: number;
  committed: number;
  deltaPct: number;
  flagged?: boolean;
  pending?: boolean;
};

export const TRADE_LINES: TradeLine[] = [
  { trade: "Site preparation & earthworks", budget: 84_000, committed: 81_200, deltaPct: -3.3 },
  { trade: "Concreting (slab and footings)", budget: 142_000, committed: 144_500, deltaPct: 1.8 },
  { trade: "Framing (timber and steel)", budget: 218_000, committed: 248_400, deltaPct: 13.9, flagged: true },
  { trade: "Roofing (metal)", budget: 96_000, committed: 92_800, deltaPct: -3.3 },
  { trade: "Bricklaying and blockwork", budget: 128_000, committed: 131_200, deltaPct: 2.5 },
  { trade: "Plumbing rough-in", budget: 64_000, committed: 60_400, deltaPct: -5.6 },
  { trade: "Electrical rough-in", budget: 58_000, committed: 59_800, deltaPct: 3.1 },
  { trade: "Windows and external doors", budget: 112_000, committed: 118_400, deltaPct: 5.7, flagged: true },
  { trade: "Plastering and linings", budget: 88_000, committed: 86_400, deltaPct: -1.8 },
  { trade: "Cabinetry and joinery", budget: 156_000, committed: 0, deltaPct: 0, pending: true },
];

/* ------------------------------------------------------------------
 * Variations register
 * ----------------------------------------------------------------- */

export type RegisterVariation = {
  id: string;
  projectId: string;
  project: string;
  scope: string;
  value: number;
  regionalAvg: number;
  deltaPct: number;
  flagged: boolean;
  status: "Pending" | "Approved" | "Rejected" | "CA review";
  submittedDate: string;
  decidedDate?: string;
  decidedBy?: string;
};

export const VARIATIONS_REGISTER: RegisterVariation[] = [
  {
    id: "V-8842",
    projectId: "P-2068",
    project: "Brunswick Heads Passivhaus",
    scope: "Triple-glazed window package, upgrade",
    value: 28_600,
    regionalAvg: 27_400,
    deltaPct: 4.4,
    flagged: false,
    status: "Pending",
    submittedDate: "2026-05-11",
  },
  {
    id: "V-8836",
    projectId: "P-2041",
    project: "Marra Court Duplex",
    scope: "Roof tile substitution · spec match",
    value: 9_200,
    regionalAvg: 9_400,
    deltaPct: -2.1,
    flagged: false,
    status: "Pending",
    submittedDate: "2026-05-11",
  },
  {
    id: "V-8829",
    projectId: "P-2074",
    project: "Glenelg Townhouse Pair",
    scope: "Additional wet area tiling · second ensuite",
    value: 18_500,
    regionalAvg: 17_550,
    deltaPct: 5.4,
    flagged: true,
    status: "CA review",
    submittedDate: "2026-05-10",
  },
  {
    id: "V-8821",
    projectId: "P-2052",
    project: "Northcote Knockdown Rebuild",
    scope: "Structural steel upgrade · primary beam",
    value: 42_800,
    regionalAvg: 39_900,
    deltaPct: 7.3,
    flagged: true,
    status: "CA review",
    submittedDate: "2026-05-09",
  },
  {
    id: "V-8814",
    projectId: "P-2041",
    project: "Marra Court Duplex",
    scope: "Owner-supplied tap ware credit",
    value: -4_600,
    regionalAvg: -4_600,
    deltaPct: 0,
    flagged: false,
    status: "Approved",
    submittedDate: "2026-05-07",
    decidedDate: "2026-05-08",
    decidedBy: "Nathan Holloway",
  },
  {
    id: "V-8807",
    projectId: "P-2074",
    project: "Glenelg Townhouse Pair",
    scope: "Concrete slab depth increase · engineering revision",
    value: 12_400,
    regionalAvg: 11_800,
    deltaPct: 5.1,
    flagged: true,
    status: "Approved",
    submittedDate: "2026-05-05",
    decidedDate: "2026-05-06",
    decidedBy: "Nathan Holloway",
  },
  {
    id: "V-8801",
    projectId: "P-2052",
    project: "Northcote Knockdown Rebuild",
    scope: "Skylight upgrade · 4x VELUX",
    value: 14_800,
    regionalAvg: 13_400,
    deltaPct: 10.4,
    flagged: true,
    status: "Rejected",
    submittedDate: "2026-05-02",
    decidedDate: "2026-05-04",
    decidedBy: "Nathan Holloway",
  },
  {
    id: "V-8795",
    projectId: "P-2068",
    project: "Brunswick Heads Passivhaus",
    scope: "Solar PV string sizing revision",
    value: 6_200,
    regionalAvg: 6_400,
    deltaPct: -3.1,
    flagged: false,
    status: "Approved",
    submittedDate: "2026-04-29",
    decidedDate: "2026-04-30",
    decidedBy: "Nathan Holloway",
  },
];

/* ------------------------------------------------------------------
 * Alliance suppliers
 * ----------------------------------------------------------------- */

export type AllianceSupplier = {
  id: string;
  name: string;
  tier: "Preferred" | "Listed";
  primaryRegion: string;
  tradeCategory: string;
  performanceScore: number; // 0..100
  catalogueFreshnessDays: number | null; // Preferred only
  recentJobs: number;
  pricingVsBenchmarkPct: number;
};

export const ALLIANCE_SUPPLIERS: AllianceSupplier[] = [
  {
    id: "S-101",
    name: "Northbridge Steel & Truss",
    tier: "Preferred",
    primaryRegion: "Sydney NSW",
    tradeCategory: "Framing (timber and steel)",
    performanceScore: 94,
    catalogueFreshnessDays: 3,
    recentJobs: 18,
    pricingVsBenchmarkPct: -2.4,
  },
  {
    id: "S-104",
    name: "Bayside Plumbing Supplies",
    tier: "Preferred",
    primaryRegion: "Melbourne VIC",
    tradeCategory: "Plumbing rough-in and fit-off",
    performanceScore: 91,
    catalogueFreshnessDays: 1,
    recentJobs: 24,
    pricingVsBenchmarkPct: -1.8,
  },
  {
    id: "S-108",
    name: "Coastline Tiling Direct",
    tier: "Preferred",
    primaryRegion: "Sydney NSW",
    tradeCategory: "Tiling (wet area)",
    performanceScore: 88,
    catalogueFreshnessDays: 6,
    recentJobs: 11,
    pricingVsBenchmarkPct: 0.4,
  },
  {
    id: "S-112",
    name: "Adelaide Window Co.",
    tier: "Preferred",
    primaryRegion: "Adelaide SA",
    tradeCategory: "Windows and external doors",
    performanceScore: 85,
    catalogueFreshnessDays: 9,
    recentJobs: 14,
    pricingVsBenchmarkPct: 1.1,
  },
  {
    id: "S-203",
    name: "Hunter Valley Concrete",
    tier: "Listed",
    primaryRegion: "Hunter NSW",
    tradeCategory: "Concreting (slab and footings)",
    performanceScore: 82,
    catalogueFreshnessDays: null,
    recentJobs: 7,
    pricingVsBenchmarkPct: -0.9,
  },
  {
    id: "S-208",
    name: "Geelong Electrical Wholesale",
    tier: "Listed",
    primaryRegion: "Melbourne VIC",
    tradeCategory: "Electrical rough-in and fit-off",
    performanceScore: 79,
    catalogueFreshnessDays: null,
    recentJobs: 9,
    pricingVsBenchmarkPct: 2.6,
  },
  {
    id: "S-214",
    name: "Bega Cabinet Works",
    tier: "Listed",
    primaryRegion: "Southern NSW",
    tradeCategory: "Cabinetry and joinery",
    performanceScore: 76,
    catalogueFreshnessDays: null,
    recentJobs: 4,
    pricingVsBenchmarkPct: 3.4,
  },
  {
    id: "S-219",
    name: "Brisbane Roofing Group",
    tier: "Listed",
    primaryRegion: "Brisbane QLD",
    tradeCategory: "Roofing (metal, tile, membrane)",
    performanceScore: 81,
    catalogueFreshnessDays: null,
    recentJobs: 6,
    pricingVsBenchmarkPct: -1.6,
  },
];

export type GroupBuy = {
  id: string;
  scope: string;
  participatingBuilders: number;
  unitsAggregated: number;
  unitLabel: string;
  savingsPct: number;
  savingsValue: number;
  status: "Open" | "Settled" | "Negotiating";
  closesIn?: string;
};

export const GROUP_BUYS: GroupBuy[] = [
  {
    id: "GB-024",
    scope: "Window package · double-glazed AWS Series 600",
    participatingBuilders: 6,
    unitsAggregated: 184,
    unitLabel: "windows",
    savingsPct: 11.4,
    savingsValue: 86_400,
    status: "Settled",
  },
  {
    id: "GB-026",
    scope: "Structural steel · UB and PFC stock",
    participatingBuilders: 4,
    unitsAggregated: 38,
    unitLabel: "tonnes",
    savingsPct: 7.8,
    savingsValue: 41_200,
    status: "Negotiating",
    closesIn: "5 days",
  },
  {
    id: "GB-027",
    scope: "Plumbing fittings · Caroma standard pack",
    participatingBuilders: 9,
    unitsAggregated: 142,
    unitLabel: "packs",
    savingsPct: 14.2,
    savingsValue: 32_800,
    status: "Open",
    closesIn: "9 days",
  },
];

/* ------------------------------------------------------------------
 * Hawktress benchmark explorer
 * ----------------------------------------------------------------- */

export type BenchmarkLookup = {
  region: string;
  tradeCategory: string;
  projectType: string;
  rollingAvgPerSqm: number;
  sampleSize: number;
  confidenceScore: number; // 0..100
  monthMovementPct: number;
  quarterMovementPct: number;
};

export const RECENT_LOOKUPS: BenchmarkLookup[] = [
  {
    region: "Sydney NSW",
    tradeCategory: "Framing (timber and steel)",
    projectType: "Duplex",
    rollingAvgPerSqm: 285,
    sampleSize: 41,
    confidenceScore: 92,
    monthMovementPct: 2.1,
    quarterMovementPct: 4.8,
  },
  {
    region: "Melbourne VIC",
    tradeCategory: "Concreting (slab and footings)",
    projectType: "Knockdown Rebuild",
    rollingAvgPerSqm: 168,
    sampleSize: 33,
    confidenceScore: 88,
    monthMovementPct: 0.4,
    quarterMovementPct: 1.6,
  },
  {
    region: "Northern NSW",
    tradeCategory: "Windows and external doors",
    projectType: "Single Dwelling · Passivhaus",
    rollingAvgPerSqm: 412,
    sampleSize: 12,
    confidenceScore: 71,
    monthMovementPct: -1.2,
    quarterMovementPct: 0.8,
  },
  {
    region: "Adelaide SA",
    tradeCategory: "Tiling (wet area)",
    projectType: "Townhouse",
    rollingAvgPerSqm: 145,
    sampleSize: 19,
    confidenceScore: 78,
    monthMovementPct: 1.8,
    quarterMovementPct: 3.4,
  },
];

export type RatePoint = { month: string; value: number };

export const RATE_MOVEMENT_FRAMING: RatePoint[] = [
  { month: "Jun 25", value: 271 },
  { month: "Jul 25", value: 273 },
  { month: "Aug 25", value: 270 },
  { month: "Sep 25", value: 274 },
  { month: "Oct 25", value: 276 },
  { month: "Nov 25", value: 275 },
  { month: "Dec 25", value: 278 },
  { month: "Jan 26", value: 280 },
  { month: "Feb 26", value: 282 },
  { month: "Mar 26", value: 281 },
  { month: "Apr 26", value: 283 },
  { month: "May 26", value: 285 },
];

/* ------------------------------------------------------------------
 * Director monthly reports archive
 * ----------------------------------------------------------------- */

export type DirectorReport = {
  id: string;
  month: string;
  deliveredDate: string | null;
  status: "Delivered" | "Drafting" | "Scheduled";
  netMarginPct: number;
  cashAtMonthEnd: number;
  activeProjects: number;
  flagsOpen: number;
  preparedBy: string;
};

export const DIRECTOR_REPORTS: DirectorReport[] = [
  {
    id: "R-2605",
    month: "May 2026",
    deliveredDate: null,
    status: "Drafting",
    netMarginPct: 15.8,
    cashAtMonthEnd: 537_000,
    activeProjects: 4,
    flagsOpen: 3,
    preparedBy: "Lara Cho · Director Reporting Analyst",
  },
  {
    id: "R-2604",
    month: "April 2026",
    deliveredDate: "2026-05-05",
    status: "Delivered",
    netMarginPct: 16.2,
    cashAtMonthEnd: 462_000,
    activeProjects: 4,
    flagsOpen: 2,
    preparedBy: "Lara Cho · Director Reporting Analyst",
  },
  {
    id: "R-2603",
    month: "March 2026",
    deliveredDate: "2026-04-05",
    status: "Delivered",
    netMarginPct: 17.1,
    cashAtMonthEnd: 388_000,
    activeProjects: 3,
    flagsOpen: 1,
    preparedBy: "Lara Cho · Director Reporting Analyst",
  },
  {
    id: "R-2602",
    month: "February 2026",
    deliveredDate: "2026-03-05",
    status: "Delivered",
    netMarginPct: 17.8,
    cashAtMonthEnd: 412_000,
    activeProjects: 3,
    flagsOpen: 0,
    preparedBy: "Lara Cho · Director Reporting Analyst",
  },
  {
    id: "R-2601",
    month: "January 2026",
    deliveredDate: "2026-02-05",
    status: "Delivered",
    netMarginPct: 17.4,
    cashAtMonthEnd: 374_000,
    activeProjects: 3,
    flagsOpen: 1,
    preparedBy: "Lara Cho · Director Reporting Analyst",
  },
];
