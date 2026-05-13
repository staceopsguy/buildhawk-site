/**
 * GHL client. Originally scoped to the Homes by NH location; now accepts a
 * `GhlConfig` so SaaS tenants can each bring their own GHL credentials and
 * location ID. Falls back to env-var single-tenant config for legacy callers.
 */

import { getLegacyGhlConfig, type GhlConfig } from "@/lib/integrations";

const GHL_API_BASE = "https://services.leadconnectorhq.com";

/**
 * Resolve a GhlConfig for the lib's GHL clients.
 *
 * Multi-tenant correctness: this previously fell back to `getLegacyGhlConfig()`
 * (HBNH env vars) when no config was passed. That leaked HBNH data into any
 * signed-in tenant that had no integration row of their own. Now the lib
 * requires callers to pass an explicit config — callers handle the fallback.
 */
const requireConfig = (cfg: GhlConfig | null | undefined): GhlConfig | null => {
  return cfg ?? null;
};

// Pipeline IDs (Homes by NH location)
export const HBNH_PIPELINES = {
  sales: "NfpFMoPBbMwics84ZoTs", // Sales & Project Pipeline
  contractAdmin: "hkg79Z9tCxyzCOaehQtR", // Contract Administration
  estimating: "lOmZKnqAfuAYx0flvknq",
  rfq: "pDtuEMzwDvikUeIiYhAe",
} as const;

// Sales & Project Pipeline stages (id → name + win probability)
export const HBNH_SALES_STAGES = {
  newInquiry: "3b5f38e0-95c4-4b3a-b5d8-efd9be1105e1",
  newInquiryReview: "178b0465-a070-4c02-96b0-a999c34a96ea",
  initialCall: "1de1d925-c319-4951-b659-4f8d5fadab81",
  siteVisit: "507ab6d6-5d98-4500-9630-c92363579812",
  proposalSent: "de76e294-cc4d-4efb-be94-fd0df47288ec",
  proposalAccepted: "264a1a9c-85d6-4926-b547-2741a0026341",
  preConstruction: "54aef6d5-cb4b-4fa0-9043-e072756756d8",
  underConstruction: "d3b11296-b609-4efc-9dfd-1cc937b13bbe",
  completed: "52de0cdd-fac2-4553-a463-7060e9fe7fe1",
  lost: "cda21e68-ae61-4a83-b181-cd0267a97735",
  closed: "8a9960a0-9af7-478a-8202-9ff2a297b380",
} as const;

// Custom field IDs in the Homes by NH location (discovered from existing opportunities)
const CUSTOM_FIELDS = {
  projectAddress: "Vhr8vCn0GWMPCEckdV28", // string · "202 Autumn St Geelong West, VIC 3218"
  projectValue: "XRUsgAfL80pxrRzEyKvp", // number · explicit project budget (mirrors monetaryValue)
  notes: "keieAalptLn8nGsC5tsZ", // string · long notes / project log
};

// ID of a multi-line text custom field used to store the BuildHawk financial overlay JSON.
// Created once per tenant's GHL location (key: bh_project_data) and stored on the
// tenant's integration record. If not set, overlays cannot be saved.
export const isProjectDataFieldConfigured = (cfg?: GhlConfig | null) =>
  Boolean((cfg ?? getLegacyGhlConfig())?.projectDataFieldId);

export type BoqLine = {
  id: string;
  code?: string;
  description?: string;
  tradeSection?: string;
  unit?: string;
  qty?: number;
  labourRate?: number;
  materialRate?: number;
  subRate?: number;
  notes?: string;
};

export type RfqRecord = {
  id: string;
  rfqId?: string;
  tradeSection?: string;
  scopeSummary?: string;
  supplier?: string;
  dateSent?: string;
  responseDue?: string;
  dateReceived?: string;
  status?: string;
  quotedValue?: number;
  notes?: string;
};

export type VariationRecord = {
  id: string;
  voNumber?: string;
  dateRaised?: string;
  description?: string;
  tradeSection?: string;
  costImpact?: number;
  revenueImpact?: number;
  daysImpact?: number;
  clientSigned?: boolean;
  directorGate?: "Not required" | "Pending" | "Approved" | "Rejected";
  status?: string;
  notes?: string;
};

