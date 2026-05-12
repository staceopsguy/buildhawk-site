// Reference data sourced from BuildHawk-Project-Workbook-v1.0.xlsx
// Sheets: 02 Trade Sections, 03 Regions

export type TradeSection = {
  code: string;
  section: string;
  group: string;
};

export const TRADE_SECTIONS: TradeSection[] = [
  { code: "01.00", section: "Preliminaries", group: "Preliminaries" },
  { code: "01.01", section: "Site costs and supervision", group: "Preliminaries" },
  { code: "01.02", section: "Demolition", group: "Preliminaries" },
  { code: "01.03", section: "Site preparation and earthworks", group: "Preliminaries" },
  { code: "02.00", section: "Substructure", group: "Substructure" },
  { code: "02.01", section: "Footings and concrete slab", group: "Substructure" },
  { code: "02.02", section: "Subfloor drainage", group: "Substructure" },
  { code: "02.03", section: "Termite protection", group: "Substructure" },
  { code: "03.00", section: "Superstructure", group: "Superstructure" },
  { code: "03.01", section: "Framing - timber", group: "Superstructure" },
  { code: "03.02", section: "Framing - steel", group: "Superstructure" },
  { code: "03.03", section: "Bricklaying and masonry", group: "Superstructure" },
  { code: "03.04", section: "Roofing structure", group: "Superstructure" },
  { code: "04.00", section: "External envelope", group: "External" },
  { code: "04.01", section: "Roof covering", group: "External" },
  { code: "04.02", section: "Cladding and external lining", group: "External" },
  { code: "04.03", section: "Windows and external doors", group: "External" },
  { code: "05.00", section: "Services", group: "Services" },
  { code: "05.01", section: "Plumbing rough-in and fit-off", group: "Services" },
  { code: "05.02", section: "Electrical rough-in and fit-off", group: "Services" },
  { code: "05.03", section: "Gas", group: "Services" },
  { code: "05.04", section: "Data and communications", group: "Services" },
  { code: "05.05", section: "HVAC and mechanical", group: "Services" },
  { code: "05.06", section: "Solar and battery", group: "Services" },
  { code: "06.00", section: "Internal lining and joinery", group: "Internal" },
  { code: "06.01", section: "Insulation", group: "Internal" },
  { code: "06.02", section: "Plasterboard and linings", group: "Internal" },
  { code: "06.03", section: "Internal doors and hardware", group: "Internal" },
  { code: "06.04", section: "Skirting and architraves", group: "Internal" },
  { code: "07.00", section: "Wet areas", group: "Wet Areas" },
  { code: "07.01", section: "Waterproofing", group: "Wet Areas" },
  { code: "07.02", section: "Tiling", group: "Wet Areas" },
  { code: "08.00", section: "Finishes", group: "Finishes" },
  { code: "08.01", section: "Painting", group: "Finishes" },
  { code: "08.02", section: "Cabinetry and joinery", group: "Finishes" },
  { code: "08.03", section: "Stone and benchtops", group: "Finishes" },
  { code: "08.04", section: "Flooring - hard", group: "Finishes" },
  { code: "08.05", section: "Flooring - soft", group: "Finishes" },
  { code: "08.06", section: "Final clean", group: "Finishes" },
  { code: "09.00", section: "External works", group: "External Works" },
  { code: "09.01", section: "Landscaping and paving", group: "External Works" },
  { code: "09.02", section: "Fencing and gates", group: "External Works" },
  { code: "10.00", section: "Provisional sums and PC items", group: "Provisionals" },
  { code: "11.00", section: "Allowances", group: "Allowances" },
  { code: "12.00", section: "Contingency", group: "Contingency" },
  { code: "13.00", section: "Margin and overheads", group: "Margin" },
];

export type Region = {
  country: "AU" | "NZ";
  code: string;
  state: string;
  name: string;
};

