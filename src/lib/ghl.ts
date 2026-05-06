const GHL_API_BASE = "https://services.leadconnectorhq.com";
// BuildHawk location · Lead Qualification Pipeline · New Lead stage
const LOCATION_ID = process.env.GHL_LOCATION_ID || "sJHr1joAOg5ZYB2XxOTD";
const PIPELINE_ID = process.env.GHL_PIPELINE_ID || "u0LtKXA93fb8LYYXKarR";
const STAGE_ID = process.env.GHL_STAGE_ID || "01def813-6149-4c05-8d23-540194334ab2";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GHL_API_KEY}`,
    "Content-Type": "application/json",
    Version: "2021-07-28",
  };
}

export type GhlContactInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  tags?: string[];
};

export type GhlOpportunityInput = {
  contactId: string;
  name: string;
  source?: string;
};

export async function upsertContact(input: GhlContactInput): Promise<string | null> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return null;

  const [firstName, ...rest] = input.name.trim().split(" ");
  const lastName = rest.join(" ") || undefined;

  try {
    const res = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        locationId: LOCATION_ID,
        firstName,
        lastName,
        email: input.email,
        phone: input.phone,
        companyName: input.company,
        source: input.source || "buildhawk-site",
        tags: input.tags ?? [],
      }),
    });
    if (!res.ok) {
      console.error("[ghl] upsertContact failed:", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    return data.contact?.id ?? null;
  } catch (err) {
    console.error("[ghl] upsertContact error:", err);
    return null;
  }
}

export async function createOpportunity(input: GhlOpportunityInput): Promise<void> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return;

  try {
    const res = await fetch(`${GHL_API_BASE}/opportunities/`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        pipelineId: PIPELINE_ID,
        pipelineStageId: STAGE_ID,
        locationId: LOCATION_ID,
        contactId: input.contactId,
        name: input.name,
        status: "open",
        source: input.source || "buildhawk-site",
      }),
    });
    if (!res.ok) {
      console.error("[ghl] createOpportunity failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[ghl] createOpportunity error:", err);
  }
}