export type CostToCompleteLine = {
  id: string;
  code?: string;
  tradeSection?: string;
  budget?: number;
  committed?: number;
  spentToDate?: number;
  percentComplete?: number;
  forecastAtCompletion?: number;
  notes?: string;
};

export type RiskRecord = {
  id: string;
  riskId?: string;
  description?: string;
  mitigation?: string;
  likelihood?: number;
  impact?: number;
  owner?: string;
  reviewDate?: string;
  status?: string;
  notes?: string;
};

export type ProjectSetup = {
  projectCode?: string;
  builderBusinessName?: string;
  builderABN?: string;
  clientName?: string;
  siteAddress?: string;
  regionCode?: string;
  projectType?: string;
  procurementModel?: string;
  contractType?: string;
  contractValueExGst?: number;
  gstRate?: number;
  contractValueIncGst?: number;
  budgetedCogs?: number;
  varianceThresholdPct?: number;
  directorApprovalThreshold?: number;
  contractSignedDate?: string;
  siteStartDate?: string;
  practicalCompletionTarget?: string;
  programmeMonths?: number;
  defectsLiabilityMonths?: number;
};

export type QuoteComparisonRow = {
  id: string;
  tradeSection?: string;
  scope?: string;
  hawktressBenchmark?: number;
  supplierA?: string;
  quoteA?: number;
  supplierB?: string;
  quoteB?: number;
  supplierC?: string;
  quoteC?: number;
  awardedSupplier?: string;
  notes?: string;
};

export type AwardedSub = {
  id: string;
  subId?: string;
  tradeSection?: string;
  supplier?: string;
  scope?: string;
  awardedValue?: number;
  poNumber?: string;
  awardDate?: string;
  insuranceStatus?: string;
  notes?: string;
};

export type ClaimRecord = {
  id: string;
  claimNumber?: string;
  stage?: string;
  dateRaised?: string;
  percentCompleteThisStage?: number;
  stageValue?: number;
  claimGross?: number;
  retentionPct?: number;
  approvedDate?: string;
  paidDate?: string;
  status?: string;
  notes?: string;
};

export type CashflowEntry = {
  id: string;
  weekNumber: number;
  weekStarting?: string;
  inflowsProgressClaims?: number;
  inflowsRetention?: number;
  inflowsVariations?: number;
  inflowsOther?: number;
  outflowsSubs?: number;
  outflowsMaterials?: number;
  outflowsOverheads?: number;
  outflowsOther?: number;
  notes?: string;
};

export type ProjectSupplier = {
  id: string;
  supplierId?: string;
  businessName?: string;
  primaryTrade?: string;
  abn?: string;
  primaryRegion?: string;
  allianceTier?: string;
  contactEmail?: string;
  phone?: string;
  notes?: string;
};

export type ProjectOverlay = {
  // Top-level financials (existing — kept for backwards compat)
  committed?: number;
  invoiced?: number;
  targetMarginPct?: number;
  liveMarginPct?: number;
  percentComplete?: number;
  durationMonths?: number;
  monthsElapsed?: number;
  status?: "On track" | "Margin erosion" | "Variation pending";
  notes?: string;
  // Workbook collections
  setup?: ProjectSetup;
  boq?: BoqLine[];
  rfqs?: RfqRecord[];
  quoteComparisons?: QuoteComparisonRow[];
  awardedSubs?: AwardedSub[];
  variations?: VariationRecord[];
  costToComplete?: CostToCompleteLine[];
  claims?: ClaimRecord[];
  cashflow?: CashflowEntry[];
  risks?: RiskRecord[];
  suppliers?: ProjectSupplier[];
  // Audit
  lastUpdated?: string;
  lastUpdatedBy?: string;
};

const parseOverlay = (raw: string | undefined): ProjectOverlay | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed as ProjectOverlay;
  } catch {
    // not JSON; ignore
  }
  return null;
};

