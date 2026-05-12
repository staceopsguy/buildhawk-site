/**
 * Connector catalog.
 *
 * Source of truth for every PM, CRM, accounting or productivity tool Hawktress
 * can integrate with. Each entry declares: identity (id, name, vendor, group),
 * status (live / beta / planned / on-request), auth flavor, and what data it
 * brings into the Cost Plan Console.
 *
 * Status definitions:
 *   live       Fully wired. Data flows in production today.
 *   beta       Wired but rough. Available on request; we'll handhold setup.
 *   planned    On the roadmap. We collect interest via the "Request" flow.
 *   on-request Niche or one-off. Build is custom, scoped per customer.
 */

export type ConnectorStatus = "live" | "beta" | "planned" | "on-request";

export type ConnectorGroup =
  | "Construction PM"
  | "CRM + sales"
  | "Trade + service"
  | "Accounting"
  | "Generic PM"
  | "Custom / fallback";

export type ConnectorAuth =
  | "api-key"
  | "oauth"
  | "private-token"
  | "webhook"
  | "csv"
  | "manual";

export type Connector = {
  id: string;
  name: string;
  vendor: string;
  blurb: string;
  group: ConnectorGroup;
  status: ConnectorStatus;
  auth: ConnectorAuth;
  // Free-text describing what we pull/push.
  flow: string;
  // For OAuth / API-key connectors the user needs to know what to grab.
  setupHint?: string;
  // Whether tenants can self-serve enable from Settings.
  selfServe: boolean;
};