export const REGIONS: Region[] = [
  { country: "AU", code: "NSW-SYD", state: "NSW", name: "Sydney Metro" },
  { country: "AU", code: "NSW-HUN", state: "NSW", name: "Hunter" },
  { country: "AU", code: "NSW-ILL", state: "NSW", name: "Illawarra" },
  { country: "AU", code: "NSW-REG", state: "NSW", name: "Regional NSW" },
  { country: "AU", code: "VIC-MEL", state: "VIC", name: "Melbourne Metro" },
  { country: "AU", code: "VIC-GEE", state: "VIC", name: "Geelong" },
  { country: "AU", code: "VIC-REG", state: "VIC", name: "Regional VIC" },
  { country: "AU", code: "QLD-BNE", state: "QLD", name: "Brisbane Metro" },
  { country: "AU", code: "QLD-GLD", state: "QLD", name: "Gold Coast" },
  { country: "AU", code: "QLD-SUN", state: "QLD", name: "Sunshine Coast" },
  { country: "AU", code: "QLD-REG", state: "QLD", name: "Regional QLD" },
  { country: "AU", code: "WA-PER", state: "WA", name: "Perth Metro" },
  { country: "AU", code: "WA-REG", state: "WA", name: "Regional WA" },
  { country: "AU", code: "SA-ADL", state: "SA", name: "Adelaide Metro" },
  { country: "AU", code: "SA-REG", state: "SA", name: "Regional SA" },
  { country: "AU", code: "TAS-HOB", state: "TAS", name: "Hobart" },
  { country: "AU", code: "TAS-LAU", state: "TAS", name: "Launceston" },
  { country: "AU", code: "ACT", state: "ACT", name: "Canberra ACT" },
  { country: "AU", code: "NT", state: "NT", name: "Northern Territory" },
  { country: "NZ", code: "NZ-AKL", state: "AKL", name: "Auckland" },
  { country: "NZ", code: "NZ-WLG", state: "WLG", name: "Wellington" },
  { country: "NZ", code: "NZ-CAN", state: "CAN", name: "Canterbury" },
  { country: "NZ", code: "NZ-WAI", state: "WAI", name: "Waikato" },
  { country: "NZ", code: "NZ-BOP", state: "BOP", name: "Bay of Plenty" },
  { country: "NZ", code: "NZ-OTA", state: "OTA", name: "Otago" },
  { country: "NZ", code: "NZ-OTH", state: "OTH", name: "Other NZ" },
];

export const PROJECT_TYPES = [
  "Residential build · single dwelling",
  "Residential build · duplex",
  "Residential build · townhouse",
  "Residential build · multi-unit",
  "Knockdown rebuild",
  "Major renovation",
  "Passivhaus",
  "Owner-builder support",
];

export const PROCUREMENT_MODELS = ["Fixed price", "Cost plus", "Construction management"];

export const CONTRACT_TYPES = ["HIA", "MBA", "NZS3910", "Custom"];

export const RFQ_STATUSES = [
  "Drafted",
  "Issued",
  "Follow-up due",
  "Response received",
  "Validated",
  "Declined",
] as const;

export const VARIATION_STATUSES = [
  "Draft",
  "Pending client",
  "Pending director",
  "Approved",
  "Rejected",
] as const;

export const RISK_STATUSES = ["Open", "Mitigating", "Accepted", "Closed"] as const;

export const DEFAULT_RISK_TEMPLATES = [
  "Trade availability delays during procurement",
  "Material price escalation",
  "Weather impact on slab and frame stages",
  "Client variation creep",
  "Subcontractor insolvency",
  "Defective work requiring rectification",
  "Council inspection delays",
];

export const STANDARD_CLAIM_STAGES = [
  "Deposit",
  "Base stage",
  "Frame stage",
  "Lock-up stage",
  "Fixing stage",
  "Practical completion",
  "Final claim",
];

export const CLAIM_STATUSES = ["Drafted", "Issued", "Approved", "Paid", "Disputed"] as const;

export const ALLIANCE_TIER_OPTIONS = ["None", "Listed", "Preferred"] as const;

export const AWARDED_INSURANCE_STATUSES = [
  "Verified",
  "Pending",
  "Expired",
  "Not provided",
] as const;

export const CASHFLOW_INFLOW_CATEGORIES = [
  "Progress claims",
  "Retention release",
  "Variation claims",
  "Other",
] as const;

export const CASHFLOW_OUTFLOW_CATEGORIES = [
  "Subcontractor payments",
  "Material payments",
  "Overheads",
  "Other",
] as const;