export type HbnhProject = {
  id: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  status: "open" | "won" | "lost" | "abandoned";
  budget: number;
  contactName?: string;
  contactCompany?: string;
  address?: string;
  region: string;
  type: string;
  percentComplete: number;
  derivedStatus: "On track" | "Margin erosion" | "Variation pending" | "Not started" | "Completed";
  overlay: ProjectOverlay | null;
  source: "ghl";
  createdAt: string;
  updatedAt: string;
};

export const isGhlConnected = (cfg?: GhlConfig | null) => Boolean(requireConfig(cfg));

const headers = (cfg: GhlConfig) => ({
  Authorization: `Bearer ${cfg.apiKey}`,
  "Content-Type": "application/json",
  Version: "2021-07-28",
});

const PIPELINE_NAMES: Record<string, string> = {
  [HBNH_PIPELINES.sales]: "Sales & Project",
  [HBNH_PIPELINES.contractAdmin]: "Contract Administration",
  [HBNH_PIPELINES.estimating]: "Estimating",
  [HBNH_PIPELINES.rfq]: "RFQ",
};

const STAGE_TO_PROGRESS: Record<string, number> = {
  [HBNH_SALES_STAGES.newInquiry]: 5,
  [HBNH_SALES_STAGES.newInquiryReview]: 10,
  [HBNH_SALES_STAGES.initialCall]: 15,
  [HBNH_SALES_STAGES.siteVisit]: 25,
  [HBNH_SALES_STAGES.proposalSent]: 35,
  [HBNH_SALES_STAGES.proposalAccepted]: 45,
  [HBNH_SALES_STAGES.preConstruction]: 55,
  [HBNH_SALES_STAGES.underConstruction]: 75,
  [HBNH_SALES_STAGES.completed]: 100,
  // Contract Administration stages (id → progress)
  "a8c2aa3a-1fed-45b1-b75f-255365b1693d": 10, // Contract Execution
  "06284b2d-719f-4911-bcb6-55783f07de41": 25, // Pre-Construction
  "e08f649f-fa27-4541-9da4-7eee1d3fbca1": 35, // Site Setup
  "addd342b-1c36-4886-96bc-364fb4a88bf7": 65, // Construction
  "5782f07b-418d-4390-9b66-f6d3d3f35cdc": 75, // Variations
  "048a7037-8421-4527-a140-156e9320a6e2": 90, // Practical Completion
  "6d084e4b-38aa-49d1-b290-054b0cc24fc5": 95, // Defects / DLP
  "e5e2a8db-218b-4ccc-89a4-22bf6a518913": 100, // Handover
};

const STAGE_TO_DERIVED_STATUS: Record<string, HbnhProject["derivedStatus"]> = {
  [HBNH_SALES_STAGES.underConstruction]: "On track",
  [HBNH_SALES_STAGES.preConstruction]: "On track",
  [HBNH_SALES_STAGES.completed]: "Completed",
  [HBNH_SALES_STAGES.closed]: "Completed",
  "addd342b-1c36-4886-96bc-364fb4a88bf7": "On track", // Construction (CA pipeline)
  "5782f07b-418d-4390-9b66-f6d3d3f35cdc": "Variation pending", // Variations (CA pipeline)
  "048a7037-8421-4527-a140-156e9320a6e2": "Completed", // Practical Completion
  "e5e2a8db-218b-4ccc-89a4-22bf6a518913": "Completed", // Handover
};

const REGION_PATTERNS: { pattern: RegExp; region: string }[] = [
  { pattern: /\bGeelong|Newtown|Fyansford|Manifold/i, region: "Geelong VIC" },
  { pattern: /\bApollo Bay|Lorne|Anglesea|Jan Juc|Torquay/i, region: "Surf Coast VIC" },
  { pattern: /\bMelbourne|Carlton|Brunswick|Fitzroy|Northcote|Middle Park/i, region: "Melbourne VIC" },
  { pattern: /\bStawell|Ballarat|Bendigo/i, region: "Regional VIC" },
  { pattern: /\bSydney|Bondi|Manly|Parramatta/i, region: "Sydney NSW" },
];