export const CONNECTORS: Connector[] = [
  // ─────────── Construction-specific PM ───────────
  {
    id: "ghl",
    name: "GoHighLevel",
    vendor: "GoHighLevel",
    blurb: "Sales pipelines, opportunities, contacts for residential builders.",
    group: "CRM + sales",
    status: "live",
    auth: "private-token",
    flow: "Pulls opportunities, contacts, pipeline stages. Writes back project overlays as a custom field.",
    setupHint: "Create a Private Integration Token in your GHL location (Settings → Integrations).",
    selfServe: true,
  },
  {
    id: "buildxact",
    name: "Buildxact",
    vendor: "Buildxact",
    blurb: "Australian estimating + job costing software.",
    group: "Construction PM",
    status: "planned",
    auth: "oauth",
    flow: "Estimates, takeoffs, suppliers, job actuals.",
    selfServe: false,
  },
  {
    id: "procore",
    name: "Procore",
    vendor: "Procore Technologies",
    blurb: "Construction management platform (commercial + residential).",
    group: "Construction PM",
    status: "planned",
    auth: "oauth",
    flow: "Projects, budgets, change orders, RFIs, daily logs.",
    selfServe: false,
  },
  {
    id: "buildertrend",
    name: "Buildertrend",
    vendor: "Buildertrend",
    blurb: "Residential construction PM (US-origin, used in AU/NZ).",
    group: "Construction PM",
    status: "planned",
    auth: "oauth",
    flow: "Jobs, selections, change orders, schedules, invoices.",
    selfServe: false,
  },
  {
    id: "coconstruct",
    name: "CoConstruct",
    vendor: "Buildertrend",
    blurb: "Residential PM (now part of Buildertrend).",
    group: "Construction PM",
    status: "on-request",
    auth: "oauth",
    flow: "Custom-builder workflow, selections, change orders.",
    selfServe: false,
  },
  {
    id: "jobpac",
    name: "Jobpac",
    vendor: "Viewpoint Construction Software",
    blurb: "Enterprise construction accounting + PM (AU/NZ).",
    group: "Construction PM",
    status: "on-request",
    auth: "api-key",
    flow: "Job costs, commitments, subcontract management.",
    selfServe: false,
  },

  // ─────────── Trade / service-business ───────────
  {
    id: "servicem8",
    name: "ServiceM8",
    vendor: "ServiceM8",
    blurb: "Job + field service management for trades (popular in AU/NZ).",
    group: "Trade + service",
    status: "planned",
    auth: "oauth",
    flow: "Jobs, quotes, invoices, materials.",
    selfServe: false,
  },
  {
    id: "tradify",
    name: "Tradify",
    vendor: "Tradify",
    blurb: "Job management for trades (NZ-origin, big in AU).",
    group: "Trade + service",
    status: "planned",
    auth: "api-key",
    flow: "Jobs, quotes, timesheets, invoices.",
    selfServe: false,
  },
  {
    id: "simpro",
    name: "simPRO",
    vendor: "simPRO Software",
    blurb: "Enterprise trade + service business management.",
    group: "Trade + service",
    status: "planned",
    auth: "oauth",
    flow: "Quotes, jobs, project costs, recurring services.",
    selfServe: false,
  },
  {
    id: "aroflo",
    name: "AroFlo",
    vendor: "AroFlo",
    blurb: "Job management for trades + contractors.",
    group: "Trade + service",
    status: "on-request",
    auth: "api-key",
    flow: "Jobs, timesheets, quotes, invoices.",
    selfServe: false,
  },

  // ─────────── Accounting ───────────
  {
    id: "xero",
    name: "Xero",
    vendor: "Xero",
    blurb: "Cloud accounting (AU/NZ default).",
    group: "Accounting",
    status: "planned",
    auth: "oauth",
    flow: "Invoices, bills, debtor ageing, P&L by job.",
    selfServe: false,
  },
  {
    id: "myob",
    name: "MYOB",
    vendor: "MYOB",
    blurb: "AU/NZ accounting + payroll.",
    group: "Accounting",
    status: "planned",
    auth: "oauth",
    flow: "Invoices, bills, debtor ageing.",
    selfServe: false,
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    vendor: "Intuit",
    blurb: "Small-business accounting (used by some AU builders).",
    group: "Accounting",
    status: "on-request",
    auth: "oauth",
    flow: "Invoices, bills, AR/AP.",
    selfServe: false,
  },

  // ─────────── Generic PM / productivity ───────────
  {
    id: "monday",
    name: "monday.com",
    vendor: "monday.com",
    blurb: "Flexible work OS, common with builders using custom boards.",
    group: "Generic PM",
    status: "planned",
    auth: "api-key",
    flow: "Boards, items, status columns, file uploads.",
    selfServe: false,
  },
  {
    id: "clickup",
    name: "ClickUp",
    vendor: "ClickUp",
    blurb: "PM platform with custom fields.",
    group: "Generic PM",
    status: "planned",
    auth: "api-key",
    flow: "Tasks, custom fields, lists.",
    selfServe: false,
  },
  {
    id: "asana",
    name: "Asana",
    vendor: "Asana",
    blurb: "Project + task management.",
    group: "Generic PM",
    status: "on-request",
    auth: "oauth",
    flow: "Projects, tasks, custom fields.",
    selfServe: false,
  },
  {
    id: "notion",
    name: "Notion",
    vendor: "Notion Labs",
    blurb: "Databases used as ad-hoc project trackers.",
    group: "Generic PM",
    status: "on-request",
    auth: "oauth",
    flow: "Databases, pages, properties.",
    selfServe: false,
  },

  // ─────────── Custom / fallback ───────────
  {
    id: "webhook",
    name: "Generic webhook",
    vendor: "Any tool",
    blurb: "Push project events from any tool that can fire HTTP requests.",
    group: "Custom / fallback",
    status: "beta",
    auth: "webhook",
    flow: "Inbound webhook → project upsert by external_id. Supports any tool that emits JSON.",
    setupHint: "We'll generate a signed webhook URL once you enable this.",
    selfServe: true,
  },
  {
    id: "csv",
    name: "Manual CSV upload",
    vendor: "Any spreadsheet",
    blurb: "Drop a CSV monthly. Works if your PM tool doesn't have an API.",
    group: "Custom / fallback",
    status: "beta",
    auth: "csv",
    flow: "Upload a CSV with columns: name, region, budget, stage, percentComplete. We upsert by name.",
    selfServe: true,
  },
];

export const liveConnectors = () => CONNECTORS.filter((c) => c.status === "live");
export const findConnector = (id: string) => CONNECTORS.find((c) => c.id === id);

export const connectorGroups: ConnectorGroup[] = [
  "Construction PM",
  "CRM + sales",
  "Trade + service",
  "Accounting",
  "Generic PM",
  "Custom / fallback",
];

export const statusLabel: Record<ConnectorStatus, string> = {
  live: "Live",
  beta: "Beta",
  planned: "Coming soon",
  "on-request": "On request",
};