const inferRegion = (address: string | undefined, name: string) => {
  const haystack = `${address ?? ""} ${name}`;
  for (const { pattern, region } of REGION_PATTERNS) {
    if (pattern.test(haystack)) return region;
  }
  if (/\bVIC\b/i.test(haystack)) return "Victoria";
  if (/\bNSW\b/i.test(haystack)) return "New South Wales";
  return "Victoria"; // Homes by NH default
};

const inferType = (name: string): string => {
  if (/improvement|renovation|reno\b/i.test(name)) return "Renovation";
  if (/duplex/i.test(name)) return "Duplex";
  if (/townhouse/i.test(name)) return "Townhouse";
  if (/passivhaus|passive house/i.test(name)) return "Passivhaus";
  if (/knockdown|kdr/i.test(name)) return "Knockdown Rebuild";
  return "Residential build";
};

type GhlOpportunity = {
  id: string;
  name: string;
  monetaryValue?: number;
  pipelineId: string;
  pipelineStageId: string;
  status: HbnhProject["status"];
  contactId?: string;
  createdAt: string;
  updatedAt: string;
  customFields?: Array<{
    id: string;
    fieldValueString?: string;
    fieldValueNumber?: number;
    fieldValueArray?: string[];
    fieldValueDate?: number;
  }>;
  contact?: {
    id?: string;
    name?: string;
    companyName?: string | null;
    email?: string | null;
    phone?: string | null;
  };
};

const customFieldString = (op: GhlOpportunity, fieldId: string): string | undefined =>
  op.customFields?.find((f) => f.id === fieldId)?.fieldValueString;

const customFieldNumber = (op: GhlOpportunity, fieldId: string): number | undefined =>
  op.customFields?.find((f) => f.id === fieldId)?.fieldValueNumber;

const mapOpportunityToProject = (op: GhlOpportunity, projectDataFieldId?: string): HbnhProject => {
  const address = customFieldString(op, CUSTOM_FIELDS.projectAddress);
  const explicitValue = customFieldNumber(op, CUSTOM_FIELDS.projectValue);
  const budget = explicitValue ?? op.monetaryValue ?? 0;
  const overlay = projectDataFieldId
    ? parseOverlay(customFieldString(op, projectDataFieldId))
    : null;
  return {
    id: op.id,
    name: op.name,
    pipelineId: op.pipelineId,
    pipelineStageId: op.pipelineStageId,
    status: op.status,
    budget,
    contactName: op.contact?.name ?? undefined,
    contactCompany: op.contact?.companyName ?? undefined,
    address,
    region: inferRegion(address, op.name),
    type: inferType(op.name),
    percentComplete: overlay?.percentComplete ?? STAGE_TO_PROGRESS[op.pipelineStageId] ?? 50,
    derivedStatus:
      overlay?.status ?? STAGE_TO_DERIVED_STATUS[op.pipelineStageId] ?? "Not started",
    overlay,
    source: "ghl",
    createdAt: op.createdAt,
    updatedAt: op.updatedAt,
  };
};

/**
 * Fetch active projects from Homes by NH.
 * Pulls from both Sales & Project (open) and Contract Administration (won) pipelines.
 * Returns null if GHL is not configured.
 */
export async function getActiveProjects(
  config?: GhlConfig | null,
): Promise<HbnhProject[] | null> {
  const cfg = requireConfig(config);
  if (!cfg) return null;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const url = new URL(`${GHL_API_BASE}/opportunities/search`);
    url.searchParams.set("location_id", cfg.locationId);
    url.searchParams.set("limit", "100");
    const res = await fetch(url.toString(), {
      headers: headers(cfg),
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      console.error("[ghl] search failed:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const opportunities: GhlOpportunity[] = data.opportunities ?? [];

    // Active = open in any pipeline OR won in Contract Admin (active construction).
    // Note: the sales/contract-admin pipeline IDs below are Homes by NH specific.
    // For new tenants whose pipelines differ, the filter falls back to "open or won".
    const active = opportunities.filter((op) => {
      if (op.status === "open") return true;
      if (op.status === "won" && op.pipelineId === HBNH_PIPELINES.contractAdmin) return true;
      return false;
    });

    return active
      .map((op) => mapOpportunityToProject(op, cfg.projectDataFieldId))
      .sort((a, b) => b.budget - a.budget);
  } catch (e) {
    clearTimeout(timeout);
    console.error("[ghl] getActiveProjects error:", e);
    return null;
  }
}

/**
 * Upsert a contact in Homes by NH.
 */
async function upsertContact(
  input: {
    name: string;
    email: string;
    phone?: string;
    companyName?: string;
  },
  cfg: GhlConfig,
): Promise<string | null> {
  const [firstName, ...rest] = input.name.trim().split(" ");
  const lastName = rest.join(" ") || undefined;
  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: headers(cfg),
      body: JSON.stringify({
        locationId: cfg.locationId,
        firstName,
        lastName,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        source: "buildhawk-cost-plan-console",
        tags: ["cost-plan-console"],
      }),
    });
    if (!res.ok) {
      console.error("[ghl] upsertContact failed:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.contact?.id ?? null;
  } catch (e) {
    console.error("[ghl] upsertContact error:", e);
    return null;
  }
}

export type CreateProjectInput = {
  projectName: string;
  address?: string;
  budget: number;
  pipelineId: string;
  pipelineStageId: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  notes?: string;
};

export type CreateProjectResult =
  | { ok: true; opportunityId: string; pipelineName: string }
  | { ok: false; error: string };

/**
 * Create a project (opportunity + contact) in Homes by NH.
 */
export async function createProject(
  input: CreateProjectInput,
  config?: GhlConfig | null,
): Promise<CreateProjectResult> {
  const cfg = requireConfig(config);
  if (!cfg) {
    return { ok: false, error: "GHL not connected. Connect a location in Settings." };
  }
  const contactId = await upsertContact(
    {
      name: input.contactName,
      email: input.contactEmail,
      phone: input.contactPhone,
    },
    cfg,
  );
  if (!contactId) {
    return { ok: false, error: "Could not create or find contact in GHL." };
  }

  const customFields: Array<{ id: string; field_value: string | number }> = [];
  if (input.address) {
    customFields.push({ id: CUSTOM_FIELDS.projectAddress, field_value: input.address });
  }
  customFields.push({ id: CUSTOM_FIELDS.projectValue, field_value: input.budget });
  if (input.notes) {
    customFields.push({ id: CUSTOM_FIELDS.notes, field_value: input.notes });
  }

  try {
    const res = await fetch(`${GHL_API_BASE}/opportunities/`, {
      method: "POST",
      headers: headers(cfg),
      body: JSON.stringify({
        pipelineId: input.pipelineId,
        pipelineStageId: input.pipelineStageId,
        locationId: cfg.locationId,
        contactId,
        name: input.projectName,
        status: "open",
        monetaryValue: input.budget,
        source: "buildhawk-cost-plan-console",
        customFields,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("[ghl-hbnh] createProject failed:", res.status, body);
      return { ok: false, error: `GHL responded ${res.status}: ${body.slice(0, 200)}` };
    }
    const data = await res.json();
    return {
      ok: true,
      opportunityId: data.opportunity?.id ?? data.id ?? "unknown",
      pipelineName: PIPELINE_NAMES[input.pipelineId] ?? "Pipeline",
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Fetch a single Homes by NH opportunity by ID, mapped into the HbnhProject shape.
 * Returns null if not found, GHL is not configured, or the call errors.
 */
export async function getProjectById(
  id: string,
  config?: GhlConfig | null,
): Promise<HbnhProject | null> {
  const cfg = requireConfig(config);
  if (!cfg) return null;
  try {
    const res = await fetch(`${GHL_API_BASE}/opportunities/${encodeURIComponent(id)}`, {
      headers: headers(cfg),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[ghl] getProjectById failed:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const op: GhlOpportunity | undefined = data.opportunity ?? data;
    if (!op?.id) return null;
    return mapOpportunityToProject(op, cfg.projectDataFieldId);
  } catch (e) {
    console.error("[ghl] getProjectById error:", e);
    return null;
  }
}

export type UpdateOverlayInput = {
  opportunityId: string;
  overlay: ProjectOverlay;
  pipelineStageId?: string;
  budget?: number; // monetaryValue override
  updatedBy?: string;
};

export type UpdateOverlayResult =
  | { ok: true; opportunityId: string }
  | { ok: false; error: string };

/**
 * Persist a project's BuildHawk financial overlay.
 *
 * Writes:
 *   - The overlay JSON to the configured custom field (GHL_HBNH_PROJECT_DATA_FIELD_ID).
 *   - monetaryValue if budget is provided.
 *   - pipelineStageId if a new stage is provided.
 */
export async function updateProjectOverlay(
  input: UpdateOverlayInput,
  config?: GhlConfig | null,
): Promise<UpdateOverlayResult> {
  const cfg = requireConfig(config);
  if (!cfg) {
    return { ok: false, error: "GHL not connected. Connect a location in Settings." };
  }
  if (!cfg.projectDataFieldId) {
    return {
      ok: false,
      error:
        "Project-data custom field ID not set on this tenant's GHL integration. In GHL, create a multi-line text custom field (suggested key: bh_project_data), then add its ID via Settings.",
    };
  }

  const overlayWithMeta: ProjectOverlay = {
    ...input.overlay,
    lastUpdated: new Date().toISOString(),
    lastUpdatedBy: input.updatedBy ?? "Cost Plan Console",
  };

  const customFields: Array<{ id: string; field_value: string | number }> = [
    { id: cfg.projectDataFieldId, field_value: JSON.stringify(overlayWithMeta) },
  ];

  if (typeof input.budget === "number") {
    customFields.push({ id: CUSTOM_FIELDS.projectValue, field_value: input.budget });
  }

  const body: Record<string, unknown> = { customFields };
  if (input.pipelineStageId) body.pipelineStageId = input.pipelineStageId;
  if (typeof input.budget === "number") body.monetaryValue = input.budget;

  try {
    const res = await fetch(
      `${GHL_API_BASE}/opportunities/${encodeURIComponent(input.opportunityId)}`,
      {
        method: "PUT",
        headers: headers(cfg),
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      const text = await res.text();
      console.error("[ghl] updateProjectOverlay failed:", res.status, text);
      return { ok: false, error: `GHL responded ${res.status}: ${text.slice(0, 200)}` };
    }
    return { ok: true, opportunityId: input.opportunityId };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export const PIPELINE_OPTIONS = [
  {
    id: HBNH_PIPELINES.sales,
    label: "Sales & Project Pipeline",
    stages: [
      { id: HBNH_SALES_STAGES.newInquiry, label: "New Inquiry" },
      { id: HBNH_SALES_STAGES.initialCall, label: "Initial Call" },
      { id: HBNH_SALES_STAGES.siteVisit, label: "Site Visit" },
      { id: HBNH_SALES_STAGES.proposalSent, label: "Proposal Sent" },
      { id: HBNH_SALES_STAGES.proposalAccepted, label: "Proposal Accepted" },
      { id: HBNH_SALES_STAGES.preConstruction, label: "Pre-Construction" },
      { id: HBNH_SALES_STAGES.underConstruction, label: "Under Construction" },
    ],
  },
  {
    id: HBNH_PIPELINES.contractAdmin,
    label: "Contract Administration",
    stages: [
      { id: "a8c2aa3a-1fed-45b1-b75f-255365b1693d", label: "Contract Execution" },
      { id: "06284b2d-719f-4911-bcb6-55783f07de41", label: "Pre-Construction" },
      { id: "e08f649f-fa27-4541-9da4-7eee1d3fbca1", label: "Site Setup" },
      { id: "addd342b-1c36-4886-96bc-364fb4a88bf7", label: "Construction" },
      { id: "5782f07b-418d-4390-9b66-f6d3d3f35cdc", label: "Variations" },
    ],
  },
];
